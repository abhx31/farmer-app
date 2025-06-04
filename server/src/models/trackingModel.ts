// models/trackingModel.ts
import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered"],
        default: "Pending"
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const Tracking = mongoose.model("Tracking", trackingSchema);
