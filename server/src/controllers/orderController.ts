import { Response } from "express";
import { AuthenticatedRequest } from "../utils/authenticatedRequest";
import { Order } from "../models/orderModel";
import { Community } from "../models/communityModel";
import { Produce } from "../models/produceModel";
import { Tracking } from "../models/trackingModel"; // <- import Tracking

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.id;
        console.log(userId);
        const id = req.params.id;

        const { quantity } = req.body;

        const community = await Community.findOne({ userId });
        if (!community) {
            return res.status(404).json({
                message: "Community Not found"
            });
        }

        const existingOrder = await Order.findOne({ communityId: community._id, produceId: id });
        if (existingOrder) {
            return res.status(403).json({
                message: "Order already exists",
            });
        }

        const farmer = await Produce.findOne({ _id: id });
        if (!farmer) {
            return res.status(404).json({
                message: "Farmer Not found"
            });
        }

        const order = await Order.create({
            communityId: community._id,
            produceId: id,
            farmerId: farmer._id,
            orderedBy: userId,
            quantity
        });

        await Tracking.create({
            orderId: order._id,
            status: "Pending"
        });

        return res.status(200).json({
            message: "Ordered Successfully",
            order
        });
    } catch (e: any) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const orders = await Order.find({})

        // console.log(orders);

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders
        });
    } catch (e: any) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


// controllers/orderController.ts
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { orderId, status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

