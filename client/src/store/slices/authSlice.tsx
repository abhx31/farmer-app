import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

// Define User roles
export type UserRole = "User" | "Farmer" | "Admin"

// Define User type
interface User {
    _id: string
    name: string
    email: string
    role: UserRole
    phoneNumber: string
    location: {
        type: string
        coordinates: [number, number]
    }
}

// Define AuthState shape
interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

// Initial state
const initialState: AuthState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    error: null,
}

// Input types
interface LoginCredentials {
    email: string
    password: string
}

interface SignUpData {
    name: string
    email: string
    password: string
    phoneNumber: string
    role: UserRole
    location: {
        type: string
        coordinates: [number, number]
    }
}

// Response type
interface AuthResponse {
    user: User
    token: string
}

// Replace with your actual API URL
const API_URL = "http://localhost:8080/api/v1"

// Login thunk
export const login = createAsyncThunk<
    AuthResponse,
    LoginCredentials,
    { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials)
        const { token, user } = response.data
        // console.log("Login SUCCESS")
        // console.log("Token:", token)
        // console.log("User:", user)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        return { token, user }
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Login failed")
    }
})

// Signup thunk
export const signup = createAsyncThunk<
    AuthResponse,
    SignUpData,
    { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData)
        const { token, user } = response.data
        const normalizedUser = { ...user, id: user._id }
        delete (normalizedUser as any)._id
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        return { token, user: normalizedUser }
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Signup failed")
    }
})

// Logout thunk
export const logout = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    return null
})

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
        },
        clearCredentials: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {

                state.isLoading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.token = action.payload.token
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || "Login failed"
            })

            // Signup
            .addCase(signup.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.token = action.payload.token
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || "Signup failed"
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.token = null
                state.isAuthenticated = false
            })
    },
})

// Exports
export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
