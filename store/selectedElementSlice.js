import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
};

export const selectedElementSlice = createSlice({
  name: "selectedElement",
  initialState,
  reducers: {
    setSelectedElement(state, action) {
      return {
        ...action.payload,
      };
    },
    resetSelected(state) {
      return {
        id: "",
      };
    },
  },
});

export const { setSelectedElement, resetSelected } =
  selectedElementSlice.actions;

export default selectedElementSlice.reducer;
