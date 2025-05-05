import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NVState = {
  closeCall: boolean,
  audioUploadAnimation: boolean,
};

const initialNVState = {
  closeCall: false,
  audioUploadAnimation: false,
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
    },
    setNVaudioUploadAnimation: (state, action: PayloadAction<boolean>) => {
      state.audioUploadAnimation = action.payload;
    }
  },
});

// Export actions so they can be dispatched from components
export const { resetNV, setNVclosecall, setNVaudioUploadAnimation } = nvSlice.actions;

// Export the reducer to be included in the store
export default {
  nvReducer: nvSlice.reducer,
};

