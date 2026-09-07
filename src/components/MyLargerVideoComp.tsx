import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FaVideo } from "react-icons/fa6";
import {
  adjustColor,
  getColorFromInitial,
  getParticipantInitials,
} from "@/utils/participantUtils";

export function TextPlaceHolder({ e }: { e: any }) {
  const name = e?.name || "Guest";
  const initials = getParticipantInitials(name);
  const baseColor = getColorFromInitial(initials[0]);
  const darkerColor = adjustColor(baseColor, -35);

  return (
    <div
      className="w-32 h-32 md:w-64 md:h-64 rounded-full flex items-center justify-center font-semibold text-white shadow-lg ring-2 ring-white/10"
      style={{
        background: `linear-gradient(135deg, ${baseColor}, ${darkerColor})`,
      }}
    >
      <span className="text-3xl md:text-6xl">{initials}</span>
    </div>
  );
}

export function Display({ e, isMobile }: { e: any; isMobile: boolean }) {
  const vidRef = useRef<HTMLVideoElement>(null);

  const name = e?.name || "Guest";
  const initials = getParticipantInitials(name);
  const baseColor = getColorFromInitial(initials[0]);
  const lighterColor = adjustColor(baseColor, 30);

  const hasVideo =
    Boolean(e?.videoStream) && e?.isCameraAvailable !== false;

  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;

    if (hasVideo) {
      vid.srcObject = e.videoStream;
      const onLoaded = () => vid.play().catch(() => {});
      vid.addEventListener("loadedmetadata", onLoaded);
      if (vid.readyState >= HTMLMediaElement.HAVE_METADATA) {
        vid.play().catch(() => {});
      }
      return () => {
        vid.removeEventListener("loadedmetadata", onLoaded);
        vid.pause();
        vid.srcObject = null;
      };
    }

    vid.pause();
    vid.srcObject = null;
  }, [e.videoStream, hasVideo]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900/80">
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `linear-gradient(145deg, ${lighterColor}22, ${baseColor}44)`,
        }}
      >
        {hasVideo ? (
          <video
            ref={vidRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <TextPlaceHolder e={e} />
        )}
      </div>

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
  );
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
    <div ref={ref} className="h-full w-full">
      <Display e={e} isMobile={isMobile} />
    </div>
  );
}
