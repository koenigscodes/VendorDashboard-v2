import { z } from "zod";

export const registerSchema = z.object({
    name: z.string()
        .trim()
        .min(3)
        .max(100),

    email: z.email()
        .trim()
        .toLowerCase()
        .max(255),

    password: z.string()
        .min(8)
        .max(128),
}).strict();

export const loginSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .pipe(z.email())
        .pipe(z.string().max(255)),
    password: z.string().min(1).max(128),
}).strict();