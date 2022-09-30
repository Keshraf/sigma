import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: "",
  },
  reducers: {
    setUser(state, action) {
      console.log("SET USER: ", action.payload);
      state.user = action.payload;
    },
    resetUser(state) {
      state.user = "";
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
