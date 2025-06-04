// controllers/trackingController.ts
import { Response } from "express";
import { AuthenticatedRequest } from "../utils/authenticatedRequest";
import { Tracking } from "../models/trackingModel";
import { Order } from "../models/orderModel";

// Create or update tracking status
export const updateTracking = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { orderId, status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const tracking = await Tracking.findOneAndUpdate(
            { orderId },
            { status, updatedAt: new Date() },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            message: "Tracking updated successfully",
            tracking
        });
    } catch (e: any) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Get tracking by orderId
export const getTrackingByOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { orderId } = req.params;

        const tracking = await Tracking.findOne({ orderId });
        if (!tracking) {
            return res.status(404).json({ message: "Tracking info not found" });
        }

        return res.status(200).json({
            message: "Tracking info retrieved",
            tracking
        });
    } catch (e: any) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
