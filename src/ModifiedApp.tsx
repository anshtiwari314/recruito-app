import React from "react";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DataWrapper from "./context/DataWrapper";
import ReduxProvider from "@/store/Providers";
import NotFoundPage from "./pages/NotFoundPage";
import TempPage from './pages/TempPage'
import Leave from "./pages/LeavePage";
import { VadWrapper } from "./context/VadWrapper";

export default function App() {
  return (
    <Router>
        <ReduxProvider>
     
          <Routes>    
            {/* <Route path="/" element={<HomePage/>}/> */}
            {/* Main Page Route */}
            <Route path="/" element={<DataWrapper><VadWrapper><MainPage/></VadWrapper></DataWrapper>} />
            {/* 404 Page Route */}
            
            <Route path="/404" element={<NotFoundPage />} />
            
            <Route path="/temp" element={<TempPage/>}/> 

            <Route path="/leave" element={<Leave />}/>
            <Route path="/test" element={<Leave />}/>

            {/* Catch-all Route for undefined paths */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
        </ReduxProvider>
    </Router>
    //<Leave/>
  );
}

