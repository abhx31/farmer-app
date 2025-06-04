import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { createProduce, deleteProduce, getFarmerOrders, getProduce, getProduceById, updateProduce } from "../controllers/farmerController";

export const farmerRoutes = Router();

farmerRoutes.post('/create', authenticateUser as any, roleMiddleware(['Farmer']) as any, createProduce as any);
farmerRoutes.get('/', authenticateUser as any, roleMiddleware(['Farmer', 'Admin', 'User']) as any, getProduce as any);
farmerRoutes.put('/update/:id', authenticateUser as any, roleMiddleware(['Farmer']) as any, updateProduce as any);
farmerRoutes.delete('/delete/:id', authenticateUser as any, roleMiddleware(['Farmer']) as any, deleteProduce as any);
farmerRoutes.get('/orders', authenticateUser as any, roleMiddleware(['Farmer', 'Admin', 'User']) as any, getFarmerOrders as any);
farmerRoutes.get('/:id', authenticateUser as any, roleMiddleware(['Farmer']) as any, getProduceById as any);