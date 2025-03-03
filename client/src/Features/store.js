import { configureStore } from "@reduxjs/toolkit";
import themeSliceReducer from "./themeSlice";
import refreshSideBar from "./refreshSlice";
import chatSliceReducer from "./chatSlice";
export const store = configureStore({
  reducer: {
    themeKey: themeSliceReducer,
    refreshKey: refreshSideBar,
    chatSlice: chatSliceReducer,
  },
});
