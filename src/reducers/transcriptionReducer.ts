import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

type TranscriptionDataType = {
  id?: string | null,
  speaker?:string,
  transcription?: string,
  timeStamp?:string,
  isCandidate:boolean
};

type TranscriptionState = {
  TranscriptionList: Array<TranscriptionDataType>;
};

const initialTranscriptionObj:TranscriptionDataType = {
  id:'',
  speaker:'',
  transcription:'',
  timeStamp:'',
  isCandidate:false
};


const initialTranscriptionLoadState = [
  {
    id: 'abcde',
  speaker:'anuj',
  transcription: 'It is a long established fact that a reader will be distracted',
  timeStamp:'08:35pm',
  isCandidate:true
},
  {
    id: 'abcde',
  speaker:'anuj',
  transcription: 'It is a long established fact that a reader will be distracted',
  timeStamp:'08:35pm',
  isCandidate:false
},
  {
    id: 'abcde',
  speaker:'anuj',
  transcription: 'It is a long established fact that a reader will be distracted',
  timeStamp:'08:35pm',
  isCandidate:false
}
]

const initialTranscriptionState = {
  TranscriptionList: [...initialTranscriptionLoadState],
} as TranscriptionState;

// Create a slice for "transcription"
const trcpSlice = createSlice({
  name: "transcriptionReducer",
  initialState: initialTranscriptionState,
  reducers: {
    addTranscription: (
      state,
      action: PayloadAction<TranscriptionDataType[]>
    ) => {
      // Declare default value for state.
      let data = { ...initialTranscriptionState };

      // Add if condition to check if state.CuesList exists and append to array in that case
      if (action.payload) {
        state.TranscriptionList = [
          ...state.TranscriptionList,
          ...action.payload,
        ];
      }
      return state;
    },

    // Optionally, you can add actions like reset
    resetTranscription: (state) => {
      return initialTranscriptionState;
    },
  },
});

export type { TranscriptionDataType };
// Export actions so they can be dispatched from components
export const { addTranscription, resetTranscription } = trcpSlice.actions;

export {initialTranscriptionObj }

// Export the reducer to be included in the store
export default {
  transcriptionReducer: trcpSlice.reducer,
};

