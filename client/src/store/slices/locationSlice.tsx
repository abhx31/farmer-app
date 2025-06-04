import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface User {
    id: string
    name: string
    role: string
    location: {
        type: string
        coordinates: [number, number]
    }
}

interface LocationState {
    currentLocation: {
        type: string
        coordinates: [number, number]
    } | null
    nearbyUsers: User[]
    isLoading: boolean
    error: string | null
}

const initialState: LocationState = {
    currentLocation: null,
    nearbyUsers: [],
    isLoading: false,
    error: null,
}
interface NearbyUsersResponse {
    message: string
    users: User[]
}
// Replace with your actual API URL
const API_URL = "http://localhost:8080/api/v1"

export const getCurrentLocation = createAsyncThunk<
    { type: string; coordinates: [number, number] },
    void,
    { rejectValue: string }
>("location/getCurrentLocation", async (_, { rejectWithValue }) => {
    try {
        return await new Promise<{ type: string; coordinates: [number, number] }>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        type: "Point",
                        coordinates: [position.coords.longitude, position.coords.latitude],
                    })
                },
                (error) => {
                    reject(error.message)
                },
            )
        })
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to get current location")
    }
})

export const fetchNearbyUsers = createAsyncThunk<
    User[], // ✅ Return type
    { coordinates: [number, number]; role: string }, // ✅ Argument type
    { rejectValue: string } // ✅ Rejection type
>(
    "location/fetchNearbyUsers",
    async ({ coordinates, role }, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState() as { auth: { token: string } }
            const response = await axios.get<NearbyUsersResponse>(
                `${API_URL}/user/nearby?longitude=${coordinates[0]}&latitude=${coordinates[1]}&radius=10&role=${role}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                },
            )
            console.log(response.data);
            return response.data.users
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch nearby users")
        }
    }
)

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setCurrentLocation: (state, action: PayloadAction<{ type: string; coordinates: [number, number] }>) => {
            state.currentLocation = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Current Location
            .addCase(getCurrentLocation.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(getCurrentLocation.fulfilled, (state, action) => {
                state.isLoading = false
                state.currentLocation = action.payload
            })
            .addCase(getCurrentLocation.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Fetch Nearby Users
            .addCase(fetchNearbyUsers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchNearbyUsers.fulfilled, (state, action) => {
                state.isLoading = false
                state.nearbyUsers = action.payload
            })
            .addCase(fetchNearbyUsers.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    },
})

export const { setCurrentLocation } = locationSlice.actions
export default locationSlice.reducer
