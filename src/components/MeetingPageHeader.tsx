import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/store";
import {
  setNVclosecall,
  setNVaudioUploadAnimation,
} from "@/reducers/navigationparamReducer";
import { useData } from "../context/DataWrapper";
import MeetingPageHeaderTimer from "./MeetingPageHeaderTimer";
import playSound from "../assets/sound-play.gif";
import { useVad } from "../context/VadWrapper";
import { TailSpin } from "react-loading-icons";
import rectLoading from "../assets/reactangle-loading.gif";
import { APP_NAME } from "@/constants/app";

export function CameraIcon() {
  //@ts-ignore
  const { myStream, cameraToggle, setCameraToggle, enableDisabledCamera } =
    useData();

  const toggleVideo = () => {
    setCameraToggle((p: boolean) => !p);
  };

  if (myStream === false || myStream === null) {
    return (
      <button
        type="button"
        className="control-btn control-btn--danger"
        onClick={enableDisabledCamera}
        title="Enable camera"
      >
        <i className="fa-solid fa-video-slash" />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`control-btn ${cameraToggle ? "" : "control-btn--danger"}`}
      onClick={toggleVideo}
      title={cameraToggle ? "Turn off camera" : "Turn on camera"}
    >
      {cameraToggle ? (
        <i className="fa-solid fa-video" />
      ) : (
        <i className="fa-solid fa-video-slash" />
      )}
    </button>
  );
}

export function MicIcon() {
  const {
    setManualVadStatus,
    VAD2,
  } = useVad();

  //@ts-ignore
  const {
    myAudioStream,
    microphoneToggle,
    setMicroPhoneToggle,
    enableDisabledMicrophone,
  } = useData();

  const toggleAudio = () => {
    setMicroPhoneToggle((p: boolean) => !p);
    setManualVadStatus((p) => !p);
  };

  if (myAudioStream === false || myAudioStream === null) {
    return (
      <button
        type="button"
        className="control-btn control-btn--danger"
        onClick={enableDisabledMicrophone}
        title="Enable microphone"
      >
        <i className="fa-solid fa-microphone-slash" />
      </button>
    );
  }

  if (VAD2 !== undefined && !VAD2.loading) {
    return (
      <button
        type="button"
        className={`control-btn ${microphoneToggle ? "" : "control-btn--danger"}`}
        onClick={toggleAudio}
        title={microphoneToggle ? "Mute" : "Unmute"}
      >
        {microphoneToggle ? (
          <i className="fa-solid fa-microphone" />
        ) : (
          <i className="fa-solid fa-microphone-slash" />
        )}
      </button>
    );
  }

  return (
    <div className="control-btn !border-transparent">
      <TailSpin stroke="#818cf8" strokeOpacity={1} speed={0.95} />
    </div>
  );
}

export default function MeetingPageHeader() {
  const dispatch = useDispatch();
  const { jobTitle } = useAppSelector((state) => state.cuesReducer);
  const { isHost, roomId } = useAppSelector((state) => state.qpReducer);
  const { VAD2, userSpeaking } = useVad();

  //@ts-ignore
  const {
    name,
    setCameraToggle,
    setMicroPhoneToggle,
    microphoneToggle,
    setUnreadCount,
    unreadCount,
    chatToggle,
    setChatToggle,
    screenRecording,
    setScreenRecording,
    ngrokServerUrl,
    setNgrokServerUrl,
  }: any = useData();

  const [showDevSettings, setShowDevSettings] = useState(false);

  async function handleCloseCall() {
    const confirmQuit = window.confirm("Are you sure you want to quit?");
    if (confirmQuit) {
      sessionStorage.setItem("exitdone", "true");
      setMicroPhoneToggle(false);
      setCameraToggle(false);
      dispatch(setNVclosecall(true));
      dispatch(setNVaudioUploadAnimation(true));
    }
  }

  const toggleScreenRecording = () => {
    setScreenRecording((p: boolean) => !p);
  };

  const toggleChatWindow = () => {
    setChatToggle(true);
    if (!chatToggle) {
      setUnreadCount(0);
    }
  };

  return (
    <header
      id="header"
      className="shrink-0 meeting-glass"
      style={{ borderBottom: "1px solid var(--meeting-border)" }}
    >
      {showDevSettings && (
        <div
          className="px-3 sm:px-4 py-2 flex flex-wrap items-center gap-3"
          style={{
            borderBottom: "1px solid var(--meeting-border)",
            background: "var(--meeting-bg)",
          }}
        >
          <div className="flex items-center gap-2 text-xs">
            {VAD2 !== undefined && !VAD2.loading ? (
              <span style={{ color: "var(--meeting-success)" }} className="font-medium">
                VAD loaded
              </span>
            ) : (
              <>
                <span className="font-medium" style={{ color: "#fbbf24" }}>
                  VAD loading
                </span>
                <img src={rectLoading} alt="" className="h-4 w-4" />
              </>
            )}
          </div>
          <input
            type="text"
            placeholder="Ngrok server URL"
            value={ngrokServerUrl}
            onChange={(e) => setNgrokServerUrl(e.target.value)}
            className="landing-input flex-1 min-w-[200px] !py-1.5 !text-xs"
          />
        </div>
      )}

      <div className="meeting-header-row px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="app-brand-icon">
            <i className="fa-solid fa-video text-xs" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="app-brand-title truncate">
              {jobTitle || APP_NAME}
            </h1>
            <p className="app-brand-subtitle capitalize truncate">
              {name}
              {roomId ? (
                <span className="hidden sm:inline"> · {roomId}</span>
              ) : null}
            </p>
          </div>
        </div>

        {isHost && (
          <div className="hidden xl:block shrink-0">
            <MeetingPageHeaderTimer />
          </div>
        )}

        <div className="meeting-header-controls w-full sm:w-auto">
          {(userSpeaking || (VAD2?.userSpeaking && microphoneToggle)) && (
            <div
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
              style={{
                background: "rgba(74, 222, 128, 0.12)",
                border: "1px solid rgba(74, 222, 128, 0.28)",
                color: "var(--meeting-success)",
              }}
            >
              <img src={playSound} alt="" className="h-5 w-8 object-contain" />
              Speaking
            </div>
          )}

          <CameraIcon />
          <MicIcon />

          <button
            type="button"
            className={`control-btn ${screenRecording ? "control-btn--danger" : ""}`}
            onClick={toggleScreenRecording}
            title={screenRecording ? "Stop recording" : "Start recording"}
          >
            <i
              className={`fa-solid fa-circle-dot ${screenRecording ? "animate-pulse" : ""}`}
              style={{ color: screenRecording ? "var(--meeting-danger)" : "var(--meeting-text-muted)" }}
            />
          </button>

          <div className="relative">
            <button
              type="button"
              className={`control-btn ${chatToggle ? "control-btn--active" : ""}`}
              onClick={toggleChatWindow}
              title="Chat"
            >
              <i className={`${chatToggle ? "fas" : "far"} fa-comment`} />
            </button>
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center z-10"
                style={{ background: "var(--meeting-danger)", border: "2px solid var(--meeting-bg)" }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          <button
            type="button"
            className={`control-btn hidden sm:inline-flex ${showDevSettings ? "control-btn--active" : ""}`}
            onClick={() => setShowDevSettings((p) => !p)}
            title="Developer settings"
          >
            <i className="fa-solid fa-gear" />
          </button>

          <button
            type="button"
            className="px-3 sm:px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2 transition-colors"
            style={{ background: "#dc2626" }}
            onClick={handleCloseCall}
          >
            <i className="fa-solid fa-phone-slash text-xs" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>

      {isHost && (
        <div className="xl:hidden px-3 sm:px-4 pb-2.5">
          <MeetingPageHeaderTimer />
        </div>
      )}
    </header>
  );
}
