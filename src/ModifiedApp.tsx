import React from "react";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReduxProvider from "./store/Providers";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";

export default function App() {
  return (
    <Router>
        <ReduxProvider>
          <Routes>
            {/* <Route path="/" element={<HomePage/>}/> */}
            {/* Main Page Route */}
            <Route path="/" element={<MainPage/>} />
            <Route path="/login" element={<Login/>} />
            {/* 404 Page Route */}
            <Route path="/404" element={<NotFoundPage />} />
            {/* Catch-all Route for undefined paths */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ReduxProvider>
    </Router>
    //<Leave/>
  );
}

