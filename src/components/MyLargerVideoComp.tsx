import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FaVideoSlash } from "react-icons/fa"
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons"
import { useData } from "../context/DataWrapper"

function getColorFromInitial(initial: string) {
  const colors: Record<string, string> = {
    A: "#E27D60", B: "#92A8D1", C: "#E8A87C", D: "#C38D9E", E: "#41B3A3",
    F: "#6B5B95", G: "#F7CAC9", H: "#92A8D1", I: "#955251",
    J: "#B565A7", K: "#009B77", L: "#DD4124", M: "#45B8AC", N: "#EFC050", O: "#5B5EA6",
    P: "#9B2335", Q: "#D65076", R: "#45ADA8", S: "#9DE0AD", T: "#E1B16A",
    U: "#2E7D32", V: "#FF6F61", W: "#88B04B", X: "#F1948A", Y: "#BB8FCE", Z: "#4FC1E9",
  }
  return colors[initial] || "#777"
}

const lightenColor = (hex: string, amount = 60) => {
  const num = Number.parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + amount)
  const b = Math.min(255, (num & 0xff) + amount)
  return `rgb(${r}, ${g}, ${b})`
}

const darkenColor = (hex: string, amount = 40) => {
  const num = Number.parseInt(hex.replace("#", ""), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `rgb(${r}, ${g}, ${b})`
}

export function TextPlaceHolder({ e }: { e: any }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 10)
    return () => clearTimeout(timeout)
  }, [])

  if (!e) {
    return (
      <div className="w-full h-full absolute inset-0 flex justify-center items-center z-10 bg-neutral-900">
        <div
          className={`text-white text-xl font-semibold transition-all duration-500 ease-out transform ${
            show ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          No user selected
        </div>
      </div>
    )
  }

  const initial = e?.name?.[0]?.toUpperCase() || "A"
  const baseHex = getColorFromInitial(initial)
  const lightColor = lightenColor(baseHex, 60)
  const darkColor = darkenColor(baseHex, 40)

  return (
    <div
      className="w-full h-full absolute inset-0 flex justify-center items-center z-10"
      style={{
        background: `linear-gradient(135deg, ${lightColor}, ${baseHex})`,
      }}
    >
      <div
        className={`w-32 h-32 md:w-64 md:h-64 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ease-out transform ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        style={{ backgroundColor: darkColor }}
      >
        <p className="text-3xl md:text-6xl text-white font-semibold">
          {e?.name?.substring(0, 2).toUpperCase()}
        </p>
      </div>
    </div>
  )
}

export function Display({ e }: { e: any }) {
  const vidRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const vid = vidRef.current
    if (!e || !vid) return

    setVideoLoaded(false)

    if (e?.isCameraAvailable && e?.cameraStatus && e?.videoStream) {
      vid.srcObject = e.videoStream

      const onLoaded = () => {
        setVideoLoaded(true)
        vid.play().catch(console.error)
      }

      const onError = () => {
        console.error("Video loading error")
        setVideoLoaded(false)
      }

      vid.addEventListener("loadedmetadata", onLoaded)
      vid.addEventListener("error", onError)

      return () => {
        vid.removeEventListener("loadedmetadata", onLoaded)
        vid.removeEventListener("error", onError)
      }
    }
  }, [e?.videoStream, e?.cameraStatus, e?.isCameraAvailable])

  const showPlaceholder =
    !e?.isCameraAvailable || !e?.cameraStatus || !e?.videoStream || !videoLoaded

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {showPlaceholder && <TextPlaceHolder e={e} />}

      <video
        ref={vidRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        style={{
          display: showPlaceholder ? "none" : "block",
          minHeight: "90%",
        }}
      />

      <div className="absolute left-4 bottom-4 flex gap-3 items-center z-20">
        {e && (
          <>
            {!e.isMicrophoneAvailable ? (
              <div className="bg-red-500/70 backdrop-blur-sm rounded-full p-2.5 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faMicrophoneSlash}
                  className="text-white text-xl"
                  title="Microphone unavailable"
                />
              </div>
            ) : e.microphoneStatus ? (
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2.5 flex items-center justify-center hover:bg-black/70 transition-all duration-300">
                <FontAwesomeIcon
                  icon={faMicrophone}
                  className="text-white text-xl"
                  title="Microphone active"
                />
              </div>
            ) : (
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2.5 flex items-center justify-center hover:bg-black/70 transition-all duration-300">
                <FontAwesomeIcon
                  icon={faMicrophoneSlash}
                  className="text-white text-xl"
                  title="Microphone muted"
                />
              </div>
            )}
            {!e.isCameraAvailable ? (
              <div className="bg-red-500/70 backdrop-blur-sm rounded-full p-2.5 flex items-center justify-center">
                <FaVideoSlash
                  className="text-white text-xl"
                  title="Camera unavailable"
                />
              </div>
            ) : !e.cameraStatus ? (
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2.5 flex items-center justify-center">
                <FaVideoSlash
                  className="text-white text-xl"
                  title="Camera off"
                />
              </div>
            ) : null}
          </>
        )}
      </div>

      {e?.name && (
        <div className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full text-base font-semibold z-20 capitalize">
          {e.name}
        </div>
      )}
    </div>
  )
}

export default function MyLargerVideoComp({ isMobile }: { isMobile: boolean }) {
  const { selectedUserForLargeVideoRef, largeVideo, users }: any = useData()

  const getSelectedUser = () => {
    if (selectedUserForLargeVideoRef) return selectedUserForLargeVideoRef
    if (largeVideo) return largeVideo
    if (users?.length > 0) return users[users.length - 1]
    return null
  }

  const selectedUser = getSelectedUser()

  if (!selectedUser) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-neutral-900 rounded-lg">
        <div className="text-white text-xl">No user available</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <Display e={selectedUser} />
    </div>
  )
}
