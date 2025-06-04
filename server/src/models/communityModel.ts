import mongoose from "mongoose";
import { User } from "./userModel";

const communitySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true })

export const Community = mongoose.model("Community", communitySchema);