import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

type TranscriptionDataType = {
  id?: string | null;
  name?:string;
  time_stamp?: string;
  transcription?:string;
  is_candidate?:boolean
};

const initialTranscriptionState = {
    id:'',
    name:'',
    timeStamp:'',
    transcription:'',
    is_candidate:false
} as TranscriptionDataType;

// Create a slice for "cues"
const cuesSlice = createSlice({
  name: "transcriptionReducer",
  initialState: initialTranscriptionState,
  reducers: {
    addTranscription: (state, action: PayloadAction<TranscriptionDataType[]>) => {
      // Declare default value for state.
      let data = {...initialTranscriptionState}

      // Add if condition to check if state.CuesList exists and append to array in that case
      if (action.payload) {
        
      }
      return state;
    },
    
    // Optionally, you can add actions like reset
    resetTranscription: (state) => {
      return initialTranscriptionState;
    },

    
  },
});

export type {TranscriptionDataType };
// Export actions so they can be dispatched from components
export const { addTranscription,resetTranscription } = cuesSlice.actions;

// Export the reducer to be included in the store
export default {
  transcriptionReducer: cuesSlice.reducer,
};

