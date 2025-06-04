import { Router } from "express";
import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { createInterest, getAllInterests } from "../controllers/interestController";

export const interestRoutes = Router();
interestRoutes.post('/', authenticateUser as any, roleMiddleware(['User']) as any, createInterest as any);
interestRoutes.get('/', authenticateUser as any, roleMiddleware(['Admin']) as any, getAllInterests as any);


