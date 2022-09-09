import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    page: 1,
    font: "Roboto",
    weight: 700,
    size: 24,
    align: "left",
    color: "#2599FF",
    x: 15,
    y: 15,
    type: "text",
    width: 200,
    height: 100,
    content: "Nice to Meet You!",
    roomId: "xyz",
    id: "lekG3C_g6c-rk3LzZX",
  },
  {
    page: 1,
    src: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjIyMTJ8MHwxfHNlYXJjaHw1Mnx8d2FsbHBhcGVyfGVufDB8fHx8MTY2MjYzNjQ2Nw&ixlib=rb-1.2.1&q=80&w=400",
    width: 200,
    height: 100,
    x: 15,
    y: 15,
    type: "image",
    id: "test_image",
  },
];

export const elementSlice = createSlice({
  name: "elements",
  initialState,
  reducers: {
    addElement(state, action) {
      state.push(action.payload);
    },
    removeElement(state, action) {
      const newState = state.filter(
        (element) => element.id !== action.payload.id
      );
      return newState;
    },
    updateElement(state, action) {
      const newState = state.map((element) => {
        if (element.id === action.payload.id) {
          return {
            ...element,
            width: action.payload.width,
            height: action.payload.height,
            x: action.payload.x,
            y: action.payload.y,
          };
        } else {
          return element;
        }
      });
      return newState;
    },
    updateTextElement(state, action) {
      const newState = state.map((element) => {
        if (element.id === action.payload.id) {
          return {
            ...element,
            content: action.payload.content,
            color: action.payload.color,
            size: action.payload.size,
            font: action.payload.font,
            weight: action.payload.weight,
            align: action.payload.align,
          };
        } else {
          return element;
        }
      });

      return newState;
    },
  },
});

export const { addElement, removeElement, updateElement, updateTextElement } =
  elementSlice.actions;

export default elementSlice.reducer;
