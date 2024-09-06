import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  token: Cookies.get("token"),
  profilePic: Cookies.get("profile_img"),
  fullName: Cookies.get("full_name"),
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth: (state, action) => {
      state.token = action.payload.token;
      state.profilePic = action.payload.profilePic;
      state.fullName = action.payload.fullName;
      Cookies.set("token", action.payload.token, {
        expires: 5,
      });
      Cookies.set("full_name", action.payload.full_name, {
        expires: 5,
      });
      Cookies.set("profile_img", action.payload.profile_img, {
        expires: 5,
      });
    },
    resetAuth: (state) => {
      state.token = undefined;
      state.profilePic = null;
      state.fullName = null;
      Cookies.remove("token");
      Cookies.remove("full_name");
      Cookies.remove("profile_img");
    },
  },
});

export const { updateAuth, resetAuth } = AuthSlice.actions;
export default AuthSlice.reducer;
