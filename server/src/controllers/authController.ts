import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/userModel";
import { Community } from "../models/communityModel";
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, phoneNumber, location } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }


        const hashPassword = await bcrypt.hash(password, 5);


        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role,
            phoneNumber,
            location
        })

        if (role === "Admin") {
            await Community.create({
                email,
                userId: newUser._id
            })
        }
        return res.status(201).json({
            message: "User Created Successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                role: newUser.role,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
            },
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

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