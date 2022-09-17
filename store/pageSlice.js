import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current: 1,
  pages: [1],
};

export const pageSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    addPage(state) {
      const value = state.pages[state.pages.length - 1] + 1;
      state.pages.push(value);
    },
    setCurrentPage(state, action) {
      const newState = {
        ...state,
        current: action.payload.current,
      };
      return newState;
    },
    setPage(state, action) {
      const value = [];
      for (let i = 1; i <= action.payload.pages; i++) {
        value.push(i);
      }
      state.pages = value;
    },
  },
});

export const { addPage, setCurrentPage, setPage } = pageSlice.actions;
export default pageSlice.reducer;
