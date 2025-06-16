import { Response } from "express";
import { AuthenticatedRequest } from "../utils/authenticatedRequest";
import { Produce } from "../models/produceModel";
import { Order } from "../models/orderModel";

export const createProduce = async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log("Received request in Creating Produce")
        const farmerId = req.id;

        const { name, quantity, price, unit, imageURL } = req.body;

        const addedProduce = await Produce.create({
            name,
            quantity,
            price,
            unit,
            imageURL,
            farmerId,
        });

        // Transform _id to id and return matching type
        const product = {
            id: addedProduce._id.toString(),
            name: addedProduce.name,
            quantity: addedProduce.quantity,
            price: addedProduce.price,
            unit: addedProduce.unit,
            farmerId: addedProduce.farmerId.toString(),
            createdAt: addedProduce.createdAt.toISOString(),
            updatedAt: addedProduce.updatedAt.toISOString(),
        };

        return res.status(201).json(product);
    } catch (e: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message,
        });
    }
};


export const getProduce = async (req: AuthenticatedRequest, res: Response) => {
    try {

        // Populate farmer information
        const produce = await Produce.find({}).populate('farmerId', 'name location phoneNumber')
        // console.log("Produce is", produce)
        // Transform the data to include farmerName and farmerLocation
        const transformedProduce = produce.map(product => {
            const productObj = product.toObject()
            // Cast farmerId to any to access populated fields
            const farmer = productObj.farmerId as any

            return {
                ...productObj,
                id: productObj._id.toString(), // Convert _id to id for frontend consistency
                farmerName: farmer?.name || 'Unknown',
                farmerPhoneNumber: farmer.phoneNumber,
                farmerLocation: farmer?.location || {
                    type: 'Point',
                    coordinates: [0, 0]
                },
                farmerId: farmer?._id?.toString(),// Keep original farmerId as string
                imageUrl: productObj.imageURL // Map imageURL to imageUrl for frontend consistency
            }
        })
        // console.log("Transformed Produce is: ", transformedProduce);
        return res.status(200).json({
            message: "Produce fetched Successfully",
            produce: transformedProduce
        })

    } catch (e: any) {
        return res.status(500).json({
            message: "Internal server error",
            e: e.message
        })
    }
}

export const updateProduce = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const farmerId = req.id;
        console.log("update produce hitted")
        const id = req.params.id;
        const { name, quantity, price, unit } = req.body

        const produce = await Produce.findOne({ _id: id, farmerId })

        if (!produce) {
            return res.status(403).json({
                message: "Unauthorized or produce not found"
            })
        }

        if (name) produce.name = name;
        if (quantity) produce.quantity = quantity;
        if (price) produce.price = price;
        if (unit) produce.unit = unit;

        await produce.save();

        return res.status(200).json({
            message: "Updated Successfully",
            produce
        })
    } catch (e: any) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error",
            e: e.message
        })
    }
}
import mongoose from "mongoose";

export const deleteProduce = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const farmerId = req.id;
        const id = req.params.id;
        console.log("deleteProduce hitted")
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid or missing produce ID" });
        }

        const produce = await Produce.findOne({
            _id: new mongoose.Types.ObjectId(id),
            farmerId: new mongoose.Types.ObjectId(farmerId)
        });

        if (!produce) {
            return res.status(403).json({
                message: "Unauthorized or produce not found"
            });
        }

        const del = await Produce.findByIdAndDelete(id);
        console.log(del)
        return res.status(200).json({
            message: "Deleted successfully",
            del
        });
    } catch (e: any) {
        console.log("Delete produce error:", e);
        return res.status(500).json({
            message: "Internal Server Error",
            e: e.message
        });
    }
};
export const getProduceById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = req.id
        // Populate farmer information
        const produce = await Produce.findOne({ farmerId: id }).populate('farmerId', 'name location')
        // console.log("Produce is", produce)
        // Transform the data to include farmerName and farmerLocation
        return res.status(200).json({
            message: "Produce fetched Successfully",
            produce
        })
    } catch (e: any) {
        return res.status(500).json({
            message: "Internal server error",
            e: e.message
        })
    }
}

export const getFarmerOrders = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.id;
        console.log("From farmer Controller:", userId);
        const orders = await Order.findOne({
            farmerId: userId
        })

        console.log(orders);


        return res.status(200).json({
            messages: "Orders fetched successfully",
            orders
        })
    } catch (e: any) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Serveer Error"
        })
    }
}