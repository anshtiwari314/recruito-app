import React, { useRef, useEffect } from "react";

function getColorFromInitial(initial: string) {

  const colors: Record<string, string> = {
    A: "#E27D60", B: "#85DCB", C: "#E8A87C", D: "#C38D9E", E: "#41B3A3",
    F: "#6B5B95", G: "#F7CAC9", H: "#92A8D1", I: "#955251", J: "#B565A7",
    K: "#009B77", L: "#DD4124", M: "#45B8AC", N: "#EFC050", O: "#5B5EA6",
    P: "#9B2335", Q: "#D65076", R: "#45ADA8", S: "#9DE0AD", T: "#E1B16A",
    U: "#2E7D32", V: "#FF6F61", W: "#88B04B", X: "#F1948A", Y: "#BB8FCE",
    Z: "#4FC1E9",
  };
  return colors[initial] || "#777"; 
}

export function RightPanelVideo({ e, muted }: { e: any; muted: boolean }) {
  const vidRef = useRef<any>(null);

  useEffect(() => {
    const vid = vidRef.current;
    if (e.videoStream === null || e.isLoading === null || vid === null) return;

    if (e.isCameraAvailable === true && e.cameraStatus === true) {
      vid.srcObject = e.videoStream;
      const onLoaded = () => {
        vid.play();
      };
      vid.addEventListener("loadedmetadata", onLoaded);
      return () => vid.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [e.videoStream, e.cameraStatus]);

  useEffect(() => {
    if (!e.audioStream) return;

    let audio: any = new Audio();

    if (e.isMicrophoneAvailable === true) audio.srcObject = e.audioStream;

    audio.muted = muted;
    audio.addEventListener("canplaythrough", () => {
      audio.play();
    });
  }, [e.audioStream, muted]);

  function getMicIcon() {
  if (!e) return null;

  if (!e?.isMicrophoneAvailable) {
    return (
      <i className="fa-solid fa-microphone-slash text-red-500 bg-black/50 p-1 rounded"></i>
    );
  }

  if (e?.microphoneStatus === false) {
    return (
      <i className="fa-solid fa-microphone-slash text-white bg-black/50 p-1 rounded"></i>
    );
  }

  return (
    <i className="fa-solid fa-microphone text-white bg-black/50 p-1 rounded"></i>
  );
}

function getVideoIcon() {
  if (!e) return null;

  console.log('get video icon',e)
  if (!e?.isCameraAvailable) {
    return (
      <i className="fa-solid fa-video-slash text-red-500 bg-black/50 p-1 rounded"></i>
    );
  }

  if (e?.cameraStatus === false) {
    return (
      <i className="fa-solid fa-video-slash text-white bg-black/50 p-1 rounded"></i>
    );
  }

  return (
    <i className="fa-solid fa-video text-white bg-black/50 p-1 rounded"></i>
  );
}


  const initial = e?.name ? e.name.charAt(0).toUpperCase() : "?";
  const bgColor = getColorFromInitial(initial);

  return (
    <>
   <div className="relative">
  <div className="aspect-video rounded-lg overflow-hidden flex items-center justify-center bg-neutral-200">
    {e?.cameraStatus === false ? (
      <div
        className="flex items-center justify-center w-full h-full"
        style={{
          background: `linear-gradient(to bottom, ${bgColor}40, ${bgColor}99)`,
        }}
      >
        <div
          className="w-20 h-20 rounded-full"
          style={{
            backgroundColor: bgColor,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "1.25rem",
            textTransform: "capitalize",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          }}
        >
          {e.name.split(' ')[0].substring(0,2).toUpperCase()}
        </div>
      </div>
    ) : (
      <video
        ref={vidRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      ></video>
    )}
  </div>

  {/* Name & Icons */}
  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
    <span
      className="text-sm bg-black/50 text-white px-2 py-1 rounded"
      style={{ textTransform: "capitalize" }}
    >
      {e?.name}
    </span>
    <div className="flex space-x-1">
      {getMicIcon()}
      {getVideoIcon()}
    </div>
  </div>
</div>
    </>
  );
}
