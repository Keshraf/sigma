import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  pages: 1,
  admin: "",
  name: "",
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setInitialRoom(state, action) {
      return {
        id: action.payload.id,
        admin: action.payload.admin,
        name: action.payload.name,
        pages: action.payload.pages,
      };
    },
    setRoom(state, action) {
      state.id = action.payload.id;
    },
    addPageRoom(state) {
      state.pages++;
    },
    setPageRoom(state, action) {
      state.pages = action.payload.pages;
    },
    setRoomName(state, action) {
      state.name = action.payload.name;
    },
  },
});

export const {
  setRoom,
  addPageRoom,
  setPageRoom,
  setInitialRoom,
  setRoomName,
} = roomSlice.actions;
export default roomSlice.reducer;
