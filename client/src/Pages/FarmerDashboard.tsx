"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { fetchProducts, fetchOrders, updateOrderStatus } from "../store/slices/productSlice"
import { getCurrentLocation, fetchNearbyUsers } from "../store/slices/locationSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, LogOut, RefreshCw, Sprout, Users, MapPin, ShoppingCart, Wheat, Tractor } from "lucide-react"
import ProductForm from "../components/ProductForm"
import ProductCard from "../components/ProductCard"
import TrackingStatus from "../components/TrackingStatus"
import GoogleMap from "../components/GoogleMap"
import { logout } from "../store/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { calculateDistance } from "../utils/distance"

const FarmerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { products, orders, isLoading: productsLoading } = useSelector((state: RootState) => state.product)
  const { currentLocation, nearbyUsers, isLoading: locationLoading } = useSelector((state: RootState) => state.location)
  const [activeTab, setActiveTab] = useState("products")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    dispatch(getCurrentLocation())
    dispatch(fetchProducts())
    dispatch(fetchOrders())
  }, [dispatch])

  useEffect(() => {
    if (currentLocation) {
      dispatch(
        fetchNearbyUsers({
          coordinates: currentLocation.coordinates,
          role: "Admin",
        }),
      )
    }
  }, [dispatch, currentLocation])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        dispatch(fetchProducts()).unwrap(),
        dispatch(fetchOrders()).unwrap(),
        dispatch(getCurrentLocation())
          .unwrap()
          .then((location) => {
            if (location) {
              return dispatch(
                fetchNearbyUsers({
                  coordinates: location.coordinates,
                  role: "User",
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

  const myProducts = products.filter((product) => {
    return product.farmerId === user?._id
  })

  const myOrders = orders.filter((order) => {
    return order.farmerId === user?._id
  })

  const handleMarkDelivered = (orderId: string) => {
    dispatch(updateOrderStatus({ orderId, status: "delivered" }));
  };
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50/30 to-lime-50/40">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Organic Shapes */}
        <div className="absolute top-16 left-8 w-80 h-80 bg-emerald-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-96 h-96 bg-green-200/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-24 left-1/3 w-72 h-72 bg-lime-200/18 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-1/4 w-88 h-88 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-3000"></div>

        {/* Farm-themed Geometric Elements */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 border-2 border-emerald-200/25 rounded-lg rotate-45 animate-spin-slow"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/5">
          <div className="w-20 h-20 border-2 border-green-200/30 rounded-full animate-bounce-slow"></div>
        </div>
        <div className="absolute top-1/2 left-1/6">
          <div className="w-16 h-16 bg-lime-200/20 rotate-12 animate-pulse delay-1500"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/75 backdrop-blur-xl border-b border-emerald-100/50 shadow-sm">
        <div className="container mx-auto py-8 max-w-7xl px-6">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg">
                  <Tractor className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-lime-600 bg-clip-text text-transparent">
                  Farmer Dashboard
                </h1>
              </div>
              <p className="text-xl text-slate-600 ml-16">
                Welcome back, <span className="font-semibold text-emerald-600">{user?.name}</span> 🌱
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/80 hover:bg-emerald-50 border-emerald-200 text-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
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
                className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium"
              >
                <Sprout className="w-5 h-5" />
                My Products
              </TabsTrigger>
              <TabsTrigger
                value="nearby"
                className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium"
              >
                <MapPin className="w-5 h-5" />
                Nearby Users
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-3 px-6 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                Orders
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden sticky top-8">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <Wheat className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">Add New Product</CardTitle>
                        <CardDescription className="text-emerald-100 mt-1">List your fresh produce</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ProductForm />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white p-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-2xl">
                        <Sprout className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold">My Products</CardTitle>
                        <CardDescription className="text-emerald-100 text-lg mt-2">
                          Manage your product listings and inventory
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {productsLoading ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                          <div className="w-20 h-20 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-500"></div>
                          <Sprout className="w-8 h-8 text-emerald-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-xl text-slate-600 mt-6 font-medium">Loading your products...</p>
                      </div>
                    ) : myProducts.length === 0 ? (
                      <div className="text-center py-20 space-y-6">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                          <Sprout className="w-12 h-12 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-slate-700 mb-2">No Products Yet</h3>
                          <p className="text-slate-500 text-lg">Add your first product using the form on the left.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myProducts.map((product) => (
                          <div
                            key={product._id}
                            className="group transform hover:scale-105 transition-all duration-300"
                          >
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-emerald-100">
                              <ProductCard product={product} role="Farmer" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nearby" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden h-fit">
                  <CardHeader className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">Nearby Users</CardTitle>
                        <CardDescription className="text-blue-100 mt-1">Within 10km radius</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {locationLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
                          <Users className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-slate-600 mt-4 font-medium">Finding users...</p>
                      </div>
                    ) : nearbyUsers.length === 0 ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                          <Users className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-700 mb-1">No Users Nearby</h4>
                          <p className="text-sm text-slate-500">No users found within 10km of your location.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {nearbyUsers.map((user) => (
                          <Card
                            key={user.id}
                            className="transition-all duration-300 hover:shadow-lg border-slate-200 hover:border-blue-300 bg-white/60"
                          >
                            <CardContent className="p-5">
                              <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                  <h3 className="font-semibold text-slate-800 text-lg">{user.name}</h3>
                                  <p className="text-sm text-slate-500 font-medium">
                                    {user.role === "Admin" ? "🏢 Community Admin" : "👤 User"}
                                  </p>
                                </div>
                                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md">
                                  {Math.round(
                                    calculateDistance(
                                      currentLocation?.coordinates || [0, 0],
                                      user.location.coordinates,
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
                          center={currentLocation.coordinates}
                          markers={[
                            {
                              position: currentLocation.coordinates,
                              title: `${user?.name} (You)`,
                              role: "Farmer",
                            },
                            ...nearbyUsers.map((user) => ({
                              position: user.location.coordinates,
                              title: user.name,
                              role: user.role,
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
              <CardHeader className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold">Orders</CardTitle>
                    <CardDescription className="text-purple-100 text-lg mt-2">
                      Track and manage orders for your products
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {productsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-500"></div>
                      <ShoppingCart className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-xl text-slate-600 mt-6 font-medium">Loading your orders...</p>
                  </div>
                ) : myOrders.length === 0 ? (
                  <div className="text-center py-20 space-y-6">
                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingCart className="w-12 h-12 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-700 mb-2">No Orders Yet</h3>
                      <p className="text-slate-500 text-lg">Orders for your products will appear here.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myOrders.map((order) => (
                      <div key={order._id} className="group transform hover:scale-105 transition-all duration-300">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 p-4">
                          <TrackingStatus
                            produceName={order.produceName}
                            quantity={order.quantity}
                            status={order.status}
                            orderId={order._id}
                            updatedAt={order.updatedAt}
                          />

                          {/* Delivered Button */}
                          {order.status !== "delivered" && (
                            <button
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full transition duration-200"
                              onClick={() => handleMarkDelivered(order._id)}
                            >
                              Mark as Delivered
                            </button>
                          )}

                        </div>
                      </div>
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

export default FarmerDashboard
