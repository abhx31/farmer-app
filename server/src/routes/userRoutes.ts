import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { getCommunityInterests, getNearbyUsers } from "../controllers/userController";

export const userRoutes = Router();

userRoutes.get('/nearby', authenticateUser as any, getNearbyUsers as any);
userRoutes.get("/admin/interests", authenticateUser as any, roleMiddleware(["Admin"]) as any, getCommunityInterests as any);
