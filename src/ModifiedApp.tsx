import React from "react";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReduxProvider from "./store/Providers";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import TestWrapper from "./context/TestWrapper";

export default function App() {
  return (
    <Router>
      <ReduxProvider>
        <TestWrapper>
          <Routes>
            <Route path="/" element={<MainPage/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TestWrapper>
      </ReduxProvider>
    </Router>
  );
}


