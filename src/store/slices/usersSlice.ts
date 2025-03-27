import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  peer2Id: string
  audioPeerId: string

  stream: MediaStream | null | boolean
  videoStream: MediaStream | null | boolean
  audioStream: MediaStream | null | boolean

  isCameraAvailable: boolean
  isMicrophoneAvailable: boolean
  cameraStatus: boolean
  microphoneStatus: boolean

  isAdmin: boolean
  isAudioStream: boolean
  isLoading: boolean
  roomId: string
  custEmailId: string | number
  agentId: string
  remove: boolean
  name: string
  isScreenSharingEnabled: boolean
  containsScreenStream: boolean
}

interface UsersState {
  users: User[]
  largeVideo: any
}

const initialUser: User = {
  id: "",
  peer2Id: "",
  audioPeerId: "",
  name: "",

  stream: null,
  videoStream: null,
  audioStream: null,
  isCameraAvailable: false,
  isMicrophoneAvailable: false,
  cameraStatus: false,
  microphoneStatus: true,

  isAdmin: false,
  isAudioStream: false,
  isLoading: true,
  roomId: "",
  custEmailId: "",
  agentId: "",
  remove: false,

  isScreenSharingEnabled: false,
  containsScreenStream: false,
}

const initialState: UsersState = {
  users: [],
  largeVideo: null,
}

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload)
    },
    updateUser: (state, action: PayloadAction<{ id: string; updates: Partial<User> }>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload.updates }
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload)
    },
    setLargeVideo: (state, action: PayloadAction<any>) => {
      state.largeVideo = action.payload
    },
    resetUsersState: (state) => {
      return initialState
    },
  },
})

export const { setUsers, addUser, updateUser, removeUser, setLargeVideo, resetUsersState } = usersSlice.actions

export { initialUser }
export default usersSlice.reducer

