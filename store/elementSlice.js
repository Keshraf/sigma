import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const elementSlice = createSlice({
  name: "elements",
  initialState,
  reducers: {
    addElement(state, action) {
      let same = false;
      console.log("ID", action.payload.id);
      if (!action.payload.id || action.payload.id === undefined) {
        return;
      }
      state.forEach((el) => {
        if (el.id === action.payload.id) {
          console.log("SAME ID!");
          same = true;
        }
      });
      if (same) {
        return;
      } else {
        console.log("still pushed!");
        state.push(action.payload);
      }
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
          if (element.type === "image") {
            return {
              ...element,
              width: action.payload.width,
              height: action.payload.height,
              x: action.payload.x,
              y: action.payload.y,
              loaded: true,
            };
          } else {
            return {
              ...element,
              width: action.payload.width,
              height: action.payload.height,
              x: action.payload.x,
              y: action.payload.y,
            };
          }
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
    updateShapeElement(state, action) {
      const newState = state.map((element) => {
        if (element.id === action.payload.id) {
          return {
            ...element,
            color: action.payload.color,
          };
        } else {
          return element;
        }
      });

      return newState;
    },
    updateIconElement(state, action) {
      const newState = state.map((element) => {
        if (element.id === action.payload.id) {
          return {
            ...element,
            color: action.payload.color,
            size: action.payload.size,
          };
        } else {
          return element;
        }
      });

      return newState;
    },
    resetElement(state) {
      return [];
    },
  },
});

export const {
  addElement,
  removeElement,
  updateElement,
  updateTextElement,
  updateShapeElement,
  updateIconElement,
  resetElement,
} = elementSlice.actions;

export default elementSlice.reducer;
