import { Router } from "express";
import { login, register } from "../controllers/authController";

export const authRoutes = Router();

authRoutes.post('/register', register as any);
authRoutes.post('/login', login as any);