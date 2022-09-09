import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  background:
    "https://images.unsplash.com/photo-1622737133809-d95047b9e673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjIyMTJ8MHwxfHNlYXJjaHw0N3x8d2FsbHBhcGVyfGVufDB8fHx8MTY2MjYzNjQ2Nw&ixlib=rb-1.2.1&q=80&w=1080",
  type: "background",
  source: "unsplash",
};

export const backgroundSlice = createSlice({
  name: "background",
  initialState,
  reducers: {
    addBackgroundUnsplash(state, action) {
      const newState = {
        page: 1,
        background: action.payload.src,
        type: "background",
        source: "unsplash",
      };

      return newState;
    },
    addBackgroundFirebase(state, action) {
      const newState = {
        page: 1,
        background: action.payload.src,
        type: "background",
        source: "firebase",
      };

      return newState;
    },
    addBackgroundColor(state, action) {
      const newState = {
        page: 1,
        background: action.payload.color,
        type: "background",
        source: "color",
      };

      return newState;
    },
  },
});

export const {
  addBackgroundColor,
  addBackgroundFirebase,
  addBackgroundUnsplash,
} = backgroundSlice.actions;
export default backgroundSlice.reducer;
