import { z } from "zod";

export const orderStatusSchema = z.enum([
    "pending",
    "processing",
    "delivered",
    "cancelled",
]);

export const createOrderSchema = z.object({
    customer: z.string().min(3),
    total: z.number().positive(),
});

export const updateOrderSchema = z.object({
    customer: z.string().min(3).optional(),
    total: z.number().positive().optional(),
    status: orderStatusSchema.optional(),
}).refine((data) => Object.keys(data).length > 0);


//schemas answers:
//What data are we willing to accept at runtime?