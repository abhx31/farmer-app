import mongoose from "mongoose";
import { User } from "./userModel";
import { Interest } from "./interestModel";
import { Order } from "./orderModel";

const produceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    imageURL: {
        type: String
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true })

produceSchema.pre("findOneAndDelete", async function (next) {
    const produce = await this.model.findOne(this.getFilter());

    if (produce) {
        await Interest.deleteMany({ productId: produce._id });
        await Order.deleteMany({ produceId: produce._id });
    }

    next();
});

export const Produce = mongoose.model("Produce", produceSchema)