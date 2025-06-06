"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { fetchOrders, fetchNearbyProducts } from "../store/slices/productSlice"
import { getCurrentLocation } from "../store/slices/locationSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, LogOut, RefreshCw } from "lucide-react"
import ProductCard from "../components/ProductCard"
import GoogleMap from "../components/GoogleMap"
import { logout } from "../store/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchCommunityInterests } from "../store/slices/communityInterestSlice"

const UserDashboard = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    // const { toast } = useToast()
    const { user } = useSelector((state: RootState) => state.auth)
    const { products, isLoading: productsLoading } = useSelector((state: RootState) => state.product)
    const { currentLocation, isLoading: locationLoading } = useSelector((state: RootState) => state.location)
    const [activeTab, setActiveTab] = useState("products")
    const [refreshing, setRefreshing] = useState(false)
    const { interests } = useSelector(
        (state: RootState) => state.communityInterests
    )

    const [selectedFarmerLocation, setSelectedFarmerLocation] = useState<{
        coordinates: [number, number]
        name: string
    } | null>(null)

    useEffect(() => {
        // Get current location
        dispatch(getCurrentLocation())
        dispatch(fetchOrders())
        dispatch(fetchCommunityInterests())
    }, [dispatch])

    // Fetch nearby products when location is available
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

    // Filter orders for the current user
    interests.map((interest) => {
        console.log("Interest made by the user are:", interest.userId.name);
    })
    console.log("User id is: ", user?._id)
    const filteredInterests = interests.filter((interest) => {
        return interest.userId._id === user?._id
    })


    return (
        <div className="container mx-auto py-6 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">User Dashboard</h1>
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
                    <TabsTrigger value="products">Nearby Products</TabsTrigger>
                    <TabsTrigger value="map">Farmer Locations</TabsTrigger>
                    <TabsTrigger value="orders">My Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nearby Products</CardTitle>
                            <CardDescription>Products from farmers within 10km of your location</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {productsLoading || locationLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="ml-2">Loading products...</span>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No products available in your area.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} onViewLocation={handleViewFarmerLocation} role="User" />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="map" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Farmer Locations</CardTitle>
                            <CardDescription>
                                {selectedFarmerLocation
                                    ? `Viewing location of ${selectedFarmerLocation.name}`
                                    : "View farmers in your area"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!currentLocation ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="ml-2">Loading map...</span>
                                </div>
                            ) : (
                                <>
                                    {
                                        // Log products with missing coordinates
                                        products.forEach((product) => {
                                            if (!product.farmerLocation?.coordinates) {
                                                console.warn(`Missing coordinates for product ${product.name} by ${product.farmerName}`)
                                            }
                                        })
                                    }
                                    <GoogleMap
                                        center={selectedFarmerLocation?.coordinates || currentLocation.coordinates}
                                        markers={[
                                            {
                                                position: currentLocation.coordinates,
                                                title: `${user?.name} (You)`,
                                                role: "User",
                                            },
                                            ...products.map((product) => ({

                                                position: product.farmerLocation?.coordinates,
                                                title: `${product.farmerName} (${product.name})`,
                                                role: "Farmer",
                                            })),
                                        ]}
                                        height="500px"
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>
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
                            ) : interests.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>You haven't placed any orders yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredInterests.map((interest) => (
                                        <Card key={interest._id} className="p-4">
                                            <CardHeader>
                                                <CardTitle>{interest.productId.name}</CardTitle>
                                                <CardDescription>
                                                    Price: ₹{interest.productId.price} per {interest.productId.unit}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p>
                                                    Quantity Ordered: <strong>{interest.quantity}</strong>
                                                </p>
                                                <p>Ordered by: {interest.userId.name}</p>
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

export default UserDashboard
