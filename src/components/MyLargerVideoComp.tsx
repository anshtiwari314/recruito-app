import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";


export interface UserStreamType {
  id: string;
  name: string;
  isLoading: boolean;
  videoStream: MediaStream | null;
  audioStream: MediaStream | null;
  isCameraAvailable: boolean;
  isMicrophoneAvailable: boolean;
  cameraStatus: boolean;
  microphoneStatus: boolean;
}

export function TextPlaceHolder({ e }: { e: UserStreamType }) {
  return (
    <div className="w-full h-full absolute bg-[#737272] flex justify-center items-center z-5">
      <div className="w-32 h-32 md:w-64 md:h-64 rounded-full mx-auto bg-violet-500 flex items-center justify-center">
        <p className="text-3xl md:text-6xl w-fit text-white">
          {e?.name?.substring(0, 2).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export function Display({ e, isMobile }: { e: UserStreamType; isMobile: boolean }) {
  const vidRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = vidRef.current;

    if (
      !vid ||
      e.isLoading ||
      !e.videoStream ||
      !(e.videoStream instanceof MediaStream)
    ) {
      console.warn(" Invalid or no video stream:", e.videoStream);
      return;
    }

    if (e.isCameraAvailable) {
      vid.srcObject = e.videoStream;
    }

    const onLoaded = () => {
      vid.play().catch((err) => {
        console.error("Video play error:", err);
      });
    };

    vid.addEventListener("loadedmetadata", onLoaded);

    return () => {
      vid.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [e.videoStream, e.isLoading, e.isCameraAvailable]);

  return (
    <div className="relative w-full h-full">
      {e.isLoading || !e.cameraStatus || !e.isCameraAvailable ? (
        <TextPlaceHolder e={e} />
      ) : null}

      <video
        ref={vidRef}
        className="h-full w-full object-cover z-2"
        muted
        autoPlay
        playsInline
      />

      <FontAwesomeIcon
        icon={e.microphoneStatus && e.isMicrophoneAvailable ? faMicrophone : faMicrophoneSlash}
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
  e: UserStreamType;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={ref} className="h-full w-full flex justify-center items-center">
      <Display e={e} isMobile={isMobile} />
    </div>
  );
}
