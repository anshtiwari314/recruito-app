import React, { useRef, useEffect } from "react";

export function AnujRightPanelVideo({ e, muted }: { e: any; muted: boolean }) {
  const vidRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
      // console.log("display",e.isLoading, e.isAudioStream, e.cameraStatus)
    const vid = vidRef.current;
  // console.log("display1 ",e.videoStream , e.audioStream, e.isLoading, vid)
    if (!vid || !e || !e.videoStream || e.isLoading) return;

    if (e.isCameraAvailable === true && e.videoStream instanceof MediaStream) {
      vid.srcObject = e.videoStream;
    }

    const onLoaded = () => {
      vid.play().catch((err) => {
        console.error("Video play failed:", err);
      });
    };

    vid.addEventListener("loadedmetadata", onLoaded);

    return () => {
      vid.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [e.videoStream, e.isCameraAvailable, e.isLoading]);

  useEffect(() => {
    if (!e || !e.audioStream || !e.isMicrophoneAvailable) return;

    const audio = new Audio();
    if (e.audioStream instanceof MediaStream) {
      audio.srcObject = e.audioStream;
    }

    audio.muted = muted;

    audio.addEventListener("canplaythrough", () => {
       /* the audio is now playable; play it if permissions allow */
      audio.play().catch((err) => {
        console.error("Audio play failed:", err);
      });
    });

    return () => {
      audio.pause();
    };
  }, [e.audioStream, e.isMicrophoneAvailable, muted]);

  const getMicIcon = () => {
    if (!e?.isMicrophoneAvailable) return null;
    if (e?.microphoneStatus === false)
      return (
        <i className="fa-solid fa-microphone-slash bg-black/50 text-white p-1 rounded"></i>
      );
    return (
      <i className="fa-solid fa-microphone bg-black/50 text-white p-1 rounded"></i>
    );
  };

  const getVideoIcon = () => {
    if (!e?.isCameraAvailable) return null;
    if (e?.cameraStatus === false) {
      return (
        <i className="fa-solid fa-video-slash bg-black/50 text-white p-1 rounded"></i>
      );
    }
    return (
      <i className="fa-solid fa-video bg-black/50 text-white p-1 rounded"></i>
    );
  };

  return (
    <div className="relative">
      <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
        <video ref={vidRef} className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span
          className="text-sm bg-black/50 text-white px-2 py-1 rounded"
          style={{ textTransform: "capitalize" }}
        >
          {e?.name}
        </span>
        <div className="flex space-x-1">
          {getMicIcon()}
          {/* <i className="fa-solid fa-microphone-slash bg-black/50 text-white p-1 rounded"></i> */}
          {getVideoIcon()}
        </div>
      </div>
    </div>
  );
}
