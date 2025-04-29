import { configureStore } from "@reduxjs/toolkit"
import cuesReducer from "../reducers/cuesReducer"
import queryparamReducer from "../reducers/queryparamReducer"
import transcriptionReducer from "../reducers/transcriptionReducer"
import usersReducer from "../reducers/usersReducer"
import navigationparamReducer from "../reducers/navigationparamReducer"
import myStateReducer from "../reducers/myStateReducer"
import { type TypedUseSelectorHook, useSelector, useDispatch } from "react-redux"

export const store = configureStore({
  reducer: {
    cuesReducer: cuesReducer.cuesReducer,
    qpReducer: queryparamReducer.qpReducer,
    transcriptionReducer: transcriptionReducer.transcriptionReducer,
    usersReducer: usersReducer.usersReducer,
    nvReducer: navigationparamReducer.nvReducer,
    myStateReducer: myStateReducer.myStateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "usersReducer/addNewUser",
          "usersReducer/updateMyState",
          "usersReducer/toggleCamera",
          "usersReducer/removeUser",
          "userReducer/setUserStream"
        ],
        ignoredActionPaths: [
          'meta.arg',
          'payload.timestamp',
          'payload.videoStream',
          'payload.audioStream',
          'payload.stream',
          'payload.screenStream'
        ],
        ignoredPaths: [
          'usersReducer',
          'myStateReducer.videoStream',
          'myStateReducer.audioStream',
        ],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
