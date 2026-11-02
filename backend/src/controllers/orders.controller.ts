import type { Request, Response } from "express";

import { pool } from "../config/database.js";

import type { Order } from "../types/order.js";

import { createOrderSchema, orderStatusSchema, updateOrderSchema } from "../schemas/order.schema.js";

const getOrders = async (req: Request, res: Response) => {
    const search = req.query.search;
    const status = req.query.status;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

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

    const offset = (page - 1) * limit;

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

    const statusTerm = typeof status === "string"
        ? status.trim()
        : "";

    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (searchTerm !== "") {
        values.push(`%${searchTerm}%`);
        conditions.push(`customer ILIKE $${values.length}`);
    }

    if (statusTerm !== "") {
        values.push(statusTerm);
        conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const countQuery = `
        SELECT COUNT(*) FROM orders
        ${whereClause}
    `;

    const countResult = await pool.query(countQuery, values);
    const totalOrders = Number(countResult.rows[0].count);

    values.push(limit);
    const limitPlaceholder = `$${values.length}`;

    values.push(offset);
    const offsetPlaceholder = `$${values.length}`;

    const query = `
        SELECT * FROM orders
        ${whereClause}
        ORDER BY id
        LIMIT ${limitPlaceholder}
        OFFSET ${offsetPlaceholder}
    `;

    const result = await pool.query(query, values);
    const paginatedOrders = result.rows.map(order => ({
        ...order,
        total: Number(order.total),
    }));

    const totalPages = Math.ceil(totalOrders / limit);

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

const getOrderById = async (req: Request, res: Response) => {
   const orderId = Number(req.params.id);

   if (!Number.isInteger(orderId) || orderId < 1) {
    return res.status(400).json({
        message: "Invalid order ID"
    });
   }

   const result = await pool.query(
    "SELECT * FROM orders WHERE id = $1",
    [orderId]
   );

   const order = result.rows[0];

   if (!order) {
    return res.status(404).json({
        message: "order not found"
    });
   }

    res.json({
        ...order,
        total: Number(order.total),
    });
};

const createOrder = async (req: Request, res: Response) => {
    const result = createOrderSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({message: "Invalid order"})
    }

    const insertResult = await pool.query(
        `INSERT INTO orders (customer, status, total)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [
            result.data.customer,
            "pending",
            result.data.total,
        ]
    );

    const newOrder: Order = insertResult.rows[0];

    return res.status(201).json({
        ...newOrder,
        total: Number(newOrder.total),
    });
};

const updateOrder = async (req: Request, res: Response) => {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId < 1) {
        return res.status(400).json({
            message: "Invalid order ID"
        });
    }

    const result = updateOrderSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({message: "Invalid order"})
    }

    const updates = result.data;
    const entries = Object.entries(updates).filter(
        ([, value]) => value !== undefined
    );

    const setClauses = entries.map(([column], index) => {
        return `${column} = $${index + 1}`;
    });

    const setClause = setClauses.join(", ");

    const values = entries.map(([, value]) => value) as (string | number)[];
    values.push(orderId);

    const query = `
        UPDATE orders
        SET ${setClause}
        WHERE id = $${values.length}
        RETURNING *
    `;

    const updateResult = await pool.query(query, values);

    const updatedOrder = updateResult.rows[0];

    if (!updatedOrder) {
        return res.status(404).json({
            message: "order not found"
        });
    };

    return res.status(200).json({
        ...updatedOrder,
        total: Number(updatedOrder.total)
    });
};

const deleteOrder = async (req: Request, res: Response) => {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId < 1) {
        return res.status(400).json({
            message: "Invalid order ID",
        });
    }

    const result = await pool.query(
        "DELETE FROM orders WHERE id = $1 RETURNING id",
        [orderId]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({
            message: "order not found",
        });
    }

    return res.status(204).send();
};

export { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };