import { useData } from "@/context/DataWrapper"
import { useAppSelector } from "@/store/store"
import type { CuesDataType } from "@/reducers/cuesReducer"
import { useEffect, useRef, useState } from "react"
import parse from "html-react-parser"

function getColorFromInitial(initial: string) {
  const colors: Record<string, string> = {
    A: "#E27D60", B: "#85DCB", C: "#E8A87C", D: "#C38D9E", E: "#41B3A3", F: "#6B5B95", G: "#F7CAC9",
    H: "#92A8D1", I: "#955251", J: "#B565A7", K: "#009B77", L: "#DD4124", M: "#45B8AC", N: "#EFC050",
    O: "#5B5EA6", P: "#9B2335", Q: "#D65076", R: "#45ADA8", S: "#9DE0AD", T: "#E1B16A", U: "#2E7D32",
    V: "#FF6F61", W: "#88B04B", X: "#F1948A", Y: "#BB8FCE", Z: "#4FC1E9",
  }
  return colors[initial] || "#777"
}

export function SingleCue({
  question,
  isAnswered,
}: {
  question: CuesDataType
  isAnswered: boolean
}) {
  const [toggleDetails, setToggleDetails] = useState(true)

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
      {!isAnswered ? (
        <div className="ml-8"></div>
      ) : (
        <div className="ml-8 text-sm text-neutral-600">
          <div>{toggleDetails && <p className="mt-2 pl-2 pr-2">{parse(question?.content)}</p>}</div>
        </div>
      )}
    </div>
  )
}


export function VideoPanel() {
  const { selectedUserForLargeVideoRef, setSelectedUserForLargeVideoRef }: any = useData();
  useEffect(() => {
    if (!selectedUserForLargeVideoRef) {
      console.warn("No user selected for large video");
    }
  }, [selectedUserForLargeVideoRef, setSelectedUserForLargeVideoRef]);

  const e = selectedUserForLargeVideoRef;
  console.log("Selected user for large video:", e);
  const vidRef = useRef<any>(null);

  useEffect(() => {
    if (!e || !vidRef.current) return;
    if (e.videoStream && e.isCameraAvailable && e.cameraStatus) {
      const vid = vidRef.current;
      vid.srcObject = e.videoStream;
      const onLoaded = () => vid.play();
      vid.addEventListener("loadedmetadata", onLoaded);
      return () => vid.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [e]);

  useEffect(() => {
    if (!e || !e.audioStream) return;
    const audio: any = new Audio();
    if (e.isMicrophoneAvailable) {
      audio.srcObject = e.audioStream;
      audio.muted = true;
      audio.addEventListener("canplaythrough", () => audio.play());
    }
  }, [e]);

  if (!e) {
    return (
      <div className="w-full h-full text-xl flex items-center justify-center text-neutral-500">
        No user selected Click on a user to view their video
      </div>
    );
  }

  const initial = e.name ? e.name.charAt(0).toUpperCase() : "?";
  const bgColor = getColorFromInitial(initial);

  const getMicIcon = () =>
    e.isMicrophoneAvailable ? (
      e.microphoneStatus ? (
        <i className="fa-solid fa-microphone text-white focus:outline-none" />
      ) : (
        <i className="fa-solid fa-microphone-slash text-white focus:outline-none" />
      )
    ) : null;

  const getVideoIcon = () =>
    e.isCameraAvailable ? (
      e.cameraStatus ? (
        <i className="fa-solid fa-video text-white focus:outline-none" />
      ) : (
        <i className="fa-solid fa-video-slash text-white focus:outline-none" />
      )
    ) : null;

  return (
    <div className="h-full rounded-xl shadow-lg border border-white/10 overflow-hidden backdrop-blur-sm bg-white/5 transition-all relative">
      <div className="aspect-video w-full flex items-center justify-center bg-black/20">
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
                className="w-24 h-24 rounded-full text-white text-2xl font-bold shadow-md border-2 border-white/30 backdrop-blur-md ring-2 ring-white/40 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center"
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
  const [currentCues] = useAppSelector((state) => [state.cuesReducer.CuesList])

  return (
    <div className="flex gap-6 h-[60vh] mb-2">
      
      <div className="w-[35%] flex flex-col bg-white rounded-lg shadow-sm border-2 border-zinc-500">
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

      <div className="w-[65%] bg-white rounded-lg shadow-sm border-1 border-neutral-100 flex flex-col">
      
        <div className="flex-1">
      
          <VideoPanel />
        </div>
      </div>
    </div>
  )
}

export default ContentTemp
