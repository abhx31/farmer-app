import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/userModel";
import { Community } from "../models/communityModel";
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, phoneNumber, location, communityName } = req.body;

        // communityName is required only if role is Admin or User
        if ((role === "Admin" || role === "User") && !communityName) {
            return res.status(400).json({ message: "Community name is required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        let community = null;

        if (role === "Admin") {
            // Check if community already exists
            const existingCommunity = await Community.findOne({ name: communityName });
            if (existingCommunity) {
                return res.status(400).json({ message: "Community already exists with this name" });
            }

            // Create community
            community = await Community.create({
                name: communityName,
                userId: null, // temp, updated after user creation
            });
        } else if (role === "User") {
            // Join existing community
            community = await Community.findOne({ name: communityName });
            if (!community) {
                return res.status(400).json({ message: "Community not found with the given name" });
            }
        } else if (role === "Farmer") {
            // For Farmer, community is not required or linked
            community = null;
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role,
            phoneNumber,
            location,
            communityId: community ? community._id : undefined, // only set if community exists
        });

        // If admin, link userId to the community
        if (role === "Admin" && community) {
            community.userId = newUser._id;
            await community.save();
        }

        return res.status(201).json({
            message: "User Created Successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                role: newUser.role,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                location: newUser.location,
                communityId: newUser.communityId,
            },
        });

    } catch (e) {
        console.error("Error during registration:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



export const login = async (req: Request, res: Response) => {
    try {
        console.log("Received request in email")
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({
                message: "Email does not exist"
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(403).json({
                message: "Incorrect Password"
            })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string)

        const { password: _, ...userData } = user.toObject();
        return res.status(200).json({
            user: userData,
            token
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}