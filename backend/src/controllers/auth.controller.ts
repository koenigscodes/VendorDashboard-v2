import type { Request, Response } from "express";

import { ZodError } from "zod";

import { registerSchema } from "../schemas/auth.schema.js";
import { registerUser } from "../services/auth.service.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { authenticateUser } from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        const user = await registerUser(validatedData);

        return res.status(201).json({
            message: "Registration successful",
            user,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Invalid registration data",
                errors: error.issues,
            });
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23505"
        ) {
            return res.status(409).json({
                message: "An account with this email already exists",
            });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
            message: "An unexpected error occurred",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await authenticateUser(
            validatedData.email,
            validatedData.password
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        return res.status(200).json({
            message: "Login successful",
            user,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Invalid login data",
                errors: error.issues,
            });
        }

        console.error("Login error:", error);

        return res.status(500).json({
            message: "An unexpected error occurred",
        });
    }
};