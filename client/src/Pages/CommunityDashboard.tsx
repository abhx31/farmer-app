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
import { Loader2, LogOut, RefreshCw } from "lucide-react"
import ProductCard from "../components/ProductCard"
import TrackingStatus from "../components/TrackingStatus"
import GoogleMap from "../components/GoogleMap"
import { logout } from "../store/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { fetchCommunityInterests } from "../store/slices/communityInterestSlice";


const CommunityDashboard = () => {
    // console.log("CommunityDashboard rendered")

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    // const { toast } = useToast()
    const { user } = useSelector((state: RootState) => state.auth)
    const { products, orders, isLoading: productsLoading } = useSelector((state: RootState) => state.product)
    const { currentLocation, nearbyUsers, isLoading: locationLoading } = useSelector((state: RootState) => state.location)
    const { interests, loading: interestsLoading, } = useSelector((state: RootState) => state.communityInterests);

    const [activeTab, setActiveTab] = useState("products")
    const [refreshing, setRefreshing] = useState(false)
    const [selectedFarmerLocation, setSelectedFarmerLocation] = useState<{
        coordinates: [number, number]
        name: string
    } | null>(null)


    useEffect(() => {
        // Get current location and fetch initial data
        console.log("Initial useEffect running")
        dispatch(getCurrentLocation())
        dispatch(fetchProducts())
        dispatch(fetchCommunityInterests());
        dispatch(fetchOrders())
    }, [dispatch])



    // Fetch nearby farmers when location is available
    useEffect(() => {
        console.log("Location changed:", currentLocation)
        if (currentLocation) {
            dispatch(
                fetchNearbyUsers({
                    coordinates: currentLocation.coordinates,
                    role: "Farmer",
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
                    .then((location: any) => {
                        if (location) {
                            return dispatch(
                                fetchNearbyUsers({
                                    coordinates: location.coordinates,
                                    role: "Farmer",
                                }),
                            ).unwrap()
                        }
                    }),
            ])

            toast("Refreshed", {
                description: "Dashboard data has been refreshed.",
            })
        } catch (error) {
            console.log("Reason for not refreshing:", error)
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

    // // Filter orders for the current community
    // console.log("Admin id: ", user?._id.toString());
    // // console.log("Admin id: ", order.orderedBy.toString());
    // orders.map((order) => {
    //     console.log("Ordered By are: ", order.orderedBy)
    // })
    const myOrders = orders.filter((order: any) => {
        return order.orderedBy == user?._id
    })

    // console.log("My orders are:", myOrders);
    console.log("Near by users are: ", nearbyUsers)

    return (
        <div className="container mx-auto py-6 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Community Dashboard</h1>
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
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="farmers">Nearby Farmers</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="interests">Interests</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Products</CardTitle>
                            <CardDescription>Browse products from nearby farmers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {productsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="ml-2">Loading products...</span>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No products available at the moment.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {products.map((product: any) => (
                                        <ProductCard key={product._id} product={product} onViewLocation={handleViewFarmerLocation} role="Admin" />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="farmers" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nearby Farmers</CardTitle>
                                    <CardDescription>Farmers within 10km of your location</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {locationLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <span className="ml-2">Loading farmers...</span>
                                        </div>
                                    ) : nearbyUsers.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No farmers found within 10km of your location.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {nearbyUsers.map((farmer: any) => (
                                                <Card
                                                    key={farmer.id}
                                                    className={selectedFarmerLocation?.name === farmer.name ? "border-primary" : ""}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h3 className="font-medium">{farmer.name}</h3>
                                                                <p className="text-sm text-muted-foreground">Farmer</p>
                                                            </div>
                                                            <Badge variant="outline">
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

                        <div className="md:col-span-2">
                            {currentLocation && (
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
                                    height="500px"
                                />
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Orders</CardTitle>
                            <CardDescription>Track your orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {productsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="ml-2">Loading orders...</span>
                                </div>
                            ) : myOrders.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>You haven't placed any orders yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {myOrders.map((order: any) => (
                                        <TrackingStatus
                                            key={order.id}
                                            status={order.status}
                                            orderId={order._id}
                                            updatedAt={order.updatedAt}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="interests" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Interests</CardTitle>
                            <CardDescription>Interests expressed by users in your community</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {interestsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="ml-2">Loading interests...</span>
                                </div>
                            ) : interests.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No interests found.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {interests.map((interest) => (
                                        <Card key={interest._id}>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {interest.userId.name} <br />
                                                            {interest.userId.phoneNumber}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Interested in: {interest.productId.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Quantity: {interest.quantity} {interest.productId.unit}
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
    )
}

// Import the calculateDistance function
import { calculateDistance } from "../utils/distance"
import { Badge } from "@/components/ui/badge"

export default CommunityDashboard
