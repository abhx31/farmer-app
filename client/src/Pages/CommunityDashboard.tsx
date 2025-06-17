"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { fetchProducts, fetchOrders } from "../store/slices/productSlice"
import { getCurrentLocation, fetchNearbyUsers } from "../store/slices/locationSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, LogOut, RefreshCw, MapPin, Users, Package, Heart, Sparkles } from "lucide-react"
import ProductCard from "../components/ProductCard"
import TrackingStatus from "../components/TrackingStatus"
import GoogleMap from "../components/GoogleMap"
import { logout } from "../store/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { fetchCommunityInterests } from "../store/slices/communityInterestSlice"
import { calculateDistance } from "../utils/distance"
import { Badge } from "@/components/ui/badge"

const CommunityDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { products, orders, isLoading: productsLoading } = useSelector((state: RootState) => state.product)
  const { currentLocation, nearbyUsers, isLoading: locationLoading } = useSelector((state: RootState) => state.location)
  const { interests, loading: interestsLoading } = useSelector((state: RootState) => state.communityInterests)

  const [activeTab, setActiveTab] = useState("products")
  const [refreshing, setRefreshing] = useState(false)
  const [selectedFarmerLocation, setSelectedFarmerLocation] = useState<{
    coordinates: [number, number]
    name: string
  } | null>(null)

  useEffect(() => {
    dispatch(getCurrentLocation())
    dispatch(fetchProducts())
    dispatch(fetchCommunityInterests())
    dispatch(fetchOrders())
  }, [dispatch])

  useEffect(() => {
    if (currentLocation) {
      dispatch(
        fetchNearbyUsers({
          coordinates: currentLocation.coordinates,
          role: user?.role,
        }),
      )
    }
  }, [dispatch, currentLocation, user?.role])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        dispatch(fetchProducts()).unwrap(),
        dispatch(fetchOrders()).unwrap(),
        dispatch(getCurrentLocation())
          .unwrap()
          .then((location: any) => {
            if (location) {
              return dispatch(
                fetchNearbyUsers({
                  coordinates: location.coordinates,
                  role: user?.role,
                }),
              ).unwrap()
            }
          }),
      ])

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
    setActiveTab("farmers")
  }

  const myOrders = orders.filter((order: any) => {
    return order.orderedBy == user?._id
  })

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-pink-200/25 rounded-full blur-3xl animate-pulse delay-3000"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 border border-emerald-200/30 rounded-lg rotate-45 animate-spin-slow"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/4">
          <div className="w-24 h-24 border border-blue-200/40 rounded-full animate-bounce-slow"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="container mx-auto py-8 max-w-7xl px-6">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 bg-clip-text text-transparent">
                  Community Dashboard
                </h1>
              </div>
              <p className="text-xl text-slate-600 ml-14">
                Welcome back, <span className="font-semibold text-emerald-600">{user?.name}</span> ✨
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/80 hover:bg-white border-slate-200 text-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
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
            <TabsList className="grid grid-cols-4 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/30 min-w-[600px]">
              <TabsTrigger
                value="products"
                className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium"
              >
                <Package className="w-5 h-5" />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="farmers"
                className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium"
              >
                <MapPin className="w-5 h-5" />
                Farmers
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium"
              >
                <Users className="w-5 h-5" />
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="interests"
                className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium"
              >
                <Heart className="w-5 h-5" />
                Interests
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Package className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold">Available Products</CardTitle>
                    <CardDescription className="text-emerald-100 text-lg mt-2">
                      Discover fresh products from local farmers in your community
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {productsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-500"></div>
                      <Package className="w-8 h-8 text-emerald-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-xl text-slate-600 mt-6 font-medium">Loading fresh products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-20 space-y-6">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <Package className="w-12 h-12 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-700 mb-2">No Products Available</h3>
                      <p className="text-slate-500 text-lg">Check back later for fresh products from local farmers.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product: any) => (
                      <div key={product._id} className="group transform hover:scale-105 transition-all duration-300">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
                          <ProductCard product={product} onViewLocation={handleViewFarmerLocation} role="Admin" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farmers" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden h-fit">
                  <CardHeader className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">Nearby Farmers</CardTitle>
                        <CardDescription className="text-blue-100 mt-1">Within 10km radius</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {locationLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
                          <MapPin className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-slate-600 mt-4 font-medium">Finding farmers...</p>
                      </div>
                    ) : nearbyUsers.length === 0 ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                          <Users className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-700 mb-1">No Farmers Nearby</h4>
                          <p className="text-sm text-slate-500">No farmers found within 10km of your location.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {nearbyUsers.map((farmer: any) => (
                          <Card
                            key={farmer.id}
                            className={`transition-all duration-300 cursor-pointer hover:shadow-lg ${selectedFarmerLocation?.name === farmer.name
                              ? "border-blue-500 bg-blue-50/80 shadow-md"
                              : "border-slate-200 hover:border-blue-300 bg-white/60"
                              }`}
                          >
                            <CardContent className="p-5">
                              <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                  <h3 className="font-semibold text-slate-800 text-lg">{farmer.name}</h3>
                                  <p className="text-sm text-slate-500 font-medium">🌾 Local Farmer</p>
                                </div>
                                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md">
                                  {Math.round(
                                    calculateDistance(
                                      currentLocation?.coordinates || [0, 0],
                                      farmer.location.coordinates,
                                    ) * 10,
                                  ) / 10}{" "}
                                  km
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    {currentLocation && (
                      <div className="rounded-3xl overflow-hidden">
                        <GoogleMap
                          center={selectedFarmerLocation?.coordinates || currentLocation.coordinates}
                          markers={[
                            {
                              position: currentLocation.coordinates,
                              title: `${user?.name} (You)`,
                              role: "Community",
                            },
                            ...nearbyUsers.map((farmer: any) => ({
                              position: farmer.location.coordinates,
                              title: farmer.name,
                              role: "Farmer",
                            })),
                          ]}
                          height="600px"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 via-purple-600 to-violet-600 text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold">My Orders</CardTitle>
                    <CardDescription className="text-purple-100 text-lg mt-2">
                      Track and manage your product orders
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {productsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-500"></div>
                      <Users className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-xl text-slate-600 mt-6 font-medium">Loading your orders...</p>
                  </div>
                ) : myOrders.length === 0 ? (
                  <div className="text-center py-20 space-y-6">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-12 h-12 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-700 mb-2">No Orders Yet</h3>
                      <p className="text-slate-500 text-lg">Start by browsing products from local farmers.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myOrders.map((order: any) => (
                      <div key={order.id} className="group transform hover:scale-105 transition-all duration-300">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
                          <TrackingStatus status={order.status} role={user?.role} quantity={order.quantity} orderId={order._id} updatedAt={order.updatedAt} produceName={order.produceName} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interests" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Heart className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold">Community Interests</CardTitle>
                    <CardDescription className="text-pink-100 text-lg mt-2">
                      Product interests from community members
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {interestsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
                      <Heart className="w-8 h-8 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-xl text-slate-600 mt-6 font-medium">Loading community interests...</p>
                  </div>
                ) : interests.length === 0 ? (
                  <div className="text-center py-20 space-y-6">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="w-12 h-12 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-700 mb-2">No Interests Found</h3>
                      <p className="text-slate-500 text-lg">Community members haven't expressed interests yet.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {interests.map((interest) => (
                      <Card
                        key={interest._id}
                        className="bg-gradient-to-br from-white to-pink-50/50 border border-pink-100 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
                      >
                        <CardContent className="p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                  {interest.userId.name.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-slate-800">{interest.userId.name}</h3>
                                  <p className="text-slate-600 font-medium">📞 {interest.userId.phoneNumber}</p>
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg">
                              Active
                            </Badge>
                          </div>

                          <div className="space-y-4 bg-white/60 rounded-xl p-6 border border-pink-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                                <Heart className="w-4 h-4 text-pink-600" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-600 font-medium">Interested Product</p>
                                <p className="font-bold text-slate-800 text-lg">{interest.productId.name}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-pink-600" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-600 font-medium">Desired Quantity</p>
                                <p className="font-bold text-slate-800 text-lg">
                                  {interest.quantity} {interest.productId.unit}
                                </p>
                              </div>
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
          50% { transform: translateY(-20px); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default CommunityDashboard
