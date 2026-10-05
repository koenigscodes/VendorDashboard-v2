import type { Request, Response } from "express";
import orders from "../data/orders.js"

const getOrders = (_req: Request, res: Response) => {
    res.json(orders);
};

const getOrderById = (req: Request, res: Response) => {
   const id = req.params.id;

   const order = orders.find(order => order.id ===Number(id));

   if (!order) {
    return res.status(404).json({
        message: "order not found"
    });
   }
   
    res.json(order);
}

export { getOrders, getOrderById };
