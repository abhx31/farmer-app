// store/slices/communityInterestSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Interest {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    productId: {
        _id: string;
        name: string;
        quantity: number;
        price: number;
        unit: string;
        imageURL?: string;
    };
    quantity: number;
    createdAt: string;
    updatedAt: string;
}

interface CommunityInterestState {
    interests: Interest[];
    loading: boolean;
    error: string | null;
}

interface CommunityResponse {
    message: string,
    interests: Interest[]
}

const initialState: CommunityInterestState = {
    interests: [],
    loading: false,
    error: null,
};
const API_URL = "http://localhost:8080/api/v1"
// 🔁 Async thunk to fetch community interests
export const fetchCommunityInterests = createAsyncThunk(
    "communityInterests/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get<CommunityResponse>(`${API_URL}/user/admin/interests`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust if using cookies
                },
            });
            console.log("Interests are: ", res.data.interests);
            return res.data.interests;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch interests");
        }
    }
);

const communityInterestSlice = createSlice({
    name: "communityInterests",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommunityInterests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommunityInterests.fulfilled, (state, action) => {
                state.loading = false;
                state.interests = action.payload;
            })
            .addCase(fetchCommunityInterests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default communityInterestSlice.reducer;
