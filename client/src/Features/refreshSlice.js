import { createSlice } from "@reduxjs/toolkit";

export const refreshSlice = createSlice({
  name: "refreshSlice",
  initialState: true,
  reducers: {
    setRefresh: (state) => {
      return (state = !state);
    },
  },
});

export const { setRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;
