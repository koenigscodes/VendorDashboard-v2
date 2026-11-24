import "dotenv/config";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
}

export const authConfig = {
    accessTokenSecret: JWT_ACCESS_SECRET,
    accessTokenExpiresIn: 15 * 60,
};