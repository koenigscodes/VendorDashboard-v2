import { z } from "zod";

export const createOrderSchema = z.object({
    customer: z.string().min(3),
    status: z.enum([
        "pending",
        "processing",
        "delivered",
        "cancelled",
    ]),
    total: z.number().positive(),
});

export const updateOrderSchema = createOrderSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0);
//




//schemas answers:
//What data are we willing to accept at runtime?