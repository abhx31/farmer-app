"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../store"
import { createInterest, createOrder } from "../store/slices/productSlice"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { MapPin, ShoppingCart } from "lucide-react"
import { deleteProduct } from "../store/slices/productSlice"
import ProductEditDialog from "./ProductEditDialog"


interface ProductCardProps {
    product: {
        _id: string
        name: string
        price: number
        quantity: number
        unit: string
        imageUrl?: string
        farmerId: string
        farmerPhoneNumber: string
        farmerName: string
        farmerLocation: {
            type: string
            coordinates: [number, number]
        }
    }
    onViewLocation?: (coordinates: [number, number], farmerName: string) => void
    role?: "User" | "Admin" | "Farmer"
}

const ProductCard = ({ product, onViewLocation, role }: ProductCardProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const [orderQuantity, setOrderQuantity] = useState(1)
    const [isOrdering, setIsOrdering] = useState(false)

    const handleOrder = async () => {
        if (orderQuantity <= 0 || orderQuantity > product.quantity) {
            toast("Invalid quantity", {
                description: `Please enter a quantity between 1 and ${product.quantity}.`,
            })
            return
        }

        setIsOrdering(true)
        try {
            await dispatch(
                createOrder({
                    productId: product._id,
                    quantity: orderQuantity,
                }),
            ).unwrap()

            toast("Order placed", {
                description: `You have successfully ordered ${orderQuantity} ${product.unit} of ${product.name}.`,
            })
        } catch (error) {
            toast("Failed to place order", {
                description: error as string,
            })
        } finally {
            setIsOrdering(false)
        }
    }

    const handleInterest = async () => {
        if (orderQuantity <= 0 || orderQuantity > product.quantity) {
            toast("Invalid quantity", {
                description: `Please enter a quantity between 1 and ${product.quantity}.`,
            })
            return
        }

        try {
            setIsOrdering(true)
            await dispatch(
                createInterest({
                    productId: product._id,
                    quantity: orderQuantity,
                }),
            ).unwrap()

            toast("Interest noted", {
                description: `You expressed interest in ${orderQuantity} ${product.unit} of ${product.name}.`,
            })
        } catch (error: any) {
            toast("Failed to express interest", {
                description: error || "Something went wrong.",
            })
        } finally {
            setIsOrdering(false)
        }
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteProduct(product._id)).unwrap();
            toast("Product deleted", {
                description: `${product.name} was removed.`,
            });
        } catch (error) {
            toast("Failed to delete product", {
                description: error as string,
            });
        }
    };
    const getImagePath = (productName: string): string => {
        const fileName = productName.toLowerCase().replace(/\s+/g, "-")
        return `/assets/products/${fileName}.jpg`
    }




    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{product.name}</CardTitle>
                    </div>
                    <Badge variant="outline">
                        {product.quantity} {product.unit} available
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="w-full h-40 mb-4 overflow-hidden rounded-md">
                    <img
                        src={getImagePath(product.name)}
                        alt={product.name}
                        onError={(e) => {
                            // Fallback to default image if not found
                            (e.target as HTMLImageElement).src = "/assets/products/default.jpg"
                        }}
                        className="w-full h-full object-cover"

                    />
                </div>


                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                        ₹{product.price.toFixed(2)} / {product.unit}
                    </span>

                    {onViewLocation && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                onViewLocation(product.farmerLocation.coordinates, product.farmerName)
                            }
                        >
                            <MapPin className="w-4 h-4 mr-1" />
                            View Location
                        </Button>
                    )}
                </div>
                {role !== "Farmer" && (<div className="mt-6 text-sm text-muted-foreground">
                    <div>Farmer: <span className="font-medium text-black">{product.farmerName}</span></div>
                    <div>Phone Number: <span className="font-medium text-black">{product.farmerPhoneNumber}</span></div>
                </div>)}

            </CardContent>

            <CardFooter className="border-t pt-4">
                {(role === "Admin" || role === "User") && (
                    <div className="flex items-center gap-2 w-full">
                        <Input
                            type="number"
                            min="1"
                            max={product.quantity}
                            value={orderQuantity}
                            onChange={(e) => setOrderQuantity(Number.parseInt(e.target.value) || 0)}
                            className="flex-grow"
                        />
                        {role === "Admin" ? (
                            <Button onClick={handleOrder} disabled={isOrdering}>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Order
                            </Button>
                        ) : (
                            <Button onClick={handleInterest} disabled={isOrdering}>
                                I'm Interested
                            </Button>
                        )}
                    </div>
                )}
                {role === "Farmer" && (
                    <div className="flex items-center justify-between w-full">
                        <ProductEditDialog
                            product={{
                                _id: product._id,
                                price: product.price,
                                quantity: product.quantity,
                                unit: product.unit,
                                name: product.name,
                            }}
                            trigger={
                                <Button variant="outline">
                                    Edit
                                </Button>
                            }
                        />
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

export default ProductCard
