"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/store/store"
import { setNVclosecall, setNVaudioUploadAnimation } from "@/reducers/navigationparamReducer"
import { useData } from "../context/DataWrapper"
import MeetingPageHeaderTimer from "./MeetingPageHeaderTimer"
import DraggableLiveTranscription from "./DraggableLiveTranscript"

export default function MeetingPageHeader() {
  const dispatch = useDispatch()
  const { jobTitle } = useAppSelector((state) => state.cuesReducer)
  const { isHost } = useAppSelector((state) => state.qpReducer)

  const {
    name,
    cameraToggle,
    setCameraToggle,
    microphoneToggle,
    setMicroPhoneToggle,
    setScreenSharing,
    stopVideoRecording,
    chatToggle,
    setChatToggle,
    screenRecording,
    setScreenRecording,
    ngrokServerUrl,
    setNgrokServerUrl,
    interviewMetaRef,
    unreadCount,
    setUnreadCount,
    transcriptionToggle,
    setTranscriptionToggle,
    transcriptionIndicator,
    setTranscriptionIndicator,
  }: any = useData()

  const title = interviewMetaRef.current?.title

  async function handleCloseCall() {
    const confirmQuit = window.confirm("Are you sure you want to quit?")
    if (confirmQuit) {
      sessionStorage.setItem("exitdone", "true")
      setMicroPhoneToggle(false)
      setCameraToggle(false)
      dispatch(setNVclosecall(true))
      dispatch(setNVaudioUploadAnimation(true))
      console.log("Closing the call...")
    }
  }

  const toggleAudio = () => setMicroPhoneToggle((p: boolean) => !p)
  const toggleVideo = () => setCameraToggle((p: boolean) => !p)
  const toggleScreenRecording = () => setScreenRecording((p: boolean) => !p)
  const toggleChatWindow = () => {
    setChatToggle(true)
    console.log(unreadCount)
    // Reset unread count when opening chat
    if (!chatToggle) {
      setUnreadCount(0)
    }
  }
  const toggleLive = () => {
    setTranscriptionToggle((prev: boolean) => !prev)
    setTranscriptionIndicator(0)
    console.log("Live Speech To Text")
  }

  // False state for quality menu
  const [showQualityMenu, setShowQualityMenu] = useState(false)

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <input
          type="text"
          placeholder="Enter your ngrok url"
          value={ngrokServerUrl}
          onChange={(e) => setNgrokServerUrl(e.target.value)}
          style={{
            width: "60%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "border-color 0.3s",
          }}
        />
      </div>

      <header
        id="header"
        className="w-full bg-white border-b border-neutral-200 px-4 py-1 flex place-items-center justify-between shadow-sm"
        style={{ height: "10vh" }}
      >
        <div className="flex place-items-center space-x-4">
          <div className="h-8 w-[2px] bg-neutral-200" />
          <img src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=Logo" className="h-8" alt="Logo" />

          {title ? (
            <div className="text-md text-neutral-500">
              <div className="text-neutral-600 z-index-[9999] space-around-12px">
                {title?.key}:{title?.value}
              </div>
              <div style={{ textTransform: "capitalize" }}>{name}</div>
            </div>
          ) : (
            <div className="text-md text-neutral-500">Recruiter Copilot</div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
            onClick={toggleVideo}
          >
            {cameraToggle ? <i className="fa-solid fa-video fa-lg" /> : <i className="fa-solid fa-video-slash fa-lg" />}
          </button>
          <button
            className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
            onClick={toggleAudio}
          >
            {microphoneToggle ? (
              <i className="fa-solid fa-microphone fa-lg" />
            ) : (
              <i className="fa-solid fa-microphone-slash fa-lg" />
            )}
          </button>
          <button
            className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
            onClick={toggleScreenRecording}
          >
            {screenRecording ? (
              <i className="fa-solid fa-circle-dot fa-lg text-red-500 animate-pulse" />
            ) : (
              <i className="fa-solid fa-circle-dot fa-lg text-gray-500" />
            )}
          </button>
          <div className="relative">
            <button
              className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700 relative"
              onClick={toggleChatWindow}
            >
              {chatToggle ? (
                <i className="fas fa-comment text-black-500 fa-lg" />
              ) : (
                <i className="far fa-comment text-black-500 fa-lg" />
              )}

            
              {unreadCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-md border border-white z-10 ${
                    chatToggle
                      ? "bg-red-500 animate-pulse"
                      : "bg-red-600 animate-bounce"
                  }`}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>

          {isHost && (
            <div className="relative">
              <button
                className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700 relative"
                onClick={toggleLive}
              >
                {transcriptionToggle ? (
                  <i className="fas fa-closed-captioning text-black-500 fa-lg" />
                ) : (
                  <i className="far fa-closed-captioning text-black-500 fa-lg" />
                )}

                {transcriptionIndicator > 0 && !transcriptionToggle && (
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white z-10 shadow-md animate-pulse blur-[0.5px] scale-[1.1]" />
                )}
              </button>
            </div>
          )}

          <div className="relative">
            <button
              className="py-3 px-4 bg-neutral-200 hover:bg-neutral-300 rounded-lg flex items-center space-x-2"
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              title="Network Quality"
            >
              <i className="fa-solid fa-signal text-green-500" />
              <span className="text-sm">Quality</span>
            </button>

            {showQualityMenu && (
              <div className="absolute top-full mt-2 right-0 z-50 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 min-w-[150px]">
                <div className="px-3 py-1 text-xs text-neutral-500 border-b border-neutral-200 mb-2">
                  Quality Settings
                </div>

                <button className="w-full text-left px-3 py-2 hover:bg-neutral-100 text-sm">
                  <i className="fa-solid fa-signal text-green-500 mr-2" />
                  HD Quality
                </button>

                <button className="w-full text-left px-3 py-2 hover:bg-neutral-100 text-sm">
                  <i className="fa-solid fa-signal text-yellow-500 mr-2" />
                  SD Quality
                </button>

                <button className="w-full text-left px-3 py-2 hover:bg-neutral-100 text-sm">
                  <i className="fa-solid fa-signal text-orange-500 mr-2" />
                  Low Quality
                </button>

                <button className="w-full text-left px-3 py-2 hover:bg-neutral-100 text-sm">
                  <i className="fa-solid fa-signal text-red-500 mr-2" />
                  Audio Only
                </button>
              </div>
            )}
          </div>

          <div className="h-8 w-[2px] bg-neutral-200" />

          <button
            className="px-8 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg flex items-center text-lg"
            onClick={handleCloseCall}
          >
            <i className="fa-solid fa-xmark mr-4 fa-lg" />
            End Call
          </button>
        </div>

        {isHost && <MeetingPageHeaderTimer />}
      </header>
      {isHost && <DraggableLiveTranscription />}
    </>
  )
}
