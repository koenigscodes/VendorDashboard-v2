import type { Request, Response } from "express";
import orders from "../data/orders.js"

import { createOrderSchema, orderStatusSchema, updateOrderSchema } from "../schemas/order.schema.js";

const getOrders = (req: Request, res: Response) => {
    const search = req.query.search;
    const status = req.query.status;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 6);

    if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1 ||
        limit > 100
    ) {
        return res.status(400).json({
            message: "Invalid pagination parameters",
        });
    }

    if (status !== undefined) {
        const result = orderStatusSchema.safeParse(status);

        if (!result.success) {
            return res.status(400).json({
                message: "Invalid order status",
            })
        }
    }

    const searchTerm = typeof search === "string"
        ? search.trim().toLowerCase()
        : "";

    const filteredOrders = orders.filter(order =>
         order.customer.toLowerCase().includes(searchTerm)
    );

    const statusTerm = typeof status === "string"
        ? status.trim().toLowerCase()
        : "";

    const matchesStatus = statusTerm === ""
        ? filteredOrders
        : filteredOrders.filter(order =>
            order.status === statusTerm
        );

    const totalOrders = matchesStatus.length;
    const totalPages = Math.ceil(totalOrders / limit);

    const startIndex = (page - 1) * limit;

    const paginatedOrders = matchesStatus.slice(
        startIndex,
        startIndex + limit
    );

    res.json({
        orders: paginatedOrders,
        pagination: {
            page,
            limit,
            totalOrders,
            totalPages,
        },
    });
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
};

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
};

const updateOrder = (req: Request, res: Response) => {
    const orderId = Number(req.params.id);

    const order = orders.find(order => order.id === orderId);

    if(!order) {
        return res.status(404).json({
            message: "order not found"
        });
    }

    const result = updateOrderSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({message: "Invalid order"})
    }

    const orderIndex = orders.findIndex(order => order.id === orderId);

    const updatedOrder = {
        ...order,
        customer: result.data.customer ?? order.customer,
        status: result.data.status ?? order.status,
        total: result.data.total ?? order.total,
    };

    orders[orderIndex] = updatedOrder;

    return res.json(updateOrder);
};

const deleteOrder = (req: Request, res: Response) => {
    const orderId = Number(req.params.id);

    const order = orders.find(order => order.id === orderId);

    if (!order) {
        return res.status(404).json({
            message: "order not found"
        });
    }

    const orderIndex = orders.findIndex(order => order.id === orderId);

    orders.splice(orderIndex, 1);

    return res.status(204).send();
};

export { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };