import { useData } from "@/context/DataWrapper";
import { useAppSelector } from "@/store/store";
import type { CuesDataType } from "@/reducers/cuesReducer";
import { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import { FaUserSlash, FaSpinner } from "react-icons/fa";

function getColorFromInitial(initial: string) {
  const colors: Record<string, string> = {
    A: "#E27D60", B: "#85DCB", C: "#E8A87C", D: "#C38D9E", E: "#41B3A3", F: "#6B5B95", G: "#F7CAC9",
    H: "#92A8D1", I: "#955251", J: "#B565A7", K: "#009B77", L: "#DD4124", M: "#45B8AC", N: "#EFC050",
    O: "#5B5EA6", P: "#9B2335", Q: "#D65076", R: "#45ADA8", S: "#9DE0AD", T: "#E1B16A", U: "#2E7D32",
    V: "#FF6F61", W: "#88B04B", X: "#F1948A", Y: "#BB8FCE", Z: "#4FC1E9",
  };
  return colors[initial] || "#777";
}

export function SingleCue({
  question,
  isAnswered,
}: {
  question: CuesDataType;
  isAnswered: boolean;
}) {
  const [toggleDetails, setToggleDetails] = useState(true);

  return (
    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {isAnswered ? (
            <i className="fa-solid fa-circle-check text-neutral-600"></i>
          ) : (
            <i className="fa-regular fa-circle text-neutral-600"></i>
          )}
          <span className="text-neutral-900">{parse(question?.similarity_query)}</span>
        </div>
        {isAnswered ? (
          <span className="px-2 py-1 bg-neutral-200 rounded text-sm">
            {question?.match_score ? `${question.match_score} match` : ""}
          </span>
        ) : null}
      </div>
      {isAnswered && (
        <div className="ml-8 text-sm text-neutral-600">
          {toggleDetails && <p className="mt-2 pl-2 pr-2">{parse(question?.content)}</p>}
        </div>
      )}
    </div>
  );
}

export function VideoPanel() {
  const { selectedUserForLargeVideoRef: e }: any = useData();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [e?.cameraStatus, e?.isCameraAvailable, e?.isMicrophoneAvailable, e?.audioStream, e?.videoStream]);

  useEffect(() => {
    if (!e || !vidRef.current) return;
    if (e.videoStream && e.isCameraAvailable && e.cameraStatus) {
      const vid = vidRef.current;
      vid.srcObject = e.videoStream;
      const onLoaded = () => vid.play();
      vid.addEventListener("loadedmetadata", onLoaded);
      return () => vid.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [e, refreshKey]);

  useEffect(() => {
    if (!e || !e.audioStream) return;
    const audio = new Audio();
    if (e.isMicrophoneAvailable) {
      audio.srcObject = e.audioStream;
      audio.muted = true;
      audio.addEventListener("canplaythrough", () => audio.play());
    }
  }, [e, refreshKey]);

  if (!e) {
    return (
      <div
        key={refreshKey}
        className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-3"
      >
        <FaUserSlash className="w-12 h-12 text-zinc-900 animate-pulse" />
        <p className="text-xl font-semibold text-center">No user selected</p>
        <p className="text-m text-center text-neutral-400">
          Tap on a user to view their video feed 🎥
        </p>
      </div>
    );
  }

  const initial = e.name?.charAt(0).toUpperCase() || "?";
  const bgColor = getColorFromInitial(initial);

  const getMicIcon = () => {
    if (!e?.isMicrophoneAvailable) {
      return <i className="fa-solid fa-microphone-slash text-red-500 focus:outline-none" />;
    }
    return e?.microphoneStatus
      ? <i className="fa-solid fa-microphone text-white focus:outline-none" />
      : <i className="fa-solid fa-microphone-slash text-white focus:outline-none" />;
  };

  const getVideoIcon = () => {
    if (!e?.isCameraAvailable) {
      return <i className="fa-solid fa-video-slash text-red-500 focus:outline-none" />;
    }
    return e?.cameraStatus
      ? <i className="fa-solid fa-video text-white focus:outline-none" />
      : <i className="fa-solid fa-video-slash text-white focus:outline-none" />;
  };

  return (
    <div
      key={refreshKey}
      className="w-full h-full rounded-xl shadow-lg border border-white/10 overflow-hidden backdrop-blur-sm bg-white/5 transition-all relative"
    >
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <FaSpinner className="animate-spin h-10 w-10 text-green" />
          <span className="ml-3 text-white text-x font-medium">Loading...</span>
        </div>
      )}

      <div className="w-full h-full flex items-center justify-center bg-black/20">
        {e.cameraStatus ? (
          <video
            ref={vidRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{
              background: `linear-gradient(to bottom, ${bgColor}50, ${bgColor}AA)`,
            }}
          >
            <div className="relative group">
            <div
              className="w-28 h-28 rounded-full text-white text-3xl font-bold shadow-md shadow-black/30 backdrop-blur-md flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              {initial}
            </div>
              {e.microphoneStatus && (
                <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-pulse opacity-50 pointer-events-none" />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-3 left-3 bg-black text-white text-base font-semibold rounded-lg px-4 py-1.5 max-w-[180px] truncate capitalize shadow-md">
        {e.name}
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-3">
        <span className="bg-black rounded-lg p-2 flex items-center justify-center shadow-md">
          {getMicIcon()}
        </span>
        <span className="bg-black rounded-lg p-2 flex items-center justify-center shadow-md">
          {getVideoIcon()}
        </span>
      </div>
    </div>
  );
}

const ContentTemp = () => {
  const [currentCues] = useAppSelector((state) => [state.cuesReducer.CuesList]);

  return (
    <div className="flex gap-6 h-[58vh] mb-2">
      <div className="w-[41%] h-[95%] flex flex-col bg-white rounded-lg shadow-sm border-2 border-zinc-500">
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-300">
          <h3 className="text-lg font-semibold text-neutral-900">AI Suggestions</h3>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
          {currentCues &&
            currentCues.map((question: CuesDataType, index: number) => (
              <SingleCue question={question} key={index} isAnswered={question.isanswered} />
            ))}
        </div>
      </div>

      <div className="w-[59%] h-[95%] bg-white rounded-lg shadow-sm border border-neutral-200 flex flex-col">
        <div className="w-full aspect-video overflow-hidden">
          <VideoPanel />
        </div>
      </div>
    </div>
  );
};

export default ContentTemp;
