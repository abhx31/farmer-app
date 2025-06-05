import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // can populate later
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Produce",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
}, { timestamps: true })

export const Interest = mongoose.model('Interest', interestSchema);
