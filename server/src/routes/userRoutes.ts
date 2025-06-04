import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { getNearbyUsers } from "../controllers/userController";

export const userRoutes = Router();

userRoutes.get('/nearby', authenticateUser as any, getNearbyUsers as any);
