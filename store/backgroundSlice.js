import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    page: 1,
    background:
      "https://images.unsplash.com/photo-1622737133809-d95047b9e673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjIyMTJ8MHwxfHNlYXJjaHw0N3x8d2FsbHBhcGVyfGVufDB8fHx8MTY2MjYzNjQ2Nw&ixlib=rb-1.2.1&q=80&w=1080",
    type: "background",
    source: "unsplash",
    id: "background_id_xyzyzy",
  },
];

export const backgroundSlice = createSlice({
  name: "background",
  initialState,
  reducers: {
    addBackground(state, action) {
      const newState = {
        id: action.payload.id,
        page: action.payload.page,
        background: action.payload.background,
        type: action.payload.type,
        source: action.payload.source,
      };

      const removedArr = state.filter(
        (background) => background.page !== action.payload.page
      );
      removedArr.push(newState);
      return removedArr;
    },
    addBackgroundUnsplash(state, action) {
      const newState = {
        id: action.payload.id,
        page: action.payload.page,
        background: action.payload.background,
        type: "background",
        source: "unsplash",
      };

      const removedArr = state.filter(
        (background) => background.page !== action.payload.page
      );
      removedArr.push(newState);
      return removedArr;
    },
    addBackgroundFirebase(state, action) {
      const newState = {
        id: action.payload.id,
        page: action.payload.page,
        background: action.payload.background,
        type: "background",
        source: "firebase",
      };

      const removedArr = state.filter(
        (background) => background.page !== action.payload.page
      );
      removedArr.push(newState);
      return removedArr;
    },
    addBackgroundColor(state, action) {
      const newState = {
        id: action.payload.id,
        page: action.payload.page,
        background: action.payload.background,
        type: "background",
        source: "color",
      };

      const removedArr = state.filter(
        (background) => background.page !== action.payload.page
      );
      removedArr.push(newState);
      return removedArr;
    },
  },
});

export const {
  addBackgroundColor,
  addBackgroundFirebase,
  addBackgroundUnsplash,
  addBackground,
} = backgroundSlice.actions;
export default backgroundSlice.reducer;
