import type { Request, Response } from "express";
import orders from "../data/orders.js"

import createOrderSchema from "../schemas/order.schema.js";

const getOrders = (_req: Request, res: Response) => {
    res.json(orders);
};

const getOrderById = (req: Request, res: Response) => {
   const id = req.params.id;

   const order = orders.find(order => order.id === Number(id));

   if (!order) {
    return res.status(404).json({
        message: "order not found"
    });
   }
   
    res.json(order);
}

const createOrder = (req: Request, res: Response) => {
    const result = createOrderSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({message: "Invalid order"})
    }

     const highestId = orders.reduce((highestId, order) => {
        return order.id > highestId ? order.id : highestId; 
    }, 0);

    const newOrder = {
        id: highestId + 1,
        customer: result.data.customer,
        status: result.data.status,
        total: result.data.total
    };

    orders.push(newOrder);

    return res.status(201).json(newOrder);
}

export { getOrders, getOrderById, createOrder };
