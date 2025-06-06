import { Response } from "express"
import { Interest } from "../models/interestModel"
import { AuthenticatedRequest } from "../utils/authenticatedRequest"

export const createInterest = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { productId, quantity } = req.body
        const userId = req.id // assuming your auth middleware attaches user

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" })
        }

        const interest = await Interest.create({
            productId,
            userId,
            quantity,
        })

        return res.status(201).json(interest)
    } catch (err) {
        console.error("Error creating interest", err)
        return res.status(500).json({ message: "Server error" })
    }
}
export const getAllInterests = async (req: Request, res: Response) => {
    try {
        const interests = await Interest.find()
            .populate("userId", "_id name email phoneNumber")  // only these fields from user
            .populate("productId", "_id name quantity price unit imageURL")  // these from product
            .select("_id userId productId quantity createdAt updatedAt") // only these from Interest

        return res.status(200).json(interests);
    } catch (err) {
        console.error("Error fetching interests:", err);
        res.status(500).json({ message: "Server error" });
    }
};


