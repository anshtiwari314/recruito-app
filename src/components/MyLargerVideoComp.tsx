import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FaSpinner } from "react-icons/fa";
import { useData } from "../context/DataWrapper";

function getColorFromInitial(initial: string) {
  const colors: Record<string, string> = {
    A: "#E27D60", B: "#85DCB", C: "#E8A87C", D: "#C38D9E",
    E: "#41B3A3", F: "#6B5B95", G: "#F7CAC9", H: "#92A8D1",
    I: "#955251", J: "#B565A7", K: "#009B77", L: "#DD4124",
    M: "#45B8AC", N: "#EFC050", O: "#5B5EA6", P: "#9B2335",
    Q: "#D65076", R: "#45ADA8", S: "#9DE0AD", T: "#E1B16A",
    U: "#2E7D32", V: "#FF6F61", W: "#88B04B", X: "#F1948A",
    Y: "#BB8FCE", Z: "#4FC1E9",
  };
  return colors[initial] || "#777";
}

const darkenColor = (hex: string, amount = 40) => {
  let num = parseInt(hex.replace("#",""), 16);
  let r = Math.max(0, (num >> 16) - amount);
  let g = Math.max(0, ((num >> 8) & 0xff) - amount);
  let b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r}, ${g}, ${b})`;
};
const lightenColor = (hex: string, amount = 60) => {
  let num = parseInt(hex.replace("#",""), 16);
  let r = Math.min(255, (num >> 16) + amount);
  let g = Math.min(255, ((num >> 8) & 0xff) + amount);
  let b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r}, ${g}, ${b})`;
};

export function TextPlaceHolder({ e }: { e: any }) {
  const initial = e?.name?.[0]?.toUpperCase() || "A";
  const baseColor = getColorFromInitial(initial);
  const darkColor = darkenColor(baseColor);
  const lightColor = lightenColor(baseColor);

  return (
    <div
      className="w-full h-full absolute flex justify-center items-center z-10"
      style={{
        background: `linear-gradient(135deg, ${lightColor}, ${baseColor})`,
      }}
    >
      <div
        className="w-32 h-32 md:w-64 md:h-64 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: darkColor }}
      >
        <p className="text-3xl md:text-6xl text-white">
          {e?.name?.substring(0, 2).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export function Display({ e, refreshKey }: { e: any; refreshKey: number }) {
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = vidRef.current;
    if (!e || !vid) return;
    if (e?.isCameraAvailable && e?.cameraStatus && e?.videoStream) {
      vid.srcObject = e.videoStream;
      const onLoaded = () => vid.play();
      vid.addEventListener("loadedmetadata", onLoaded);
      return () => vid.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [e, refreshKey]);

  return (
    <div className="relative w-full h-full">
      {(e?.isLoading || !e?.cameraStatus || !e?.isCameraAvailable) && (
        <TextPlaceHolder e={e} />
      )}
      <video
        key={refreshKey}
        ref={vidRef}
        className="h-full w-full object-cover z-0"
        autoPlay
        muted
        playsInline
      />
      <FontAwesomeIcon
        icon={
          e?.microphoneStatus && e?.isMicrophoneAvailable
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
  isMobile,
}: {
  isMobile: boolean;
}) {
  const {
    selectedUserForLargeVideoRef: e,
    cameraToggle,
    microphoneToggle,
  }: any = useData();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [cameraToggle, microphoneToggle]);

  return (
    <div className="h-full w-full flex justify-center items-center relative">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <FaSpinner className="animate-spin h-12 w-12 text-white" />
          <span className="ml-4 text-white text-xl font-medium">Loading...</span>
        </div>
      )}
      <Display e={e} refreshKey={refreshKey} />
    </div>
  );
}
