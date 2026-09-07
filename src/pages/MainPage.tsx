import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useData } from "@/context/DataWrapper";
import { v4 as uuidv4 } from "uuid";
import ContentPanel from "@/components/ContentPanel";
import type { QPState } from "@/reducers/queryparamReducer";
import { setQP } from "@/reducers/queryparamReducer";
import { useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import RightPanel from "@/components/RightPanel";
import NotFound from "./NotFoundPage";
import Leave from "./LeavePage";
import MeetingPageHeader from "../components/MeetingPageHeader";
import {
  getParticipantName,
  isRoomAdmin,
  isValidParticipantName,
  normalizeParticipantName,
  setParticipantName,
} from "@/utils/meetingStorage";
import "@/styles/meeting.css";

export default function MainPage() {
  //@ts-ignore
  const { setMyId, setName } = useData();
  const { closeCall } = useAppSelector((state) => state.nvReducer);
  const { roomId: roomIdFromStore } = useAppSelector(
    (state) => state.qpReducer
  );

  const dispatch = useDispatch();
  const { roomId: roomIdParam } = useParams<{ roomId: string }>();
  const [meetingIsLegitMain, setMeetingIsLegitMain] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");
  const [pendingJoin, setPendingJoin] = useState(false);

  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const roomId = roomIdParam?.trim() ?? "";

    if (sessionStorage.getItem("exitdone") !== null) {
      setMeetingIsLegitMain(false);
      setInitialized(true);
      return;
    }

    if (!roomId) {
      setMeetingIsLegitMain(false);
      setInitialized(true);
      return;
    }

    const savedName = getParticipantName();
    if (savedName) {
      setNameInput(savedName);
      setPendingJoin(false);
    } else {
      setPendingJoin(true);
    }

    setInitialized(true);
  }, [roomIdParam]);

  useEffect(() => {
    if (!initialized || pendingJoin || !meetingIsLegitMain) return;

    const roomId = roomIdParam?.trim() ?? "";
    if (!roomId) return;

    const displayName = normalizeParticipantName(
      getParticipantName() || nameInput
    );
    if (!isValidParticipantName(displayName)) return;

    const isHost = isRoomAdmin(roomId);

    setName(displayName);
    setParticipantName(displayName);

    const qParams: QPState = {
      roomId,
      jobId: uuidv4(),
      custEmailId: uuidv4(),
      agentId: uuidv4(),
      isHost,
      name: displayName,
      meetingIsLegit: true,
    };

    dispatch(setQP(qParams));
    setMyId(uuidv4());
  }, [
    initialized,
    pendingJoin,
    meetingIsLegitMain,
    roomIdParam,
    nameInput,
    dispatch,
    setMyId,
    setName,
  ]);

  useEffect(() => {
    function executeBeforeTabClose(e: BeforeUnloadEvent) {
      e.preventDefault();
      if ("returnValue" in e) {
        e.returnValue = "";
      }
      return "";
    }

    window.addEventListener("beforeunload", executeBeforeTabClose);
    return () => window.removeEventListener("beforeunload", executeBeforeTabClose);
  }, []);

  const handleJoinWithName = () => {
    const displayName = normalizeParticipantName(nameInput);
    if (!isValidParticipantName(displayName)) {
      setNameError("Enter your name (2–40 characters).");
      return;
    }

    setNameError("");
    setParticipantName(displayName);
    setPendingJoin(false);
  };

  if (!initialized) {
    return (
      <div className="meeting-shell h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-2 rounded-full animate-spin"
            style={{
              borderColor: "var(--meeting-accent-soft)",
              borderTopColor: "var(--meeting-accent)",
            }}
          />
          <p className="text-sm landing-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  if (pendingJoin && meetingIsLegitMain && roomIdParam?.trim()) {
    return (
      <div className="meeting-shell h-[100dvh] flex items-center justify-center p-4">
        <div className="landing-card landing-card--elevated w-full max-w-md p-6 sm:p-8">
          <h1 className="landing-title text-xl sm:text-2xl font-semibold mb-2">
            Join meeting
          </h1>
          <p className="landing-subtitle text-sm mb-6">
            Enter your name before joining room{" "}
            <span className="text-slate-300">{roomIdParam.trim()}</span>
          </p>

          <label className="landing-label text-sm font-medium block mb-2">
            Your name
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              setNameError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleJoinWithName()}
            placeholder="e.g. Alex Johnson"
            className="landing-input mb-4"
            autoFocus
          />

          {nameError ? (
            <p className="landing-error text-sm mb-4">{nameError}</p>
          ) : null}

          <button
            type="button"
            onClick={handleJoinWithName}
            className="landing-btn-primary w-full py-2.5 px-4"
          >
            Continue to meeting
          </button>
        </div>
      </div>
    );
  }

  if (
    !pendingJoin &&
    meetingIsLegitMain &&
    roomIdParam?.trim() &&
    !roomIdFromStore
  ) {
    return (
      <div className="meeting-shell h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-2 rounded-full animate-spin"
            style={{
              borderColor: "var(--meeting-accent-soft)",
              borderTopColor: "var(--meeting-accent)",
            }}
          />
          <p className="text-sm landing-subtitle">Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {meetingIsLegitMain && roomIdFromStore ? (
        closeCall ? (
          <Leave />
        ) : (
          <div className="meeting-shell h-[100dvh] w-screen flex flex-col overflow-hidden">
            <MeetingPageHeader />
            <main id="main-content" className="meeting-main">
              <div
                id="content-panel"
                className="meeting-content p-2 sm:p-3 lg:p-4"
              >
                <ContentPanel isMobile={isMobile} />
              </div>
              <div
                className={`meeting-sidebar${
                  sidebarCollapsed ? " meeting-sidebar--collapsed" : ""
                }`}
              >
                <RightPanel
                  isMobile={isMobile}
                  onCollapsedChange={setSidebarCollapsed}
                />
              </div>
            </main>
          </div>
        )
      ) : (
        <NotFound />
      )}
    </>
  );
}
