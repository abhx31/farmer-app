// components/ProductEditForm.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../store"
import { updateProduct } from "../store/slices/productSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const editSchema = z.object({
    price: z.coerce.number().positive("Price must be positive"),
    quantity: z.coerce.number().int().positive("Quantity must be a positive integer"),
    unit: z.string().min(1, "Unit is required"),
})

type EditFormValues = z.infer<typeof editSchema>

const ProductEditForm = ({ product }: { product: { _id: string, price: number, quantity: number, unit: string } }) => {
    const dispatch = useDispatch<AppDispatch>()
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            price: product.price,
            quantity: product.quantity,
            unit: product.unit,
        },
    })

    const onSubmit = async (data: EditFormValues) => {
        try {
            await dispatch(
                updateProduct({
                    productId: product._id,
                    updatedData: data,
                })
            ).unwrap()

            toast("Product updated", {
                description: "The product was successfully updated.",
            })
        } catch (error) {
            toast("Failed to update product", {
                description: error as string,
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select defaultValue={product.unit} onValueChange={(value) => setValue("unit", value)}>
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

            <Button type="submit">Update</Button>
        </form>
    )
}

export default ProductEditForm
