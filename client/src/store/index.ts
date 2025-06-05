import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import productReducer from "./slices/productSlice"
import locationReducer from "./slices/locationSlice"
import communityInterestReducer from "./slices/communityInterestSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        location: locationReducer,
        communityInterests: communityInterestReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
