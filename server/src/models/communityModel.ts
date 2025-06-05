import mongoose from "mongoose";
import { User } from "./userModel";

const communitySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // apartment name
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin
    createdAt: { type: Date, default: Date.now }
});


export const Community = mongoose.model("Community", communitySchema);