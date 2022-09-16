import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  pages: 1,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom(state, action) {
      state.id = action.payload.id;
    },
    addPageRoom(state) {
      state.pages++;
    },
    setPageRoom(state, action) {
      state.pages = action.payload.pages;
    },
  },
});

export const { setRoom, addPageRoom, setPageRoom } = roomSlice.actions;
export default roomSlice.reducer;
