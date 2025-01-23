//import {createStore } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import cuesReducer from "@/reducers/cuesReducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";

// Create and configure the Redux store
export const store = configureStore({
  reducer: {
    cuesReducer: cuesReducer.cuesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
