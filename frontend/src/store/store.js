import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./booking/bookingSlice"
import authReducer from "./authSlice"
import { authMiddleware } from "./middleware/authMiddleware";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        booking : bookingReducer
    },
    middleware: () => [authMiddleware]
})

