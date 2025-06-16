"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { login } from "../store/slices/authSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Building2, Tractor } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, isLoading, error, user } = useSelector((state: RootState) => state.auth)

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Panel - Urban Community */}
          <div className="hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-cyan-400 to-blue-500 h-[600px] cursor-pointer">
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
                  <h3 className="text-2xl font-bold">Urban Community</h3>
                </div>
                <p className="text-lg font-medium mb-2">Modern Living Solutions</p>
                <p className="text-sm opacity-90 leading-relaxed">
                  Connect with thriving communities and discover sustainable urban development solutions
                </p>
              </div>
            </div>
          </div>

          {/* Center Panel - Login Form */}
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
                <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back</CardTitle>
                <CardDescription className="text-gray-600">Login to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoFocus
                      placeholder="Enter your email"
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-sm text-red-500 flex items-center">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500 flex items-center">{errors.password.message}</p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
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
              <CardFooter className="flex justify-center pt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-green-600 hover:text-green-700"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </div>

          {/* Right Panel - Smart Farming */}
          <div className="hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-orange-400 to-yellow-500 h-[600px] cursor-pointer">
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
                  <h3 className="text-2xl font-bold">Smart Farming</h3>
                </div>
                <p className="text-lg font-medium mb-2">Agricultural Innovation</p>
                <p className="text-sm opacity-90 leading-relaxed">
                  Embrace modern technology and sustainable practices in agriculture
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
