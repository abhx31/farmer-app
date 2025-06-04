import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../utils/authenticatedRequest";

// Accepts allowed roles and returns a middleware
export const roleMiddleware = (allowedRoles: ("User" | "Farmer" | "Admin")[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userRole = req.role;

            if (!userRole) {
                return res.status(403).json({
                    message: "User role not found in request",
                });
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: "Access denied: insufficient permissions",
                });
            }

            next();
            // console.log("Next Function Called from Role Middleware")
        } catch (e: any) {
            console.log("Role middleware error:", e);
            return res.status(500).json({
                message: "Internal server error in role middleware",
            });
        }
    };
};
