//import {createStore } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import cuesReducer from "@/reducers/cuesReducer";
import queryparamReducer from "@/reducers/queryparamReducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import transcriptionReducer from "@/reducers/transcriptionReducer";
import usersReducer from "@/reducers/usersReducer";
import navigationparamReducer from "@/reducers/navigationparamReducer";
import chatReducer from "@/reducers/chatReducer";

// Create and configure the Redux store
export const store = configureStore({
  reducer: {
    cuesReducer: cuesReducer.cuesReducer,
    qpReducer: queryparamReducer.qpReducer,
    trcpReducer:transcriptionReducer.transcriptionReducer,
    usersReducer:usersReducer.usersReducer,
    nvReducer: navigationparamReducer.nvReducer,
    chatReducer:chatReducer.chatReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
