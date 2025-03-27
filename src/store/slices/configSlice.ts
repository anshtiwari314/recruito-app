import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ConfigState {
  adminUrl: string
  videoUploadUrl: string
  validUrl: string
}

const initialState: ConfigState = {
  adminUrl: "https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/recruiter-copilot",
  videoUploadUrl: "https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/postfacto-upload-test",
  validUrl: "",
}

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setAdminUrl: (state, action: PayloadAction<string>) => {
      state.adminUrl = action.payload
    },
    setVideoUploadUrl: (state, action: PayloadAction<string>) => {
      state.videoUploadUrl = action.payload
    },
    setValidUrl: (state, action: PayloadAction<string>) => {
      state.validUrl = action.payload
    },
    resetConfigState: (state) => {
      return initialState
    },
  },
})

export const { setAdminUrl, setVideoUploadUrl, setValidUrl, resetConfigState } = configSlice.actions

export default configSlice.reducer

