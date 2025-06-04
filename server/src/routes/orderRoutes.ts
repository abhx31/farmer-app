import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/orderController";

export const orderRoutes = Router();
orderRoutes.get('/', authenticateUser as any, roleMiddleware(['Farmer', 'Admin', 'User']) as any, getOrders as any);
orderRoutes.post('/:id', authenticateUser as any, roleMiddleware(['Admin']) as any, createOrder as any);
orderRoutes.put('/status', authenticateUser as any, updateOrderStatus as any)