"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { fetchProducts, fetchOrders } from "../store/slices/productSlice"
import { getCurrentLocation, fetchNearbyUsers } from "../store/slices/locationSlice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, LogOut, RefreshCw } from "lucide-react"
import ProductForm from "../components/ProductForm"
import ProductCard from "../components/ProductCard"
import TrackingStatus from "../components/TrackingStatus"
import GoogleMap from "../components/GoogleMap"
import { logout } from "../store/slices/authSlice"
import { useNavigate } from "react-router-dom"

const FarmerDashboard = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    // const { toast } = useToast()
    const { user } = useSelector((state: RootState) => state.auth)
    const { products, orders, isLoading: productsLoading } = useSelector((state: RootState) => state.product)
    const { currentLocation, nearbyUsers, isLoading: locationLoading } = useSelector((state: RootState) => state.location)
    const [activeTab, setActiveTab] = useState("products")
    const [refreshing, setRefreshing] = useState(false)

    console.log("Near by users are: ", nearbyUsers)
    useEffect(() => {
        // Get current location and fetch initial data
        dispatch(getCurrentLocation())
        dispatch(fetchProducts()) // Changed from fetchProducts
        dispatch(fetchOrders())
    }, [dispatch])

    // Fetch nearby users when location is available
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

    // Filter products that belong to the current farmer
    // console.log("Products are: ", products)
    // console.log("User object from state:", user);

    // console.log("Farmer Id is: ", user?._id);
    // products.map((product) => {
    //     console.log("The farmer Id is: ", product.farmerId);
    // })

    const myProducts = products.filter((product) => {
        // console.log("Farmer Id: ", product.farmerId)
        // console.log("User Id: ", user?._id)
        return product.farmerId === user?._id
    })

    // console.log(myProducts);
    // Filter orders for products sold by the current farmer
    // console.log("Orders are: ", orders)
    // console.log("Farmer Id is: ", user?._id);
    // orders.map((order) => {
    //     console.log("The farmer Id is: ", order.farmerId);
    // })
    const myOrders = orders.filter((order) => { return order.farmerId === user?._id })
    // console.log(myOrders);

    return (
        <div className="container mx-auto py-6 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.name}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                        {refreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="products">My Products</TabsTrigger>
                    <TabsTrigger value="nearby">Nearby Users</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <ProductForm />
                        </div>

                        <div className="md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Products</CardTitle>
                                    <CardDescription>Manage your product listings</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {productsLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <span className="ml-2">Loading products...</span>
                                        </div>
                                    ) : myProducts.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>You haven't added any products yet.</p>
                                            <p>Use the form to add your first product.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {myProducts.map((product) => (
                                                <ProductCard key={product._id} product={product} role="Farmer" />
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="nearby" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nearby Users</CardTitle>
                                    <CardDescription>Users within 10km of your location</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {locationLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <span className="ml-2">Loading users...</span>
                                        </div>
                                    ) : nearbyUsers.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No users found within 10km of your location.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {nearbyUsers.map((user) => (
                                                <Card key={user.id}>
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h3 className="font-medium">{user.name}</h3>
                                                                <p className="text-sm text-muted-foreground">{user.role}</p>
                                                            </div>
                                                            <Badge variant="outline">
                                                                {Math.round(
                                                                    calculateDistance(currentLocation?.coordinates || [0, 0], user.location.coordinates) *
                                                                    10,
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

                        <div className="md:col-span-2">
                            {currentLocation && (
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
                                    height="500px"
                                />
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders</CardTitle>
                            <CardDescription>Track and manage your orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {productsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="ml-2">Loading orders...</span>
                                </div>
                            ) : myOrders.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>You don't have any orders yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {myOrders.map((order) => (
                                        <TrackingStatus
                                            key={order.id}
                                            status={order.status}
                                            orderId={order.id}
                                            updatedAt={order.updatedAt}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Import the calculateDistance function
import { calculateDistance } from "../utils/distance"

export default FarmerDashboard
