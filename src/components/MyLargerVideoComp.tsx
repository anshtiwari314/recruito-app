import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FaVideo } from "react-icons/fa6"


function getColorFromInitial(initial: string) {
  const colors: Record<string, string> = {
    A: "#E27D60", B: "#92A8D1", C: "#E8A87C", D: "#C38D9E", E: "#41B3A3",
    F: "#6B5B95", G: "#F7CAC9", H: "#92A8D1", I: "#955251", J: "#B565A7",
    K: "#009B77", L: "#DD4124", M: "#45B8AC", N: "#EFC050", O: "#5B5EA6",
    P: "#9B2335", Q: "#D65076", R: "#45ADA8", S: "#9DE0AD", T: "#E1B16A",
    U: "#2E7D32", V: "#FF6F61", W: "#88B04B", X: "#F1948A", Y: "#BB8FCE",
    Z: "#4FC1E9",
  };
  return colors[initial] || "#777";
}

function darkenHexColor(hex: string, factor: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.floor(((num >> 16) & 255) * factor);
  const g = Math.floor(((num >> 8) & 255) * factor);
  const b = Math.floor((num & 255) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

export function TextPlaceHolder({ e }: { e: any }) {
  const initials = e?.name?.substring(0, 2)?.toUpperCase() || "??";
  const firstLetter = initials[0];
  const baseColor = getColorFromInitial(firstLetter);
  const darkColor = darkenHexColor(baseColor, 0.7);

  const fullBgGradient = {
    background: `radial-gradient(circle at center, ${darkColor} 30%, ${baseColor} 90%)`,
  };

  const circleGradient = {
    background: `radial-gradient(circle at center, ${darkColor} 50%, ${baseColor} 100%)`,
  };

  return (
    <div
      className="w-full h-full absolute flex justify-center items-center z-5"
      style={fullBgGradient}
    >
      <div
        className="w-32 h-32 md:w-64 md:h-64 rounded-full mx-auto flex items-center justify-center"
        style={circleGradient}
      >
        <p className="text-3xl md:text-6xl text-white">{initials}</p>
      </div>
    </div>
  );
}


export function Display({ e, isMobile }: { e: any; isMobile: boolean }) {
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
        {!e?.isMicrophoneAvailable ? (
          <div className="bg-red-500/70 backdrop-blur-sm rounded-full p-2.5">
            <FontAwesomeIcon
              icon={faMicrophoneSlash}
              className="text-white text-xl"
              title="Microphone unavailable"
            />
          </div>
        ) : e?.microphoneStatus ? (
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2.5 hover:bg-black/70 transition-all duration-300">
            <FontAwesomeIcon
              icon={faMicrophone}
              className="text-white text-xl"
              title="Microphone active"
            />
          </div>
        ) : (
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2.5 hover:bg-black/70 transition-all duration-300">
            <FontAwesomeIcon
              icon={faMicrophoneSlash}
              className="text-white text-xl"
              title="Microphone muted"
            />
          </div>
        )}

        {!e?.isCameraAvailable ? (
          <div className="bg-red-500/70 backdrop-blur-sm rounded-full p-2.5">
            <FontAwesomeIcon
              icon={faVideoSlash}
              className="text-white text-xl"
              title="Camera unavailable"
            />
          </div>
        ) : !e?.cameraStatus ? (
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2.5">
            <FontAwesomeIcon
              icon={faVideoSlash}
              className="text-white text-xl"
              title="Camera off"
            />
          </div>
        ) : (
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2.5 hover:bg-black/70 transition-all duration-300">
            <FaVideo className="text-white text-xl" title="Camera on" />
          </div>
        )}
      </div>

      {e?.name && (
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-base font-semibold capitalize z-20">
          {e.name}
        </div>
      )}
    </div>
  )
}
export default function MyLargerVideoComp({
  e,
  isMobile,
}: {
  e: any;
  isMobile: boolean;
}) {
  const ref = useRef<any>(null);
  return (
    <div ref={ref} className="h-[80vh] w-full ">
      <Display e={e} isMobile={isMobile} />
    </div>
  );
}
