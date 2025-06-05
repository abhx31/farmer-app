import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Package } from "lucide-react"

interface TrackingStatusProps {
    status: "pending" | "delivered"
    orderId: string
    updatedAt: string
}

const TrackingStatus = ({ status, orderId, updatedAt }: TrackingStatusProps) => {
    const getStatusDetails = () => {
        switch (status) {
            case "pending":
                return {
                    icon: <Clock className="w-5 h-5 text-yellow-500" />,
                    color: "bg-yellow-100 text-yellow-800",
                    label: "Pending",
                    description: "Your order is waiting for confirmation",
                    progress: "w-1/2 bg-yellow-500",
                }
            case "delivered":
                return {
                    icon: <Package className="w-5 h-5 text-green-500" />,
                    color: "bg-green-100 text-green-800",
                    label: "Delivered",
                    description: "Your order has been delivered successfully",
                    progress: "w-full bg-green-500",
                }
            default:
                return {
                    icon: <Clock className="w-5 h-5 text-gray-500" />,
                    color: "bg-gray-100 text-gray-800",
                    label: "Unknown",
                    description: "Status unknown",
                    progress: "w-0 bg-gray-300",
                }
        }
    }

    const { icon, color, label, description, progress } = getStatusDetails()

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">Order #{orderId.slice(0, 8)}</CardTitle>
                    <Badge className={color}>{label}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-3 mb-4">
                    {icon}
                    <div>
                        <p className="text-sm font-medium">{description}</p>
                        <p className="text-xs text-muted-foreground">Last updated: {new Date(updatedAt).toLocaleString()}</p>
                    </div>
                </div>

                <div className="relative h-2 rounded-full bg-gray-200 mb-3">
                    <div className={`absolute h-2 rounded-full ${progress}`}></div>
                </div>

                <div className="flex justify-between text-xs">
                    <span className={status === "pending" || status === "delivered" ? "font-medium" : "text-muted-foreground"}>
                        Pending
                    </span>
                    <span className={status === "delivered" ? "font-medium" : "text-muted-foreground"}>
                        Delivered
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export default TrackingStatus
