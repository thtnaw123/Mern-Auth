import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/authSlice";
import { apiSlice } from "../features/apiSlice";

const store = configureStore({
  reducer: {
    auth: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devtools: true,
});

export default store;
