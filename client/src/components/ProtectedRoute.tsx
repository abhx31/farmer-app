import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

interface ProtectedRouteProps {
    children: ReactNode
    allowedRole: "User" | "Farmer" | "Admin"
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (user?.role !== allowedRole) {
        // Redirect to appropriate dashboard based on role
        if (user?.role === "Farmer") {
            return <Navigate to="/farmer-dashboard" replace />
        } else if (user?.role === "Admin") {
            console.log(user.role);
            return <Navigate to="/community-dashboard" replace />
        } else if (user?.role === "User") {
            return <Navigate to="/user-dashboard" replace />
        }
    }

    return <>{children}</>
}

export default ProtectedRoute
