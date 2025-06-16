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
import { Loader2, Building2, Tractor, MapPin, CheckCircle } from "lucide-react"

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    role: z.enum(["User", "Farmer", "Admin"]),
    communityName: z.string().min(2, "Community name must be at least 2 characters").optional(),
  })
  .superRefine((data, ctx) => {
    // Only require communityName for Admin and User roles
    if (data.role !== "Farmer" && !data.communityName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Community name is required for Admin and User roles",
        path: ["communityName"],
      })
    }
    if (data.role === "Farmer" && data.communityName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Community name should not be provided for Farmers",
        path: ["communityName"],
      })
    }
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

const SignUp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)
  const { currentLocation, isLoading: locationLoading } = useSelector((state: RootState) => state.location)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<"User" | "Farmer" | "Admin">("User")

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
  }, [dispatch])

  const onSubmit = async (data: SignUpFormValues) => {
    console.log("Form submitted with data:", data)
    console.log("Current location:", currentLocation)

    if (!currentLocation) {
      console.log("No location found")
      toast("Location Required", {
        description: "We need your location to proceed. Please enable location services.",
      })
      return
    }

    const submissionData = {
      name: data.name,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      role: data.role,
      location: currentLocation,
      ...(data.role !== "Farmer" && { communityName: data.communityName }),
    }

    console.log("Prepared submission data:", submissionData)

    try {
      await dispatch(signup(submissionData)).unwrap()
      toast("Account created")
      navigate("/login")
    } catch (error) {
      toast("Sign up failed", {
        description: error as string,
      })
    }
  }

  const handleRoleChange = (value: string) => {
    const role = value as "User" | "Farmer" | "Admin"
    setSelectedRole(role)
    setValue("role", role, { shouldValidate: true })

    // Clear and unregister communityName for Farmers
    if (role === "Farmer") {
      setValue("communityName", undefined, { shouldValidate: true })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Panel - Join Our Community */}
          <div className="hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-cyan-400 to-blue-500 h-[700px] cursor-pointer">
              <div className="absolute inset-0">
                <img
                  src="assets/community.png"
                  alt="Urban Community"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-500 ease-in-out hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute top-6 left-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex items-center mb-4">
                  <Building2 className="w-8 h-8 mr-3" />
                  <h3 className="text-2xl font-bold">Join Our Community</h3>
                </div>
                <p className="text-lg font-medium mb-2">Connect & Grow Together</p>
                <p className="text-sm opacity-90 leading-relaxed">
                  Become part of a thriving agricultural community and discover sustainable practices
                </p>
              </div>
            </div>
          </div>

          {/* Center Panel - Signup Form */}
          <div className="flex flex-col items-center space-y-6">
            {/* HarvestHub Logo */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🌽</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                HarvestHub
              </h1>
            </div>

            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">Create an Account</CardTitle>
                <CardDescription className="text-gray-600">Sign up to start ordering fresh produce</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                      placeholder="Create a password"
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      {...register("phoneNumber")}
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                      placeholder="Enter your phone number"
                    />
                    {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Role
                    </Label>
                    <Select onValueChange={handleRoleChange} defaultValue="User">
                      <SelectTrigger className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors">
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
                      <Label htmlFor="communityName" className="text-sm font-medium text-gray-700">
                        Community Name
                      </Label>
                      <Input
                        id="communityName"
                        {...register("communityName")}
                        className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                        placeholder="Enter your community name"
                      />
                      {errors.communityName && <p className="text-sm text-red-500">{errors.communityName.message}</p>}
                    </div>
                  )}

                  {locationLoading && (
                    <div className="flex items-center justify-center py-3 bg-blue-50 rounded-lg">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                      <span className="text-sm text-blue-700">Getting your location...</span>
                    </div>
                  )}

                  {locationError && (
                    <div className="flex items-center py-3 px-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      <MapPin className="w-5 h-5 mr-2 text-red-500" />
                      {locationError}
                    </div>
                  )}

                  {currentLocation && (
                    <div className="flex items-center py-3 px-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Location captured successfully
                    </div>
                  )}

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading || locationLoading || !currentLocation}
                  >
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
              <CardFooter className="flex justify-center pt-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-green-600 hover:text-green-700"
                    onClick={() => navigate("/login")}
                  >
                    Log in
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </div>

          {/* Right Panel - Start Your Journey */}
          <div className="hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-orange-400 to-yellow-500 h-[700px] cursor-pointer">
              <div className="absolute inset-0">
                <img
                  src="assets/farmer.png"
                  alt="Smart Farming"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-500 ease-in-out hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute top-6 right-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="flex items-center mb-4">
                  <Tractor className="w-8 h-8 mr-3" />
                  <h3 className="text-2xl font-bold">Start Your Journey</h3>
                </div>
                <p className="text-lg font-medium mb-2">Agricultural Excellence</p>
                <p className="text-sm opacity-90 leading-relaxed">
                  Join thousands of farmers embracing modern technology and sustainable practices in agriculture
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
