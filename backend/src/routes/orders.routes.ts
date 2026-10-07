import { Router } from "express";
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder)

export default router;