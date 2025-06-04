import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    id: string;
    role: "Admin" | "User" | "Farmer"
}