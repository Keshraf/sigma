import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

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
    resetBackground(state) {
      return [];
    },
  },
});

export const {
  addBackgroundColor,
  addBackgroundFirebase,
  addBackgroundUnsplash,
  addBackground,
  resetBackground,
} = backgroundSlice.actions;
export default backgroundSlice.reducer;
