import { Router } from "express";
import { getOrders, getOrderById } from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);

export default router;