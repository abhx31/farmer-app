import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        required: true
    },
    produceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Produce",
        required: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer",
        required: true
    },
    quantity: {
        type: Number
    },
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // or "Admin" based on your system
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema);