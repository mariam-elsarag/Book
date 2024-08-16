import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  profilePic: localStorage.getItem("avatarTourist"),
  fullName: localStorage.getItem("full_name") || "Mariam Tarek",
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth: (state, action) => {
      state.token = action.payload.token;
      state.profilePic = action.payload.profilePic;
      state.fullName = action.payload.fullName;
    },
  },
});

export const { updateAuth } = AuthSlice.actions;
export default AuthSlice.reducer;
