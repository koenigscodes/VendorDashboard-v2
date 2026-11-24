import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";

import { pool } from "../config/database.js";
import { authConfig } from "../config/auth.config.js";

type RegisterInput = {
    name: string;
    email: string;
    password: string;
};

export const registerUser = async ({
    name,
    email,
    password,
}: RegisterInput) => {
    const passwordHash = await argon2.hash(password);

    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role`,
        [name, email, passwordHash, "vendor"]
    );

    return result.rows[0];
};

type AccessTokenPayload = {
    sub: string;
    email: string;
    role: "vendor" | "admin";
};

export const generateAccessToken = ({
    sub,
    email,
    role,
}: AccessTokenPayload): string => {
    return jwt.sign(
        { email, role },
        authConfig.accessTokenSecret,
        {
            subject: sub,
            expiresIn: authConfig.accessTokenExpiresIn,
        }
    );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    const decoded = jwt.verify(token, authConfig.accessTokenSecret);

    if (
        typeof decoded === "string" ||
        typeof decoded.sub !== "string" ||
        typeof decoded.email !== "string" ||
        (decoded.role !== "vendor" && decoded.role !== "admin")
    ) {
        throw new Error("Invalid access token payload");
    }

    return {
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role,
    };
};

const dummyPasswordHash = await argon2.hash(
    randomBytes(32).toString("hex")
);

type LoginUser = {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    role: "vendor" | "admin";
};

const findUserByEmail = async (
    email: string
): Promise<LoginUser | null> => {
    const result = await pool.query<LoginUser>(
        `SELECT id, name, email, password_hash, role
         FROM users
         WHERE email = $1`,
        [email]
    );

    return result.rows[0] ?? null;
};

export const authenticateUser = async (
    email: string,
    password: string
) => {
    const user = await findUserByEmail(email);

    const hashToVerify = user
        ? user.password_hash
        : dummyPasswordHash;

    const isPasswordValid = await argon2.verify(
        hashToVerify,
        password
    );

    if (!user || !isPasswordValid) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};