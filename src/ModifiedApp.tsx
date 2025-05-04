import React from "react";
import MainPage from "./pages/MainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReduxProvider from "./store/Providers";
import NotFoundPage from "./pages/NotFoundPage";
import TempPage from './pages/TempPage'
import Leave from "./pages/LeavePage";
import TestWrapper from './context/TestWrapper'
import SocketWrapper from "./context/SocketWrapper";
import HomePage from "./pages/old-HomePage";
import PeerWrapper from "./context/PeerWrapper";
import VadWrapper from "./context/VadWrapper";


export default function App() {
  return (
    <Router>
        <ReduxProvider >
        {/* <DataWrapper> */}
          <Routes>
            
            {/* <Route path="/" element={<HomePage/>}/> */}
            {/* Main Page Route */}
           
           <Route path="/" element={<HomePage />} /> 
           {/* this is the home page maybe in fture desigen need to change of it [maybe asking for name or email] */}
           <Route path="/meeting.html"
                  element={
                    <TestWrapper>
                    <SocketWrapper>
                      <PeerWrapper>
                        <VadWrapper>
                        <MainPage />
                        </VadWrapper>
                      </PeerWrapper>
                    </SocketWrapper>
                  </TestWrapper>
                      }
                    />
            {/* 404 Page Route */}
            
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/temp" element={<TempPage/>}/> 
            <Route path="/leave" element={<Leave />}/>
            <Route path="/test" element={<Leave />}/>
            {/* Catch-all Route for undefined paths */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {/* </DataWrapper> */}
     
        </ReduxProvider>
    </Router>
    //<Leave/>
  );
}

