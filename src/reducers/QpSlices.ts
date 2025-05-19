import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type QPState = {
  roomId: string;
  jobId: string;
  custEmailId: string;
  agentId: string;
  name: string;
  isHost: boolean;
  meetingIsLegit: boolean;
};

export const initialQPState: QPState = {
  roomId: "",
  jobId: "",
  custEmailId: "",
  agentId: "",
  name: "",
  isHost: false,
  meetingIsLegit: false,
};

const qpSlice = createSlice({
  name: "qpReducer",
  initialState: initialQPState,
  reducers: {
    resetQP: () => initialQPState,
    setQP: (_, action: PayloadAction<QPState>) => action.payload,
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setIsHost: (state, action: PayloadAction<boolean>) => {
      state.isHost = action.payload;
    },
    setMeetingLegit: (state, action: PayloadAction<boolean>) => {
      state.meetingIsLegit = action.payload;
    },
  },
});

export const { resetQP, setQP, setName, setIsHost, setMeetingLegit } = qpSlice.actions;
export default{ qpReducer:qpSlice.reducer}
