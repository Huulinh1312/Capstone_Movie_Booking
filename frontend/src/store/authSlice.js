import { createSlice } from "@reduxjs/toolkit";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

const initialState = { user: readUser(), isLoggedIn: Boolean(readUser()) };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectorIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectorUser = (state) => state.auth.user;
export default authSlice.reducer;
