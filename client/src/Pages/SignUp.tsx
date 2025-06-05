"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { signup } from "../store/slices/authSlice"
import { getCurrentLocation } from "../store/slices/locationSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    role: z.enum(["User", "Farmer", "Admin"]),
    communityName: z.string().min(2, "Community name must be at least 2 characters").optional(),
}).superRefine((data, ctx) => {
    // Only require communityName for Admin and User roles
    if (data.role !== "Farmer" && !data.communityName) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Community name is required for Admin and User roles",
            path: ["communityName"]
        });
    }
    if (data.role === "Farmer" && data.communityName) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Community name should not be provided for Farmers",
            path: ["communityName"]
        });
    }
});
type SignUpFormValues = z.infer<typeof signUpSchema>

const SignUp = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    // const { toast } = useToast()
    const { isLoading, error } = useSelector((state: RootState) => state.auth)
    const { currentLocation, isLoading: locationLoading } = useSelector((state: RootState) => state.location)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<"User" | "Farmer" | "Admin">("User");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            role: "User",
        },
    })

    useEffect(() => {
        // Get current location when component mounts
        dispatch(getCurrentLocation())
            .unwrap()
            .catch(() => {
                setLocationError("Failed to get your location. Please enable location services.")
                toast("Failed to get your location. Please enable location services.")
            })
    }, [dispatch, toast])

    // useEffect(() => {
    //     // Redirect if already authenticated
    //     if (isAuthenticated && user) {
    //         switch (user.role) {
    //             case "Farmer":
    //                 navigate("/farmer-dashboard")
    //                 break
    //             case "Community":
    //                 navigate("/community-dashboard")
    //                 break
    //             case "User":
    //                 navigate("/user-dashboard")
    //                 break
    //             default:
    //                 navigate("/login")
    //         }
    //     }
    // }, [isAuthenticated, user, navigate])

    const onSubmit = async (data: SignUpFormValues) => {
        console.log("Form submitted with data:", data); // Add this
        console.log("Current location:", currentLocation); // Add this

        if (!currentLocation) {
            console.log("No location found"); // Add this
            toast("Location Required", {
                description: "We need your location to proceed. Please enable location services.",
            });
            return;
        }

        const submissionData = {
            name: data.name,
            email: data.email,
            password: data.password,
            phoneNumber: data.phoneNumber,
            role: data.role,
            location: currentLocation,
            ...(data.role !== "Farmer" && { communityName: data.communityName })
        };

        console.log("Prepared submission data:", submissionData); // Add this

        try {
            await dispatch(signup(submissionData)).unwrap();
            toast("Account created");
            navigate("/login");
        } catch (error) {
            toast("Sign up failed", {
                description: error as string,
            });
        }
    };
    const handleRoleChange = (value: string) => {
        const role = value as "User" | "Farmer" | "Admin";
        setSelectedRole(role);
        setValue("role", role, { shouldValidate: true });

        // Clear and unregister communityName for Farmers
        if (role === "Farmer") {
            setValue("communityName", undefined, { shouldValidate: true });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Create an Account</CardTitle>
                    <CardDescription>Sign up to start ordering fresh produce</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" {...register("name")} />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" {...register("phoneNumber")} />
                            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                onValueChange={handleRoleChange}
                                defaultValue="User"
                            >

                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="Farmer">Farmer</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
                        </div>
                        {selectedRole !== "Farmer" && (
                            <div className="space-y-2">
                                <Label htmlFor="communityName">Community Name</Label>
                                <Input
                                    id="communityName"
                                    {...register("communityName")}
                                />
                                {errors.communityName && (
                                    <p className="text-sm text-red-500">{errors.communityName.message}</p>
                                )}
                            </div>
                        )}

                        {locationLoading && (
                            <div className="flex items-center justify-center py-2">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <span className="ml-2">Getting your location...</span>
                            </div>
                        )}

                        {locationError && <div className="p-2 text-sm text-red-500 bg-red-50 rounded">{locationError}</div>}

                        {currentLocation && (
                            <div className="p-2 text-sm text-green-600 bg-green-50 rounded">Location captured successfully</div>
                        )}

                        {error && <div className="p-2 text-sm text-red-500 bg-red-50 rounded">{error}</div>}

                        <Button type="submit" className="w-full" disabled={isLoading || locationLoading || !currentLocation}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
                            Log in
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignUp
