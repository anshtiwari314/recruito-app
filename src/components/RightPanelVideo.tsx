import React, { useRef, useEffect } from "react";

export function RightPanelVideo({ e, muted }: { e: any; muted: boolean }) {
    const vidRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
      const vid = vidRef.current;
      if (!vid) return;

      if (e.isCameraAvailable && e.cameraStatus && e.videoStream) {
        vid.srcObject = e.videoStream;
        const onLoaded = () => vid.play();
        vid.addEventListener("loadedmetadata", onLoaded);
        return () => {
          vid.removeEventListener("loadedmetadata", onLoaded);
          vid.pause();
          vid.srcObject = null;
        };
      } else {
        vid.pause();
        vid.srcObject = null;
      }
    }, [e.videoStream, e.cameraStatus, e.isCameraAvailable]);

  useEffect(() => {
    if (!e.audioStream) return;
    const audio = new Audio();
    if (e.isMicrophoneAvailable) {
      audio.srcObject = e.audioStream;
    }
    audio.muted = muted;
    audio.addEventListener("canplaythrough", () => {
      audio.play();
    });
    return () => {
      audio.pause();
    };
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

  function getColorFromInitial(initial: string) {
    const colors: Record<string, string> = {
      A: "#E27D60", B: "#92A8D1", C: "#E8A87C", D: "#C38D9E", E: "#41B3A3",
      F: "#6B5B95", G: "#F7CAC9", H: "#92A8D1", I: "#955251", J: "#B565A7",
      K: "#009B77", L: "#DD4124", M: "#45B8AC", N: "#EFC050", O: "#5B5EA6",
      P: "#9B2335", Q: "#D65076", R: "#45ADA8", S: "#9DE0AD", T: "#E1B16A",
      U: "#2E7D32", V: "#FF6F61", W: "#88B04B", X: "#F1948A", Y: "#BB8FCE",
      Z: "#4FC1E9",
    };
    return colors[initial.toUpperCase()] || "#777";
  }

  function adjustColor(hex: string, amount: number) {
    return (
      "#" +
      hex
        .replace(/^#/, "")
        .match(/.{2}/g)!
        .map((c) =>
          Math.max(0, Math.min(255, parseInt(c, 16) + amount))
            .toString(16)
            .padStart(2, "0")
        )
        .join("")
    );
  }

  const name = e?.name || "?";
  const initials = name.slice(0, 2).toUpperCase();
  const baseColor = getColorFromInitial(initials[0]);
  const lighterColor = adjustColor(baseColor, 40); 
  const darkerColor = adjustColor(baseColor, -40); 

  return (
    <div className="relative">
      <div
        className="aspect-video rounded-lg overflow-hidden flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${lighterColor}, ${baseColor})`,
        }}
      >
        {e.cameraStatus === true && e.videoStream ? (
          <video
            ref={vidRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          ></video>
        ) : (
          <div className="flex items-center justify-center">
            <div
              className="rounded-full w-20 h-20 flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${baseColor}, ${darkerColor})`,
              }}
            >
              <span className="text-white text-3xl font-semibold">
                {initials}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span
          className="text-sm bg-black/50 text-white px-2 py-1 rounded"
          style={{ textTransform: "capitalize" }}
        >
          {name}
        </span>
        <div className="flex space-x-1">{getMicIcon()}{getVideoIcon()}</div>
      </div>
    </div>
  );
}
