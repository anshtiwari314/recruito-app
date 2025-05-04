import type React from "react"
import { createContext, useContext, useEffect, useState, useRef, useMemo } from "react"
import { startMediaRecorder2 } from "../functions/mettingUtils3"
import { useSocketWrapper } from "./SocketWrapper"
import { useAppSelector } from "../store/store"
import { useDispatch } from "react-redux"
import { getTimestamp } from "../functions/mettingsUtils"
import { processAudioToBase64 } from "../functions/mettingUtils2"
import { useMicVAD } from "@ricky0123/vad-react"
// import vad from "voice-activity-detection"

const VadWrapperContext = createContext<any>(null)

export function useVadWrapper() {
  const ctx = useContext(VadWrapperContext)
  if (!ctx) {
    throw new Error("useVadWrapper must be used within a VadWrapper provider")
  }
  return ctx
}

export default function VadWrapper({ children }: { children: React.ReactNode }) {
  console.log("VadWrapper rendering")

  const dispatch = useDispatch()
  const { isSocket1_Connected, socket1_emitEvent }: any = useSocketWrapper()

  // Use selector with specific state slices to prevent re-renders on unrelated state changes
  const users = useAppSelector((state) => state.usersReducer)
  const myState = useAppSelector((state) => state.myStateReducer)
  const { isHost } = useAppSelector((state) => state.qpReducer)

  // Fix: Use individual state variables instead of grouped state
  const [vadRecordingOn, setVadRecordingOn] = useState(false)
  const [cueLoading, setCueLoading] = useState(false)
  const [userSpeaking, setUserSpeaking] = useState(false)
  const [vadStatus, setVadStatus] = useState(false)
  const [manualVadStatus, setManualVadStatus] = useState(true)
  const [vadInitialized, setVadInitialized] = useState(false)

  const [adminUrl] = useState(`https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/recruiter-copilot`)
  const [vadInstance, setVadInstance] = useState<any>(null)

  const recordingStatus = useRef(false)
  const vadRef = useRef<any>({
    oldVadrecordingStatus: false,
    myVad: null,
  })
  const globalStreamRef = useRef<any>(null)
  const vadOptionsRef = useRef({
    positiveSpeechThreshold: 0.9,
    negativeSpeechThreshold: 0.85,
  })

  function handleSpeechStart() {
    console.log(`%c Speech started ${new Date().toLocaleTimeString()}`, "background-color:teal;color:white")
    setUserSpeaking(true)
    if (isSocket1_Connected) {
      socket1_emitEvent("cue-loading-transmitter", { toggle: true })
    }
  }

  async function handleSpeechEnd(audio: Blob) {
    console.log(`%c Speech ended ${new Date().toLocaleTimeString()}`, "background-color:teal;color:white")
    setUserSpeaking(false)
    setVadStatus(false)
    setCueLoading(true)

    if (!audio || !myState) {
      console.warn("No audio or no state, skipping upload.")
      setCueLoading(false)
      return
    }

    const payload = {
      sessionid: myState.id,
      userid: myState.id,
    }

    try {
      const result = await processAudioToBase64(audio, adminUrl, payload)
      console.log("Upload success:", result)
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setCueLoading(false)
    }
  }

  // Fix: Check if files exist before initializing VAD
  useEffect(() => {
    // Check if the worklet and model files exist
    const checkFiles = async () => {
      try {
        const workletResponse = await fetch("/vad.worklet.bundle.min.js", { method: "HEAD" })
        const modelResponse = await fetch("/silero_vad.onnx", { method: "HEAD" })

        if (!workletResponse.ok) {
          console.error("VAD worklet file not found. Status:", workletResponse.status)
        }

        if (!modelResponse.ok) {
          console.error("VAD model file not found. Status:", modelResponse.status)
        }

        return workletResponse.ok && modelResponse.ok
      } catch (error) {
        console.error("Error checking VAD files:", error)
        return false
      }
    }

    checkFiles().then((filesExist) => {
      console.log("VAD files exist:", filesExist)
    })
  }, [])

  // Fix: Use the updated API for newer versions of @ricky0123/vad-react
  const vad = useMicVAD({
    onSpeechStart: handleSpeechStart,
    onSpeechEnd: handleSpeechEnd,
    onVADMisfire: () => {
      console.log("VAD misfire detected")
    },
    // These are the options for the newer version of the library
    throttleTime: 0,
    minSpeechFrames: 5,
    redemptionFrames: 30,
    preSpeechPadFrames: 10,
    // Specify the model and worklet URLs
    modelUrl: "/silero_vad.onnx",
    workletUrl: "/vad.worklet.bundle.min.js",
  })

  // Initialize VAD instance only once
  useEffect(() => {
    if (vadInstance !== null) return

    let isMounted = true

    const intervalId = setInterval(() => {
      // Try to initialize VAD using window.vad if available
      if (typeof window !== "undefined" && window.vad) {
        try {
          window.vad.MicVAD.new({
            onSpeechStart: handleSpeechStart,
            onSpeechEnd: handleSpeechEnd,
            positiveSpeechThreshold: 0.9,
            negativeSpeechThreshold: 0.85,
          }).then((myVad: any) => {
            if (!isMounted) return
            if (myVad === null) return

            vadRef.current.myVad = myVad
            setVadInstance(myVad)
            setVadInitialized(true)
            clearInterval(intervalId)
          })
        } catch (error) {
          console.error("Failed to initialize window.vad:", error)
        }
      } else {
        console.log("window.vad not available, using hook-based VAD")
        clearInterval(intervalId)
      }
    }, 1000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  // Control VAD instance based on vadStatus
  useEffect(() => {
    if (vadInstance === null) return

    if (vadStatus) {
      try {
        vadInstance?.start()
        console.log("VAD started", vadInstance)
      } catch (err) {
        console.error("Error starting VAD:", err)
      }
    } else {
      try {
        vadInstance?.pause()
        console.log("VAD paused", vadInstance)
      } catch (err) {
        console.error("Error pausing VAD:", err)
      }
    }
  }, [vadStatus, vadInstance])

  // Control hook-based VAD based on manualVadStatus
  useEffect(() => {
    // Add detailed logging to diagnose the issue
    console.log("VAD state:", {
      vad,
      listening: vad?.listening,
      errored: vad?.errored,
      loading: vad?.loading,
    })

    if (!vad) {
      console.warn("VAD is null or undefined - initialization may have failed")
      return
    }

    try {
      if (manualVadStatus) {
        console.log("Starting VAD")
        vad.start()
        console.log("VAD started successfully")
      } else {
        console.log("Pausing VAD")
        vad.pause()
        console.log("VAD paused successfully")
      }
    } catch (err) {
      console.error("Error controlling VAD:", err)
    }
  }, [manualVadStatus, vad])

  // Handle recording based on vadRecordingOn
  useEffect(() => {
    recordingStatus.current = vadRecordingOn

    let id: any = null

    if (vadRecordingOn && myState?.id) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const args = {
            stream,
            url: adminUrl,
            time: 10000,
            recordingStatus,
            userid: myState.id,
            sessionid: myState.id,
            timeStamp: getTimestamp(),
          }

          startMediaRecorder2(args)
          setCueLoading(true)

          id = setInterval(() => {
            startMediaRecorder2(args)
            setCueLoading(true)
          }, 10000)
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err)
        })
    }

    return () => {
      if (id) clearInterval(id)
    }
  }, [vadRecordingOn, adminUrl, myState?.id])

  // Handle VAD recording
  useEffect(() => {
    let tempVad: any = null
    let id: any = null
    let timer: any = null

    if (vadRecordingOn) {
      console.log(`%c vad triggered ${new Date().toLocaleTimeString()}`, "background-color:teal;color:white")

      timer = setTimeout(() => {
        if (tempVad) {
          try {
            tempVad.pause()
          } catch (err) {
            console.error("Error pausing VAD:", err)
          }
        }
        tempVad = undefined
        setVadRecordingOn(false)
      }, 5000)

      function start() {
        if (timer) clearTimeout(timer)
        if (id) clearTimeout(id)
        id = undefined
      }

      function stop() {
        if (tempVad) {
          try {
            tempVad.pause()
          } catch (err) {
            console.error("Error pausing VAD:", err)
          }
        }
        tempVad = undefined
        setVadRecordingOn(false)
      }

      // Try to use window.vad if available
      if (typeof window !== "undefined" && window.vad) {
        window.vad.MicVAD.new({
          onSpeechStart: start,
          onSpeechEnd: stop,
          positiveSpeechThreshold: 0.9,
          negativeSpeechThreshold: 0.85,
        })
          .then((vad: any) => {
            if (!vad) return
            tempVad = vad
            try {
              vad.start()
            } catch (err) {
              console.error("Error starting VAD:", err)
            }
          })
          .catch((err) => {
            console.error("Error initializing VAD:", err)
          })
      } else {
        // Use the hook-based VAD as fallback
        console.log("Using hook-based VAD as fallback")
        if (vad) {
          vad.start()
        }
      }
    }

    return () => {
      if (tempVad) {
        try {
          tempVad.pause()
        } catch (err) {
          console.error("Error cleaning up VAD:", err)
        }
      }
      tempVad = undefined
      if (id) clearInterval(id)
      if (timer) clearInterval(timer)
    }
  }, [vadRecordingOn, vad])

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(
    () => ({
      vadRecordingOn,
      setVadRecordingOn,
      userSpeaking,
      cueLoading,
      setCueLoading,
      vadStatus,
      setVadStatus,
      manualVadStatus,
      setManualVadStatus,
      vad,
      vadInitialized,
    }),
    [vadRecordingOn, userSpeaking, cueLoading, vadStatus, manualVadStatus, vad, vadInitialized],
  )

  return <VadWrapperContext.Provider value={contextValue}>{children}</VadWrapperContext.Provider>
}
