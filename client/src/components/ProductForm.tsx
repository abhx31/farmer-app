"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../store"
import { createProduct } from "../store/slices/productSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useState } from "react"

const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    price: z.coerce.number().positive("Price must be positive"),
    quantity: z.coerce.number().int().positive("Quantity must be a positive integer"),
    unit: z.string().min(1, "Unit is required"),
    imageUrl: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>
const imageMap: Record<string, string> = {
    Tomato: "/assets/products/tomato.jpg",
    Potato: "/assets/products/potato.jpg",
    Carrot: "/assets/products/carrot.jpg",
    Onion: "/assets/products/onion.jpg",
    Brinjal:"/assets/products/brinjal.jpg",
    Spinach:"/assets/products/spinach.jpg",
    // Add more as needed
}


const ProductForm = () => {
    const dispatch = useDispatch() as AppDispatch
    // const { toast } = Toast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            unit: "kg",
        },
    })

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true)
        try {
            const payload = {
                name: data.name,
                price: data.price,
                quantity: data.quantity,
                unit: data.unit,
                imageURL: data.imageUrl, // Rename to match backend expectation
            }
            console.log("Payload going as :", payload)
            await dispatch(createProduct(payload)).unwrap()
            toast("Product created", {
                description: "Your product has been created successfully!",
            })
            reset()
        } catch (error) {
            toast("Failed to create product", {
                description: error as string,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Create a new product to sell</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product</Label>
                        <Select
                            onValueChange={(value: string) => {
                                setValue("name", value)
                                setValue("imageUrl", imageMap[value])
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(imageMap).map((product) => (
                                    <SelectItem key={product} value={product}>
                                        {product}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>



                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" type="number" step="0.01" {...register("price")} />
                            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input id="quantity" type="number" {...register("quantity")} />
                            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Select onValueChange={(value: string) => setValue("unit", value)} defaultValue="kg"  {...register("unit")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                <SelectItem value="g">Gram (g)</SelectItem>
                                <SelectItem value="lb">Pound (lb)</SelectItem>
                                <SelectItem value="oz">Ounce (oz)</SelectItem>
                                <SelectItem value="piece">Piece</SelectItem>
                                
                                <SelectItem value="bunch">Bunch</SelectItem>
                                <SelectItem value="dozen">Dozen</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                        <Input id="imageUrl" {...register("imageUrl")} />
                        {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button type="submit" form="product-form" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Product"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ProductForm
