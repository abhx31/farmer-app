// components/ProductEditDialog.tsx
"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ProductEditForm from "./ProductEditForm"

interface ProductEditDialogProps {
    trigger: React.ReactNode
    product: {
        _id: string
        name: string
        price: number
        quantity: number
        unit: string
    }
}

const ProductEditDialog = ({ trigger, product }: ProductEditDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Product: {product.name}</DialogTitle>
                </DialogHeader>
                <ProductEditForm product={product} />
            </DialogContent>
        </Dialog>
    )
}

export default ProductEditDialog
