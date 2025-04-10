import { configureStore } from "@reduxjs/toolkit"
import cuesReducer from "../reducers/cuesReducer"
import queryparamReducer from "../reducers/queryparamReducer"
import transcriptionReducer from "../reducers/transcriptionReducer"
import usersReducer from "../reducers/usersReducer"
import navigationparamReducer from "../reducers/navigationparamReducer"
import myStateReducer from "../reducers/myStateReducer"
import { type TypedUseSelectorHook, useSelector, useDispatch } from "react-redux"

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["usersReducer/updateMyState"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  reducer: {
    cuesReducer: cuesReducer.cuesReducer, 
    qpReducer: queryparamReducer.qpReducer, 
    transcriptionReducer: transcriptionReducer.transcriptionReducer, 
    usersReducer: usersReducer.usersReducer,
    nvReducer: navigationparamReducer.nvReducer,
    myStateReducer:myStateReducer.myStateReducer
}})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
