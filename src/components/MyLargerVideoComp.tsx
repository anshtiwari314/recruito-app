import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

// Color map for initials
function getColorFromInitial(initial: string) {
  const colors: Record<string, string> = {
    A: "#E27D60",
    B: "#85DCB",
    C: "#E8A87C",
    D: "#C38D9E",
    E: "#41B3A3",
    F: "#6B5B95",
    G: "#F7CAC9",
    H: "#92A8D1",
    I: "#955251",
    J: "#B565A7",
    K: "#009B77",
    L: "#DD4124",
    M: "#45B8AC",
    N: "#EFC050",
    O: "#5B5EA6",
    P: "#9B2335",
    Q: "#D65076",
    R: "#45ADA8",
    S: "#9DE0AD",
    T: "#E1B16A",
    U: "#2E7D32",
    V: "#FF6F61",
    W: "#88B04B",
    X: "#F1948A",
    Y: "#BB8FCE",
    Z: "#4FC1E9",
  };
  return colors[initial] || "#777";
}

//fxn to lighten or darken a color
const darkenColor = (hex: string, amount = 30) => {
  let col = hex.replace("#", "");
  let num = parseInt(col, 16);

  let r = Math.max(0, (num >> 16) - amount);
  let g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  let b = Math.max(0, (num & 0x0000ff) - amount);

  return `rgb(${r}, ${g}, ${b})`;
};

const lightenColor = (hex: string, amount = 30) => {
  let col = hex.replace("#", "");
  let num = parseInt(col, 16);

  let r = Math.min(255, (num >> 16) + amount);
  let g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  let b = Math.min(255, (num & 0x0000ff) + amount);

  return `rgb(${r}, ${g}, ${b})`;
};

export function TextPlaceHolder({ e }: { e: any }) {
  const initial = e?.name?.[0]?.toUpperCase?.() || "A";
  const baseColor = getColorFromInitial(initial);
  const darkColor = darkenColor(baseColor, 40);
  const lightColor = lightenColor(baseColor, 60);

  return (
    <div
      className="w-full h-full absolute flex justify-center items-center z-5"
      style={{
        background: `linear-gradient(135deg, ${lightColor}, ${baseColor})`,
      }}
    >
      <div
        className="w-32 h-32 md:w-64 md:h-64 rounded-full mx-auto flex items-center justify-center shadow-lg"
        style={{ backgroundColor: darkColor }}
      >
        <p className="text-3xl md:text-6xl w-fit text-white">
          {e?.name?.substring(0, 2).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export function Display({ e, isMobile }: { e: any; isMobile: boolean }) {
  let vidRef = useRef<any>(null);

  useEffect(() => {
    let vid = vidRef.current;
    if (
      e.videoStream === null ||
      e.audioStream === null ||
      e.isLoading === true ||
      !vid
    )
      return;

    if (e.isCameraAvailable === true) vid.srcObject = e.videoStream;

    function onLoaded() {
      vid.play();
    }

    vid.addEventListener("loadedmetadata", onLoaded);

    return () => {
      vid.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [e.videoStream, e.audioStream]);

  return (
    <div className="relative w-full h-full">
      {e.isLoading === true ||
      e.cameraStatus === false ||
      e.isCameraAvailable === false ? (
        <TextPlaceHolder e={e} />
      ) : null}

      <video
        ref={vidRef}
        className="h-full w-full object-cover z-2"
        autoPlay
        muted
        playsInline
      />

      <FontAwesomeIcon
        icon={
          e.microphoneStatus && e.isMicrophoneAvailable
            ? faMicrophone
            : faMicrophoneSlash
        }
        style={{
          fontSize: "2rem",
          color: "white",
          position: "absolute",
          left: "1rem",
          bottom: "0.5rem",
        }}
      />
    </div>
  );
}

export default function MyLargerVideoComp({
  e,
  isMobile,
}: {
  e: any;
  isMobile: boolean;
}) {
  let ref = useRef<any>(null);

  return (
    <div ref={ref} className="h-full w-full flex justify-center items-center">
      <Display e={e} isMobile={isMobile} />
    </div>
  );
}
