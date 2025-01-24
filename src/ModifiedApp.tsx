import React from "react";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DataWrapper from "./context/DataWrapper";
import ReduxProvider from "@/store/Providers";
import NotFoundPage from "./pages/NotFoundPage";
import BiBhutiUiPage from './pages/BibhutiUiPage';

export default function App() {
  return (
    <Router>
        <ReduxProvider>
        <DataWrapper>
            <MainPage/>
          </DataWrapper>
        </ReduxProvider>
    </Router>
    //<Leave/>
  );
}

