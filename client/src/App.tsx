import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
// import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/sonner"
import { store } from "./store"
import SignUp from "./Pages/SignUp"
import Login from "./Pages/Login"
import FarmerDashboard from "./Pages/FarmerDashboard"
import CommunityDashboard from "./Pages/CommunityDashboard"
import UserDashboard from "./Pages/UserDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import LandingPage from "./Pages/LandingPage"


function App() {
  return (
    <Provider store={store}>
      {/* <ThemeProvider defaultTheme="light" storageKey="produce-platform-theme"> */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/farmer-dashboard/*"
            element={
              <ProtectedRoute allowedRole="Farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community-dashboard/*"
            element={
              <ProtectedRoute allowedRole="Admin">
                <CommunityDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard/*"
            element={
              <ProtectedRoute allowedRole="User">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <Toaster />
      {/* </ThemeProvider> */}
    </Provider>
  )
}

export default App
