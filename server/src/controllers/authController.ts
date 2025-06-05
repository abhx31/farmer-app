import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/userModel";
import { Community } from "../models/communityModel";
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
    try {
        // 1. Destructure with const (no changes needed here)
        const { name, email, password, role, phoneNumber, location, communityName } = req.body;

        // 2. Validate role first
        if (!["User", "Farmer", "Admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // 3. Handle communityName validation without reassignment
        if (role !== "Farmer") {
            if (!communityName) {
                return res.status(400).json({ message: "Community name is required" });
            }
        } else if (communityName) {
            // Farmer shouldn't have communityName
            return res.status(400).json({
                message: "Community name should not be provided for Farmers"
            });
        }

        // 4. Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // 5. Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // 6. Handle community logic
        let community = null;
        if (role === "Admin") {
            const existingCommunity = await Community.findOne({ name: communityName });
            if (existingCommunity) {
                return res.status(400).json({ message: "Community already exists" });
            }
            community = await Community.create({ name: communityName });
        } else if (role === "User") {
            community = await Community.findOne({ name: communityName });
            if (!community) {
                return res.status(400).json({ message: "Community not found" });
            }
        }
        // For Farmer, community remains null

        // 7. Create user
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role,
            phoneNumber,
            location,
            communityId: community?._id // undefined for Farmers
        });

        // 8. Link admin to community if needed
        if (role === "Admin" && community) {
            community.userId = newUser._id;
            await community.save();
        }

        // 9. Generate token and respond
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET as string
        );

        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phoneNumber: newUser.phoneNumber,
                communityId: newUser.communityId
            },
            token
        });

    } catch (e) {
        console.error("Registration error:", e);
        return res.status(500).json({ message: "Internal server error" });
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