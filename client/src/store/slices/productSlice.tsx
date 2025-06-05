import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import type { RootState } from ".."


interface Product {
    _id: string
    name: string
    quantity: number
    price: number
    unit: string
    imageURL?: string
    farmerId: string
    farmerPhoneNumber: string
    farmerName: string;  // Add this
    farmerLocation: {    // Add this
        type: string;
        coordinates: [number, number];
    };
    createdAt: string
    updatedAt: string
}

interface Order {
    _id: string
    communityId: string
    farmerId: string
    orderedBy: string
    produceId: string
    quantity: number
    totalPrice: number
    status: "pending" | "delivered"
    createdAt: string
    updatedAt: string
}

interface ProductState {
    products: Product[]
    orders: Order[]
    isLoading: boolean
    error: string | null
}

interface ProductResponse {
    message: string,
    produce: Product[]
}
interface OrderResponse {
    message: string,
    orders: Order[]
}

const initialState: ProductState = {
    products: [],
    orders: [],
    isLoading: false,
    error: null,
}


// Update with your actual backend API URL
const API_URL = "http://localhost:8080/api/v1" // Change this to your backend URL

export const fetchProducts = createAsyncThunk<Product[], void, { state: RootState, rejectValue: string }>("product/fetchProducts", async (_, { rejectWithValue }) => {
    try {
        // console.log("Fetch Product Successfully")
        const token = localStorage.getItem("token");
        const response = await axios.get<ProductResponse>(`${API_URL}/farmer`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(response.data.produce);
        // console.log("fetchProduct is: ", response.data);
        return response.data.produce || []
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch products")
    }
})
// Add this to your existing productSlice.ts
// export const fetchFarmerProducts = createAsyncThunk<Product[], void, { state: RootState, rejectValue: string }>(
//     "product/fetchFarmerProducts",
//     async (_, { rejectWithValue, getState }) => {
//         try {
//             const { auth } = getState() as { auth: { token: string } }
//             const decode = jwtDecode(auth.token);
//             const id = decode.id;
//             console.log(id)
//             const response = await axios.get<ProductResponse>(`${API_URL}/farmer/${id}`, {
//                 headers: {
//                     Authorization: `Bearer ${auth.token}`,
//                 },
//             })
//             return response.data.produce || []
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.message || "Failed to fetch farmer products")
//         }
//     }
// )

export const fetchNearbyProducts = createAsyncThunk<Product[], [number, number], { state: RootState, rejectValue: string }>(
    "product/fetchNearbyProducts",
    async (coordinates: [number, number], { rejectWithValue, getState }) => {
        try {
            const { auth } = getState() as { auth: { token: string } }
            // For now, we'll fetch all products and filter on frontend
            // You can update this when you implement nearby products endpoint
            const response = await axios.get<ProductResponse>(`${API_URL}/farmer`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            })
            return response.data.produce || []
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch nearby products")
        }
    },
)

export const createProduct = createAsyncThunk<Product, { name: string; quantity: number; price: number; unit: string; imageURL?: string }, { state: RootState, rejectValue: string }>(
    "product/createProduct",
    async (
        productData,
        { rejectWithValue, getState },
    ) => {
        try {
            const { auth } = getState() as { auth: { token: string } }
            const response = await axios.post(`${API_URL}/farmer/create`, productData, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            })

            console.log("Receiving payload as: ", response.data);
            return response.data as Product
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create product")
        }
    },
)

export const fetchOrders = createAsyncThunk<Order[], void, { state: RootState, rejectValue: string }>("product/fetchOrders", async (_, { rejectWithValue, getState }) => {
    try {
        const { auth } = getState() as { auth: { token: string } }
        const response = await axios.get<OrderResponse>(`${API_URL}/order`, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        })
        console.log("Orders are", response.data.orders);
        return response.data.orders || []
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch orders")
    }
})

export const createOrder = createAsyncThunk(
    "product/createOrder",
    async (orderData: { productId: string; quantity: number }, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState() as { auth: { token: string } }
            // This endpoint doesn't exist in your backend yet, you'll need to implement it
            const response = await axios.post(
                `${API_URL}/order/${orderData.productId}`, // 👈 Send productId here
                { quantity: orderData.quantity },          // 👈 Send other data in body
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );
            console.log(response);
            return response.data as Order
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create order")
        }
    },
)
export const createInterest = createAsyncThunk<
    any, // You can define a proper response type
    { productId: string; quantity: number },
    { state: RootState; rejectValue: string }
>("product/createInterest", async ({ productId, quantity }, { rejectWithValue, getState }) => {
    try {
        const { auth } = getState()
        const response = await axios.post(
            `${API_URL}/interest`,
            { productId, quantity },
            {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            },
        )
        return response.data
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to express interest")
    }
})

export const updateOrderStatus = createAsyncThunk<
    Order,
    { orderId: string; status: Order["status"] },
    { state: RootState; rejectValue: string }
>(
    "product/updateOrderStatus",
    async ({ orderId, status }, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const response = await axios.put(
                `${API_URL}/order/status`,
                { orderId, status },
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }
            );
            return response.data as Order;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update order status");
        }
    }
);
export const updateProduct = createAsyncThunk<
    Product,
    { productId: string; updatedData: Partial<Omit<Product, "_id" | "farmerId" | "createdAt" | "updatedAt">> },
    { state: RootState; rejectValue: string }
>(
    "product/updateProduct",
    async ({ productId, updatedData }, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const response = await axios.put(
                `${API_URL}/farmer/update/${productId}`,
                updatedData,
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }
            );
            console.log('Response from updated Product', response.data);
            return response.data as Product;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update product");
        }
    }
);

export const deleteProduct = createAsyncThunk<
    string, // Return deleted productId
    string, // productId
    { state: RootState; rejectValue: string }
>(
    "product/deleteProduct",
    async (productId, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            await axios.delete(`${API_URL}/farmer/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            return productId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete product");
        }
    }
);




const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Fetch Nearby Products
            .addCase(fetchNearbyProducts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchNearbyProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = action.payload
            })
            .addCase(fetchNearbyProducts.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Create Product
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false
                state.products.push(action.payload)
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false
                state.orders = action.payload
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false
                state.orders.push(action.payload)
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Update Product
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = state.products.filter(p => p._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

        // .addCase(fetchFarmerProducts.pending, (state) => {
        //     state.isLoading = true
        //     state.error = null
        // })
        // .addCase(fetchFarmerProducts.fulfilled, (state, action) => {
        //     state.isLoading = false
        //     state.products = action.payload
        // })
        // .addCase(fetchFarmerProducts.rejected, (state, action) => {
        //     state.isLoading = false
        //     state.error = action.payload as string
        // })
    },
})

export default productSlice.reducer
