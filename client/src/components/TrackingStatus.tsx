import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react"

interface TrackingStatusProps {
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
    orderId: string
    updatedAt: string
}

const TrackingStatus = ({ status, orderId, updatedAt }: TrackingStatusProps) => {
    console.log("Updated Date is:", updatedAt);
    const getStatusDetails = () => {
        switch (status) {
            case "pending":
                return {
                    icon: <Clock className="w-5 h-5 text-yellow-500" />,
                    color: "bg-yellow-100 text-yellow-800",
                    label: "Pending",
                    description: "Your order is waiting for confirmation",
                }
            case "confirmed":
                return {
                    icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
                    color: "bg-blue-100 text-blue-800",
                    label: "Confirmed",
                    description: "Your order has been confirmed and is being prepared",
                }
            case "shipped":
                return {
                    icon: <Truck className="w-5 h-5 text-indigo-500" />,
                    color: "bg-indigo-100 text-indigo-800",
                    label: "Shipped",
                    description: "Your order is on its way to you",
                }
            case "delivered":
                return {
                    icon: <Package className="w-5 h-5 text-green-500" />,
                    color: "bg-green-100 text-green-800",
                    label: "Delivered",
                    description: "Your order has been delivered successfully",
                }
            case "cancelled":
                return {
                    icon: <XCircle className="w-5 h-5 text-red-500" />,
                    color: "bg-red-100 text-red-800",
                    label: "Cancelled",
                    description: "Your order has been cancelled",
                }
            default:
                return {
                    icon: <Clock className="w-5 h-5 text-gray-500" />,
                    color: "bg-gray-100 text-gray-800",
                    label: "Unknown",
                    description: "Status unknown",
                }
        }
    }

    const { icon, color, label, description } = getStatusDetails()

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">Order #{orderId.slice(0, 8)}</CardTitle>
                    <Badge className={color}>{label}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-3">
                    {icon}
                    <div>
                        <p className="text-sm font-medium">{description}</p>
                        <p className="text-xs text-muted-foreground">Last updated: {new Date(updatedAt).toLocaleString()}</p>
                    </div>
                </div>

                <div className="mt-4 relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-full">
                        <div
                            className={`absolute top-0 left-0 h-2 rounded-full ${status === "pending"
                                ? "w-1/5 bg-yellow-500"
                                : status === "confirmed"
                                    ? "w-2/5 bg-blue-500"
                                    : status === "shipped"
                                        ? "w-3/5 bg-indigo-500"
                                        : status === "delivered"
                                            ? "w-full bg-green-500"
                                            : "w-0 bg-red-500"
                                }`}
                        />
                    </div>

                    <div className="flex justify-between mt-4 pt-1 text-xs">
                        <span
                            className={
                                status === "pending" || status === "confirmed" || status === "shipped" || status === "delivered"
                                    ? "font-medium"
                                    : "text-muted-foreground"
                            }
                        >
                            Pending
                        </span>
                        <span
                            className={
                                status === "confirmed" || status === "shipped" || status === "delivered"
                                    ? "font-medium"
                                    : "text-muted-foreground"
                            }
                        >
                            Confirmed
                        </span>
                        <span className={status === "shipped" || status === "delivered" ? "font-medium" : "text-muted-foreground"}>
                            Shipped
                        </span>
                        <span className={status === "delivered" ? "font-medium" : "text-muted-foreground"}>Delivered</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default TrackingStatus
