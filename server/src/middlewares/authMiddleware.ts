import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../utils/authenticatedRequest";

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer")) {
        return res.status(401).json({
            message: "No token Provided",
        })
    }

    const token = authHeaders.split(" ")[1];
    console.log("Auth Middleware");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: "User" | "Farmer" | "Admin" };
        console.log(decoded);
        req.id = decoded.id
        req.role = decoded.role
        // console.log(req);
        next();
        // console.log("Next Function Called");
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or Expired token"
        })
    }
}