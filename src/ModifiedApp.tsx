import React from "react";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DataWrapper from "./context/DataWrapper";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Router>
      <DataWrapper>
        <Routes>
          {/* Main Page Route */}
          <Route path="/" element={<MainPage />} />
          {/* 404 Page Route */}
          <Route path="/404" element={<NotFoundPage />} />
          {/* Catch-all Route for undefined paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </DataWrapper>
    </Router>
    //<Leave/>
  );
}

