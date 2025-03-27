import { configureStore } from "@reduxjs/toolkit"
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import mediaReducer from "./slices/mediaSlice"
import connectionReducer from "./slices/connectionSlice"
import usersReducer from "./slices/usersSlice"
import chatReducer from "./slices/chatSlice"
import configReducer from "./slices/configSlice"
import cuesReducer from "./slices/cuesSlice"
import transcriptionReducer from "./slices/transcriptionSlice"
import qpReducer from "./slices/qpSlice"
import nvReducer from "./slices/navigationParamSlice"

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    connection: connectionReducer,
    users: usersReducer,
    chat: chatReducer,
    config: configReducer,
    cuesReducer,
    transcriptionReducer,
    qpReducer,
    nvReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "media/setVideoStream",
          "media/setAudioStream",
          "media/setScreenStream",
          "connection/setSocket",
          "connection/setSocket2",
          "connection/setPeer",
          "connection/setPeer2",
          "connection/setAudioPeer",
          "users/setUsers",
          "users/addUser",
          "users/updateUser",
        ],
        ignoredActionPaths: [
          "payload.stream",
          "payload.videoStream",
          "payload.audioStream",
          "payload.socket",
          "payload.peer",
        ],
        ignoredPaths: [
          "media.videoStream",
          "media.audioStream",
          "media.screenStream",
          "connection.socket",
          "connection.socket2",
          "connection.peer",
          "connection.peer2",
          "connection.audioPeer",
          "users.users",
        ],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

