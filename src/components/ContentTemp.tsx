import { useData } from "@/context/DataWrapper"
import { useAppSelector } from "@/store/store"
import type { CuesDataType } from "@/reducers/cuesReducer"
import { useEffect, useRef, useState } from "react"
import parse from "html-react-parser"

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

export function RightPanelVideo({ e, muted }: { e: any; muted: boolean }) {
  const vidRef = useRef<any>(null);

  useEffect(() => {
    const vid = vidRef.current;
    if (e.videoStream === null || e.isLoading === null || vid === null) return;

    if (e.isCameraAvailable && e.cameraStatus) {
      vid.srcObject = e.videoStream;
      const onLoaded = () => vid.play();
      vid.addEventListener("loadedmetadata", onLoaded);
      return () => vid.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [e.videoStream, e.cameraStatus]);

  useEffect(() => {
    if (!e.audioStream) return;
    const audio: any = new Audio();
    if (e.isMicrophoneAvailable) audio.srcObject = e.audioStream;
    audio.muted = muted;
    audio.addEventListener("canplaythrough", () => audio.play());
  }, [e.audioStream, muted]);

  const initial = e?.name ? e.name.charAt(0).toUpperCase() : "?";
  const bgColor = getColorFromInitial(initial);

  const getMicIcon = () =>
    e?.isMicrophoneAvailable ? (
      e?.microphoneStatus ? (
        <i className="fa-solid fa-microphone text-green-400" />
      ) : (
        <i className="fa-solid fa-microphone-slash text-red-400" />
      )
    ) : null;

  const getVideoIcon = () =>
    e?.isCameraAvailable ? (
      e?.cameraStatus ? (
        <i className="fa-solid fa-video text-green-400" />
      ) : (
        <i className="fa-solid fa-video-slash text-red-400" />
      )
    ) : null;

  return (
    <div className="relative rounded-xl shadow-lg border border-white/10 overflow-hidden backdrop-blur-sm bg-white/5 transition-all">
      <div className="aspect-video w-full flex items-center justify-center bg-black/20">
        {e?.cameraStatus ? (
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

             
              {e?.microphoneStatus && (
                <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-pulse opacity-50 pointer-events-none" />
              )}

              {/* Little Ping Dot if mic is on */}
              {/* {e?.microphoneStatus && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping shadow-md"></span>
              )} */}
            </div>
          </div>
        )}
      </div>

      
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between backdrop-blur-md bg-white/10 px-3 py-1 rounded-xl shadow-sm">
        <span className="text-sm font-semibold text-white truncate capitalize max-w-[60%]">
          {e?.name}
        </span>
        <div className="flex items-center gap-2 text-lg">
          {getMicIcon()}
          {getVideoIcon()}
        </div>
      </div>
    </div>
  );
}





const ContentTemp = () => {
  const [currentCues] = useAppSelector((state) => [state.cuesReducer.CuesList])
  const { users } = useData()

  return (
    <div className="flex gap-6 h-[60vh] mb-2">
      
      <div className="w-[55%] flex flex-col bg-white rounded-lg shadow-sm border-2 border-zinc-500">
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

    
      <div className="w-[45%] bg-white rounded-lg shadow-sm border-2 border-zinc-500 flex flex-col">
        <div className="p-4 border-b border-zinc-300">
          <h2 className="font-semibold mb-4 text-neutral-900">Participants ({users.length})</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {users.map((e, i) => (
              <RightPanelVideo e={e} key={i} muted={i === 0 ? true : false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentTemp
