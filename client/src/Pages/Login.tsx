"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { login } from "../store/slices/authSlice"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { isAuthenticated, isLoading, error, user } = useSelector(
        (state: RootState) => state.auth
    )

    useEffect(() => {
        if (!isAuthenticated || !user) return

        switch (user.role) {
            case "Farmer":
                navigate("/farmer-dashboard")
                break
            case "Admin":
                navigate("/community-dashboard")
                break
            case "User":
                navigate("/user-dashboard")
                break
            default:
                navigate("/login")
        }
    }, [isAuthenticated, user, navigate])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await dispatch(login(data)).unwrap()
            toast("Login successful")
            // navigation handled by useEffect
        } catch (err: any) {
            toast("Login failed", {
                description: err?.message || "An unexpected error occurred",
            })
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoFocus
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="p-2 text-sm text-red-500 bg-red-50 rounded">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Button
                            variant="link"
                            className="p-0"
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login
