import React, { useEffect, useRef } from "react";
import {
  adjustColor,
  getColorFromInitial,
  getParticipantInitials,
} from "@/utils/participantUtils";

type ParticipantTileProps = {
  participant: any;
  muted?: boolean;
  compact?: boolean;
  isSpeaking?: boolean;
  onClick?: () => void;
};

export default function ParticipantTile({
  participant: e,
  muted = false,
  compact = false,
  isSpeaking = false,
  onClick,
}: ParticipantTileProps) {
  const vidRef = useRef<HTMLVideoElement | null>(null);

  const hasVideo =
    Boolean(e?.videoStream) && e?.isCameraAvailable !== false;

  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;

    if (hasVideo) {
      vid.srcObject = e.videoStream;
      const onLoaded = () => vid.play().catch(() => {});
      vid.addEventListener("loadedmetadata", onLoaded);
      return () => {
        vid.removeEventListener("loadedmetadata", onLoaded);
        vid.pause();
        vid.srcObject = null;
      };
    }

    vid.pause();
    vid.srcObject = null;
  }, [e.videoStream, hasVideo]);

  useEffect(() => {
    if (!e.audioStream) return;
    const audio = new Audio();
    if (e.isMicrophoneAvailable) {
      audio.srcObject = e.audioStream;
    }
    audio.muted = muted;
    const onCanPlay = () => audio.play().catch(() => {});
    audio.addEventListener("canplaythrough", onCanPlay);
    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.pause();
    };
  }, [e.audioStream, e.isMicrophoneAvailable, muted]);

  const name = e?.name || "Guest";
  const initials = getParticipantInitials(name);
  const baseColor = getColorFromInitial(initials[0]);
  const lighterColor = adjustColor(baseColor, 30);
  const darkerColor = adjustColor(baseColor, -35);
  const avatarSize = compact ? "w-10 h-10 text-sm" : "w-14 h-14 text-lg";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`participant-tile relative w-full text-left overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/80 ${
        isSpeaking ? "participant-tile--speaking" : ""
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
      style={{ aspectRatio: "16 / 10" }}
    >
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
            playsInline
            muted
          />
        ) : (
          <div
            className={`${avatarSize} rounded-full flex items-center justify-center font-semibold text-white shadow-lg ring-2 ring-white/10`}
            style={{
              background: `linear-gradient(135deg, ${baseColor}, ${darkerColor})`,
            }}
          >
            {initials}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-2 pb-2 pt-6">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs text-white font-medium truncate capitalize">
            {name}
            {e.isAdmin ? (
              <span className="ml-1 text-[10px] text-indigo-300">Host</span>
            ) : null}
          </span>
          <div className="flex items-center gap-0.5 shrink-0">
            {!e?.isMicrophoneAvailable || e?.microphoneStatus === false ? (
              <i className="fa-solid fa-microphone-slash text-[10px] text-red-400 bg-black/40 rounded p-1" />
            ) : (
              <i className="fa-solid fa-microphone text-[10px] text-emerald-400 bg-black/40 rounded p-1" />
            )}
            {!e?.isCameraAvailable || e?.cameraStatus === false ? (
              <i className="fa-solid fa-video-slash text-[10px] text-red-400 bg-black/40 rounded p-1" />
            ) : (
              <i className="fa-solid fa-video text-[10px] text-slate-300 bg-black/40 rounded p-1" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
