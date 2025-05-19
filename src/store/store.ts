//import {createStore } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import jobSlices from "../reducers/jobSlices";
import QpSlices from "../reducers/QpSlices";



// Create and configure the Redux store
export const store = configureStore({
  reducer: {
    jobReducer: jobSlices.jobReducer,
    qPReducer:QpSlices.qpReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
