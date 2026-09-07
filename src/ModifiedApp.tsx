import React from "react";
import MainPage from "./pages/MainPage";
import CreateMeetingPage from "./pages/CreateMeetingPage";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import DataWrapper from "./context/DataWrapper";
import ReduxProvider from "@/store/Providers";
import NotFoundPage from "./pages/NotFoundPage";
import TempPage from "./pages/TempPage";
import Leave from "./pages/LeavePage";
import { VadWrapper } from "./context/VadWrapper";

const RESERVED_PATHS = new Set(["404", "temp", "leave", "test"]);

function MeetingRoute() {
  return (
    <DataWrapper>
      <VadWrapper>
        <MainPage />
      </VadWrapper>
    </DataWrapper>
  );
}

function RoomIdGate({ children }: { children: React.ReactNode }) {
  const { roomId } = useParams();
  if (!roomId || RESERVED_PATHS.has(roomId)) {
    return <NotFoundPage />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <ReduxProvider>
        <Routes>
          <Route path="/" element={<CreateMeetingPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/temp" element={<TempPage />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/test" element={<Leave />} />
          <Route
            path="/:roomId"
            element={
              <RoomIdGate>
                <MeetingRoute />
              </RoomIdGate>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ReduxProvider>
    </Router>
  );
}
