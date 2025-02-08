import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NVState = {
  closeCall: boolean,
};

const initialNVState = {
  closeCall: false,
} as NVState;

// Create a slice for "navigation parameters"
const nvSlice = createSlice({
  name: "nvReducer",
  initialState: initialNVState,
  reducers: {
    // Optionally, you can add actions like reset
    resetNV: (state) => {
      Object.assign(state, initialNVState);
    },
    setNVclosecall: (state, action: PayloadAction<boolean>) => {
      state.closeCall = action.payload;
    }
  },
});

// Export actions so they can be dispatched from components
export const { resetNV, setNVclosecall } = nvSlice.actions;

// Export the reducer to be included in the store
export default {
  nvReducer: nvSlice.reducer,
};

