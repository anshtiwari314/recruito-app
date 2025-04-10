import React,{useRef,useEffect, useState} from "react"
import { getUserAudioStream, getUserVideoStream, logAllStreams } from "../functions/userStream"
import { useData } from "../context/DataWrapper"
import { useTestWrapper } from "../context/TestWrapper"

export function RightPanelVideo({e,muted}:{e:any,muted:boolean}) {
  console.log("RightPanelVideo props:", e)
  const [hasLoggedStreams, setHasLoggedStreams] = useState(false)
  const vidRef = useRef<any>(null)
  // const val=useTestWrapper()
  // console.log(val); for testing in UI 

  const videoStream = e?.id ? getUserVideoStream(e.id) : null
  const audioStream = e?.id ? getUserAudioStream(e.id) : null

  console.log("Stream from the magement sys:",{
    id:e?.id,
    videoStream:videoStream?"YES":"NO",
    audioStream:audioStream?"YES":"NO",
  });
  

  useEffect(() => {
    if (!hasLoggedStreams) {
      console.log("Logging all streams from RightPanelVideo:")
      logAllStreams()
      setHasLoggedStreams(true)
    }
  }, [hasLoggedStreams])

  useEffect(() => {
    const vid = vidRef.current
    if (!vid || !e?.id) return

console.log(`Setting up video for user ${e.id}, camera available: ${e.isCameraAvailable}, stream:`, 
      videoStream ? "Present" : "null")

   if (vid.srcObject) {
      vid.srcObject = null
    }

    if (videoStream instanceof MediaStream && e.isCameraAvailable) {
      console.log(`Setting srcObject for video element of user ${e.id}`)
      vid.srcObject = videoStream
   
      function onLoaded() {
        console.log(`Video loaded for user ${e.id}, playing...`)
        vid.play().catch((err) => console.error("Error playing video:", err))
      }

      vid.addEventListener("loadedmetadata", onLoaded)

      return () => {
        vid.removeEventListener("loadedmetadata", onLoaded)
      }
    } else {
      console.log(`No valid video stream for user ${e.id} or camera not available`)
      // Clear the video element if there's no stream
      if (vid.srcObject) {
        vid.srcObject = null
      }
    }
  }, [videoStream, e?.id, e?.isCameraAvailable])

  useEffect(() => {
    if (!e?.id || !audioStream) return

    console.log(`Setting up audio for user ${e.id}, mic available: ${e.isMicrophoneAvailable}, stream:`, audioStream)

    if (audioStream instanceof MediaStream && e.isMicrophoneAvailable) {
      console.log(`Creating audio element for user ${e.id}`)
      const audio = new Audio()
      audio.srcObject = audioStream
      audio.muted = muted

      const playAudio = () => {
        console.log(`Audio loaded for user ${e.id}, playing...`)
        audio.play().catch((err) => console.error("Error playing audio:", err))
      }

      audio.addEventListener("canplaythrough", playAudio)

      return () => {
        audio.removeEventListener("canplaythrough", playAudio)
        audio.pause()
        audio.srcObject = null
      }
    } else {
      console.log(`No valid audio stream for user ${e.id} or microphone not available`)
    }
  }, [audioStream, e?.id, e?.isMicrophoneAvailable, muted])

  function getMicIcon() {
    if (!e?.isMicrophoneAvailable) return null
    if (e?.microphoneStatus === false)
      return <i className="fa-solid fa-microphone-slash bg-black/50 text-white p-1 rounded"></i>
    else return <i className="fa-solid fa-microphone bg-black/50 text-white p-1 rounded"></i>
  }

  function getVideoIcon() {
    if (!e?.isCameraAvailable) return null
    if (e?.cameraStatus === false) {
      return <i className="fa-solid fa-video-slash bg-black/50 text-white p-1 rounded"></i>
    } else {
      return <i className="fa-solid fa-video bg-black/50 text-white p-1 rounded"></i>
    }
  }
    return (
          <>
            <div className="relative">
              <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
                <video
                  ref={vidRef}
                  
                  className="w-full h-full object-cover"
                ></video>
                <video />
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-sm bg-black/50 text-white px-2 py-1 rounded" style={{textTransform:'capitalize'}}>
                  {e?.name}
                </span>
                <div className="flex space-x-1">
                  {getMicIcon()}
                  {/* <i className="fa-solid fa-microphone-slash bg-black/50 text-white p-1 rounded"></i> */}
                  {getVideoIcon()}

                </div>
              </div>
            </div>
          </>  
    )
  }