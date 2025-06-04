import { Response } from "express";
import { AuthenticatedRequest } from "../utils/authenticatedRequest";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import { Community } from "../models/communityModel";
export const getUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.id;

        const user = await User.findById(userId);

        return res.status(200).json({
            message: "User fetched Successfully",
            user
        })
    } catch (e: any) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.id;
        const { name, email, password, role, phoneNumber, coordinates } = req.body;

        const hashPassword = await bcrypt.hash(password, 5);

        if (role === "Admin") {
            await Community.updateOne(
                { email },
                { email },
                { upsert: true }
            );

        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...(name && { name }),
                ...(email && { email }),
                ...(role && { role }),
                ...(phoneNumber && { phoneNumber }),
                ...(hashPassword && { password: hashPassword }),
                ...(coordinates && {
                    location: {
                        type: "Point",
                        coordinates
                    }
                })
            },
            { new: true }
        )
        return res.status(200).json({
            message: "Updated Successfully",
            updatedUser
        })
    } catch (e: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message
        })
    }
}

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.id;

        const user = await User.findByIdAndDelete(userId);

        if (user?.role === "Admin") {
            await Community.deleteOne({ email: user.email });
        }

        return res.status(200).json({
            message: "Deleted Successfully",
            user
        });
    } catch (e: any) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message
        });
    }
};


export const getNearbyUsers = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { longitude, latitude, role } = req.query;

        console.log(latitude);
        console.log("Longitude is: ", longitude);
        console.log("Role is: ", role);
        if (!longitude || !latitude || !role) {
            return res.status(400).json({ message: "Missing required query parameters" });
        }

        const coordinates: [number, number] = [parseFloat(longitude as string), parseFloat(latitude as string)];
        console.log(coordinates);

        const nearbyUsers = await User.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: coordinates,
                    },
                    distanceField: "distance",
                    maxDistance: 10000, // 10km
                    spherical: true,
                    query: { role },
                },
            },
        ]);
        console.log(nearbyUsers);
        return res.status(200).json({
            message: `Nearby ${role}s fetched successfully`,
            users: nearbyUsers,
        });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message,
        });
    }
};
