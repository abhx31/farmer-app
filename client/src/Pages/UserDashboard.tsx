"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { fetchOrders, fetchNearbyProducts } from "../store/slices/productSlice"
import { getCurrentLocation } from "../store/slices/locationSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, LogOut, RefreshCw, ShoppingBag, MapPin, User, Star, Sparkles } from "lucide-react"
import ProductCard from "../components/ProductCard"
import GoogleMap from "../components/GoogleMap"
import { logout } from "../store/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchCommunityInterests } from "../store/slices/communityInterestSlice"

const UserDashboard = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)
    const { products, isLoading: productsLoading } = useSelector((state: RootState) => state.product)
    const { currentLocation, isLoading: locationLoading } = useSelector((state: RootState) => state.location)
    const [activeTab, setActiveTab] = useState("products")
    const [refreshing, setRefreshing] = useState(false)
    const { interests } = useSelector((state: RootState) => state.communityInterests)

    const [selectedFarmerLocation, setSelectedFarmerLocation] = useState<{
        coordinates: [number, number]
        name: string
    } | null>(null)

    useEffect(() => {
        dispatch(getCurrentLocation())
        dispatch(fetchOrders())
        dispatch(fetchCommunityInterests())
    }, [dispatch])

    useEffect(() => {
        if (currentLocation) {
            dispatch(fetchNearbyProducts(currentLocation.coordinates))
        }
    }, [dispatch, currentLocation])

    const handleRefresh = async () => {
        setRefreshing(true)
        try {
            await dispatch(getCurrentLocation())
                .unwrap()
                .then((location: any) => {
                    if (location) {
                        return dispatch(fetchNearbyProducts(location.coordinates)).unwrap()
                    }
                })
            await dispatch(fetchOrders()).unwrap()

            toast("Refreshed", {
                description: "Dashboard data has been refreshed.",
            })
        } catch (error) {
            toast("Refresh failed", {
                description: "Failed to refresh dashboard data.",
            })
        } finally {
            setRefreshing(false)
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }

    const handleViewFarmerLocation = (coordinates: [number, number], farmerName: string) => {
        setSelectedFarmerLocation({ coordinates, name: farmerName })
        setActiveTab("map")
    }

    const filteredInterests = interests.filter((interest) => {
        return interest.userId._id === user?._id
    })

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50/30 to-pink-50/40">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Shopping-themed Shapes */}
                <div className="absolute top-20 left-12 w-80 h-80 bg-indigo-200/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-pink-200/18 rounded-full blur-3xl animate-pulse delay-2000"></div>
                <div className="absolute bottom-20 right-1/3 w-88 h-88 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-3000"></div>

                {/* Shopping-themed Geometric Elements */}
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                    <div className="w-32 h-32 border-2 border-indigo-200/25 rounded-2xl rotate-45 animate-spin-slow"></div>
                </div>
                <div className="absolute bottom-1/3 right-1/5">
                    <div className="w-24 h-24 border-2 border-purple-200/30 rounded-full animate-bounce-slow"></div>
                </div>
                <div className="absolute top-1/2 left-1/6">
                    <div className="w-20 h-20 bg-pink-200/20 rounded-xl rotate-12 animate-pulse delay-1500"></div>
                </div>

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 bg-white/75 backdrop-blur-xl border-b border-indigo-100/50 shadow-sm">
                <div className="container mx-auto py-8 max-w-7xl px-6">
                    <div className="flex justify-between items-center">
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    User Dashboard
                                </h1>
                            </div>
                            <p className="text-xl text-slate-600 ml-16">
                                Welcome back, <span className="font-semibold text-indigo-600">{user?.name}</span> 🛒
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="bg-white/80 hover:bg-indigo-50 border-indigo-200 text-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                            >
                                {refreshing ? (
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-5 h-5 mr-3" />
                                )}
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleLogout}
                                className="bg-white/80 hover:bg-red-50 border-slate-200 text-slate-700 hover:text-red-600 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 container mx-auto py-12 max-w-7xl px-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
                    {/* Enhanced Tab Navigation */}
                    <div className="flex justify-center">
                        <TabsList className="grid grid-cols-3 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/30 min-w-[500px]">
                            <TabsTrigger
                                value="products"
                                className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Nearby Products
                            </TabsTrigger>
                            <TabsTrigger
                                value="map"
                                className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium"
                            >
                                <MapPin className="w-5 h-5" />
                                Farmer Locations
                            </TabsTrigger>
                            <TabsTrigger
                                value="orders"
                                className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium"
                            >
                                <Star className="w-5 h-5" />
                                My Orders
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="products" className="space-y-8">
                        <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white p-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <ShoppingBag className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-3xl font-bold">Nearby Products</CardTitle>
                                        <CardDescription className="text-indigo-100 text-lg mt-2">
                                            Fresh products from farmers within 10km of your location
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                {productsLoading || locationLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="relative">
                                            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-500"></div>
                                            <ShoppingBag className="w-8 h-8 text-indigo-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                        <p className="text-xl text-slate-600 mt-6 font-medium">Discovering fresh products...</p>
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="text-center py-20 space-y-6">
                                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                                            <ShoppingBag className="w-12 h-12 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-semibold text-slate-700 mb-2">No Products Available</h3>
                                            <p className="text-slate-500 text-lg">No products available in your area at the moment.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {products.map((product) => (
                                            <div key={product._id} className="group transform hover:scale-105 transition-all duration-300">
                                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100">
                                                    <ProductCard product={product} onViewLocation={handleViewFarmerLocation} role="User" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="map" className="space-y-8">
                        <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white p-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <MapPin className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-3xl font-bold">Farmer Locations</CardTitle>
                                        <CardDescription className="text-blue-100 text-lg mt-2">
                                            {selectedFarmerLocation
                                                ? `Viewing location of ${selectedFarmerLocation.name}`
                                                : "Discover farmers in your area"}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {!currentLocation ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="relative">
                                            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
                                            <MapPin className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                        <p className="text-xl text-slate-600 mt-6 font-medium">Loading map...</p>
                                    </div>
                                ) : (
                                    <div className="rounded-b-3xl overflow-hidden">
                                        {/* Check for products with missing coordinates */}
                                        {(() => {
                                            products.forEach((product) => {
                                                if (!product.farmerLocation?.coordinates) {
                                                    console.warn(`Missing coordinates for product ${product.name} by ${product.farmerName}`)
                                                }
                                            })
                                            return null // Return null so nothing is rendered
                                        })()}
                                        <GoogleMap
                                            center={selectedFarmerLocation?.coordinates || currentLocation.coordinates}
                                            markers={[
                                                {
                                                    position: currentLocation.coordinates,
                                                    title: `${user?.name} (You)`,
                                                    role: "User",
                                                },
                                                ...products.filter(product => product.farmerLocation?.coordinates)
                                                    .map((product) => ({
                                                        position: product.farmerLocation?.coordinates,
                                                        title: `${product.farmerName} (${product.name})`,
                                                        role: "Farmer",
                                                    })),
                                            ]}
                                            height="600px"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-8">
                        <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white p-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <Star className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-3xl font-bold">My Orders</CardTitle>
                                        <CardDescription className="text-pink-100 text-lg mt-2">
                                            Track your product interests and orders
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                {productsLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="relative">
                                            <div className="w-20 h-20 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
                                            <Star className="w-8 h-8 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                        <p className="text-xl text-slate-600 mt-6 font-medium">Loading your orders...</p>
                                    </div>
                                ) : filteredInterests.length === 0 ? (
                                    <div className="text-center py-20 space-y-6">
                                        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                                            <Star className="w-12 h-12 text-pink-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-semibold text-slate-700 mb-2">No Orders Yet</h3>
                                            <p className="text-slate-500 text-lg">Start browsing products to place your first order.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {filteredInterests.map((interest) => (
                                            <Card
                                                key={interest._id}
                                                className="bg-gradient-to-br from-white to-pink-50/50 border border-pink-100 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
                                            >
                                                <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                            {interest.productId.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-xl font-bold text-slate-800">
                                                                {interest.productId.name}
                                                            </CardTitle>
                                                            <CardDescription className="text-pink-600 font-medium">
                                                                ₹{interest.productId.price} per {interest.productId.unit}
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="p-6 space-y-4">
                                                    <div className="bg-white/80 rounded-xl p-4 border border-pink-100">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                                                                <ShoppingBag className="w-4 h-4 text-pink-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-slate-600 font-medium">Quantity Ordered</p>
                                                                <p className="font-bold text-slate-800 text-lg">{interest.quantity}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                                                                <User className="w-4 h-4 text-pink-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-slate-600 font-medium">Ordered by</p>
                                                                <p className="font-bold text-slate-800">{interest.userId.name}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2">
                                                        <div className="flex items-center gap-2">
                                                            <Sparkles className="w-4 h-4 text-pink-500" />
                                                            <span className="text-sm font-medium text-pink-600">Active Interest</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-slate-500">Total Value</p>
                                                            <p className="font-bold text-lg text-slate-800">
                                                                ₹{(interest.productId.price * interest.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25px); }
        }
        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}

export default UserDashboard
