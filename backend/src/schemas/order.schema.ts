import { z } from "zod";

const createOrderSchema = z.object({
    customer: z.string().min(3),
    status: z.enum([
        "pending",
        "processing",
        "delivered",
        "cancelled",
    ]),
    total: z.number().positive(),
});

export default createOrderSchema;



//schemas/ answers:
//What data are we willing to accept at runtime?