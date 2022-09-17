import { configureStore } from "@reduxjs/toolkit";
import elementReducer from "./elementSlice";
import selectedElementReducer from "./selectedElementSlice";
import backgroundReducer from "./backgroundSlice";
import pageReducer from "./pageSlice";
import roomReducer from "./roomSlice";

export const store = configureStore({
  reducer: {
    elements: elementReducer,
    selectedElement: selectedElementReducer,
    background: backgroundReducer,
    page: pageReducer,
    room: roomReducer,
  },
});
