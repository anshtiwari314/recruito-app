import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

type CuesDataType = {
  id?: string;
  color?: string;
  content?: string;
  iconColor?: string;
  initquery?: string;
  match_score?: string;
  matched_query?: string;
  query?: string[];
  raw_modded_query?: string;
  sessionid?: string;
  similarity_query?: string;
  loading?: boolean;
  audiourl?: string;
  imageUrl?: string;
  common_id?: string;
  type?: string;
  audiofiletimestamp?: string;
  iconName?: string;
  value?: string;
  radio?: string;
  label?: string;
  replies?: string[];
};

// Define the initial state for the Cues
type CuesState = {
  CuesList: Array<CuesDataType> | null;
};

const initialCuesState = {
  CuesList: null,
} as CuesState;

// Create a slice for "cues"
const cuesSlice = createSlice({
  name: "cues",
  initialState: initialCuesState,
  reducers: {
    addCue: (state, action: PayloadAction<CuesDataType>) => {
      // Declare default value for state.CuesList
      let data = {
        id: "",
        color: "#7D11E9",
        content: "",
        iconColor: "blue",
        initquery: " ",
        match_score: "0",
        matched_query: " ",
        query: [" "],
        raw_modded_query: " ",
        sessionid: "xyz",
        similarity_query: " ",
        loading: false,
        audiourl: "",
        imageUrl: "",
        common_id: "",
        type: "TextMsg",
        audiofiletimestamp: "",
        iconName: "",
        value: "",
        radio: "",
        label: "",
        replies: [],
        ...action.payload,
      };

      data["id"] = uuidv4();

      // Add if condition to check if state.CuesList exists and append to array in that case otherwise set it to an array with the new job
      console.log("data in reducer", data);

      if (state.CuesList) {
        state.CuesList.push(data);
      } else {
        state.CuesList = [data];
      }
    },
    // Optionally, you can add actions like reset
    resetCue: (state) => {
      state.CuesList = null;
    },
    setCues: (state, action: PayloadAction<CuesState>) => {
        // Declare default value for state.CuesList
        let data: CuesDataType = {
          id: "",
          color: "#7D11E9",
          content: "",
          iconColor: "blue",
          initquery: " ",
          match_score: "0",
          matched_query: " ",
          query: [" "],
          raw_modded_query: " ",
          sessionid: "xyz",
          similarity_query: " ",
          loading: false,
          audiourl: "",
          imageUrl: "",
          common_id: "",
          type: "TextMsg",
          audiofiletimestamp: "",
          iconName: "",
          value: "",
          radio: "",
          label: "",
          replies: [],
        };
    
        // Add if condition to check if state.CuesList exists and append to array in that case otherwise set it to an array with the new job
        if (action.payload.CuesList) {
            let newState = action.payload.CuesList.map((passedState) => {
                data["id"] = uuidv4();
                return { ...data, ...passedState };
            });
            state.CuesList = newState;
        }
      },
  },
});

export type { CuesState, CuesDataType };
// Export actions so they can be dispatched from components
export const { addCue, resetCue, setCues } = cuesSlice.actions;

// Export the reducer to be included in the store
export default {
  cuesReducer: cuesSlice.reducer,
};

