import { Router } from "express";
import { getOrders, getOrderById, createOrder, updateOrder } from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id", updateOrder);

export default router;