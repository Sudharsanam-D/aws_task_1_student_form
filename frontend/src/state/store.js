import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "./slices/usersSlice"; // Updated reducer import

export const store = configureStore({
  reducer: {
    students: studentReducer, // Updated store key
  },
});
