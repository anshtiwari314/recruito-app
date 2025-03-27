import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface MediaStreamState {
  id: string
  peer2Id: string
  audioPeerId: string

  videoStream: MediaStream | null | boolean
  audioStream: MediaStream | null | boolean
  screenStream: MediaStream | null | boolean

  isCameraAvailable: boolean
  isMicrophoneAvailable: boolean
  cameraStatus: boolean
  microphoneStatus: boolean

  isScreenSharingEnabled: boolean
  screenRecording: boolean
  recordingStatus: boolean

  isAdmin: boolean
  isLoading: boolean
  name: string
}

const initialState: MediaStreamState = {
  id: "",
  peer2Id: "",
  audioPeerId: "",

  videoStream: null,
  audioStream: null,
  screenStream: null,

  isCameraAvailable: false,
  isMicrophoneAvailable: false,
  cameraStatus: false,
  microphoneStatus: true,

  isScreenSharingEnabled: false,
  screenRecording: false,
  recordingStatus: false,

  isAdmin: false,
  isLoading: true,
  name: "",
}

export const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
    setPeer2Id: (state, action: PayloadAction<string>) => {
      state.peer2Id = action.payload
    },
    setAudioPeerId: (state, action: PayloadAction<string>) => {
      state.audioPeerId = action.payload
    },
    setVideoStream: (state, action: PayloadAction<MediaStream | null | boolean>) => {
      state.videoStream = action.payload
      if (action.payload instanceof MediaStream) {
        state.isCameraAvailable = true
      } else if (action.payload === false) {
        state.isCameraAvailable = false
      }
    },
    setAudioStream: (state, action: PayloadAction<MediaStream | null | boolean>) => {
      state.audioStream = action.payload
      if (action.payload instanceof MediaStream) {
        state.isMicrophoneAvailable = true
      } else if (action.payload === false) {
        state.isMicrophoneAvailable = false
      }
    },
    setScreenStream: (state, action: PayloadAction<MediaStream | null | boolean>) => {
      state.screenStream = action.payload
      state.isScreenSharingEnabled = action.payload instanceof MediaStream
    },
    setCameraStatus: (state, action: PayloadAction<boolean>) => {
      state.cameraStatus = action.payload
      if (state.videoStream instanceof MediaStream && state.videoStream.getVideoTracks().length > 0) {
        state.videoStream.getVideoTracks()[0].enabled = action.payload
      }
    },
    setMicrophoneStatus: (state, action: PayloadAction<boolean>) => {
      state.microphoneStatus = action.payload
      if (state.audioStream instanceof MediaStream && state.audioStream.getAudioTracks().length > 0) {
        state.audioStream.getAudioTracks()[0].enabled = action.payload
      }
    },
    setScreenSharingEnabled: (state, action: PayloadAction<boolean>) => {
      state.isScreenSharingEnabled = action.payload
    },
    setScreenRecording: (state, action: PayloadAction<boolean>) => {
      state.screenRecording = action.payload
    },
    setRecordingStatus: (state, action: PayloadAction<boolean>) => {
      state.recordingStatus = action.payload
    },
    setIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    },
    resetMediaState: (state) => {
      return initialState
    },
  },
})

export const {
  setUserId,
  setPeer2Id,
  setAudioPeerId,
  setVideoStream,
  setAudioStream,
  setScreenStream,
  setCameraStatus,
  setMicrophoneStatus,
  setScreenSharingEnabled,
  setScreenRecording,
  setRecordingStatus,
  setIsAdmin,
  setIsLoading,
  setName,
  resetMediaState,
} = mediaSlice.actions

export default mediaSlice.reducer

