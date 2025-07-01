
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/store/store"
import { setNVclosecall, setNVaudioUploadAnimation } from "@/reducers/navigationparamReducer"
import { useData } from "../context/DataWrapper"
import MeetingPageHeaderTimer from "./MeetingPageHeaderTimer"
import DraggableLiveTranscription from "./DraggableLiveTranscript"
import { useVad } from "../context/VadWrapper"
import rectLoading from "../assets/reactangle-loading.gif"
import playSound from "../assets/sound-play.gif"
import useNetworkMonitor from "./SpeedTestComponent"

export default function MeetingPageHeader() {
  const { statuss, downloadSpeed } = useNetworkMonitor()
  console.log("Speed", downloadSpeed)
  // const statuss="stable"

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
    connStatus,
  }: any = useData()

  const {
    vadRecordingOn,
    setVadRecordingOn,
    manualVadStatus,
    setManualVadStatus,
    vadStatus,
    setVadStatus,
    vadInstance,
    VAD2,
    userSpeaking,
  }: any = useVad()

  useEffect(() => {
    console.log(connStatus)
  }, [connStatus])

  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [vadLoadingDelayExceeded, setVadLoadingDelayExceeded] = useState(false)

  const title = interviewMetaRef.current?.title

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!VAD2 || VAD2.loading) {
      timer = setTimeout(() => setVadLoadingDelayExceeded(true), 5000)
    } else {
      setVadLoadingDelayExceeded(false)
    }
    return () => clearTimeout(timer)
  }, [VAD2])

  const handleCloseCall = async () => {
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

  const toggleAudio = () => {
    setMicroPhoneToggle((p: boolean) => !p)
    setManualVadStatus((p) => !p)
    console.log("toggling the audio...")
  }

  const toggleVideo = () => setCameraToggle((p: boolean) => !p)
  const toggleScreenRecording = () => setScreenRecording((p: boolean) => !p)
  const toggleChatWindow = () => {
    setChatToggle(true)
    if (!chatToggle) setUnreadCount(0)
  }

  const toggleLive = () => {
    setTranscriptionToggle((prev: boolean) => !prev)
    setTranscriptionIndicator(0)
    console.log("Live Speech To Text")
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "5rem",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
          }}
        >
          {VAD2 !== undefined && !VAD2.loading ? (
            <h3
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: "1.2rem",
                color: "green",
                textTransform: "capitalize",
                display: "flex",
                alignItems: "center",
              }}
            >
              VAD files loaded ✅
            </h3>
          ) : (
            <>
              <h3
                style={{
                  margin: 0,
                  marginRight: "0.5rem",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  color: "red",
                  textTransform: "capitalize",
                }}
              >
                VAD is loading...
              </h3>
              <img src={rectLoading || "/placeholder.svg"} style={{ height: "1.8rem", width: "1.8rem" }} />
            </>
          )}
        </div>
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
            visibility: "hidden",
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
          {/* Video Button */}
          <button
            className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
            onClick={toggleVideo}
          >
            {cameraToggle ? <i className="fa-solid fa-video fa-lg" /> : <i className="fa-solid fa-video-slash fa-lg" />}
          </button>

          {/* Mic Button with VAD Spinner */}
          <button
            className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700 relative"
            onClick={toggleAudio}
            disabled={!VAD2 || VAD2.loading}
            title={!VAD2 || VAD2.loading ? "VAD loading..." : ""}
          >
            {!VAD2 || VAD2.loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600 mx-auto" />
            ) : microphoneToggle ? (
              <i className="fa-solid fa-microphone fa-lg" />
            ) : (
              <i className="fa-solid fa-microphone-slash fa-lg" />
            )}
            {vadLoadingDelayExceeded && (!VAD2 || VAD2.loading) && (
              <span className="absolute text-[10px] text-red-500 top-full mt-1 left-1/2 -translate-x-1/2">
                VAD taking too long...
              </span>
            )}
          </button>

          {/* Screen Record */}
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

          {/* Chat Button */}
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
                    chatToggle ? "bg-red-500 animate-pulse" : "bg-red-600 animate-bounce"
                  }`}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Live Transcription */}
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

          {/* Network Quality */}
          <div
            className="py-3 px-4 bg-neutral-200 rounded-lg flex items-center space-x-2"
            title={`Network: ${connStatus} | Speed: ${downloadSpeed ? `${downloadSpeed.toFixed(2)} Mbps` : "Testing..."}`}
          >
            <i
              className={`fa-solid fa-signal ${
                statuss === "stable" ? "text-green-500" : connStatus === "unstable" ? "text-yellow-500" : "text-red-500"
              }`}
            />
            <span className={`text-sm ${connStatus === "critical" ? "font-bold text-red-600 animate-pulse" : ""}`}>
              {connStatus.charAt(0).toUpperCase() + connStatus.slice(1)}
            </span>
          </div>

          {/* Sound Animation */}
          <div
            style={{
              height: "3.5rem",
              width: "6rem",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {(userSpeaking || (VAD2?.userSpeaking && microphoneToggle)) && (
              <img src={playSound || "/placeholder.svg"} style={{ width: "6rem", height: "3.5rem" }} />
            )}
          </div>

          <div className="h-8 w-[2px] bg-neutral-200" />

          {/* End Call */}
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
