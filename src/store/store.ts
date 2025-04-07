import { configureStore } from "@reduxjs/toolkit"
import cuesReducer from "../reducers/cuesReducer"
import queryparamReducer from "../reducers/queryparamReducer"
import transcriptionReducer from "../reducers/transcriptionReducer"
import usersReducer from "../reducers/usersReducer"
import navigationparamReducer from "../reducers/navigationparamReducer"
import { type TypedUseSelectorHook, useSelector, useDispatch } from "react-redux"

export const store = configureStore({
  reducer: {
    cuesReducer: cuesReducer.cuesReducer, 
    qpReducer: queryparamReducer.qpReducer, 
    transcriptionReducer: transcriptionReducer.transcriptionReducer, 
    usersReducer: usersReducer.usersReducer,
    nvReducer: navigationparamReducer.nvReducer
}})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
