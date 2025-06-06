import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/store";
import { FaTimes } from "react-icons/fa";
import { useData } from "../context/DataWrapper";

const DraggableLiveTranscription = () => {
  const [position, setPosition] = useState({ x: 120, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const { transcriptionToggle, setTranscriptionToggle }: any = useData();
  const windowRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [transcriptions] = useAppSelector((state) => [state.trcpReducer.TranscriptionList]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return;
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (!transcriptionToggle) return null;

  return (
    <div
      ref={windowRef}
      className="fixed bg-white rounded-xl shadow-2xl border border-gray-300 z-50 flex flex-col w-[420px] h-[520px] select-none"
      style={{ top: position.y, left: position.x, cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 text-white px-5 py-3 rounded-t-xl flex justify-between items-center"
        onMouseDown={handleMouseDown}
      >
        <h2 className="font-semibold text-lg tracking-wide">Live Transcription</h2>
        <button
          className="text-white hover:text-whitesmoke-400 transition-colors"
          onClick={() => setTranscriptionToggle(false)}
          aria-label="Close live transcription"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 bg-white rounded-b-xl scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
        {transcriptions.length === 0 ? (
          <p className="text-center text-gray-400 italic">No transcriptions yet...</p>
        ) : (
          transcriptions.map((transcription, i) => <SingleTranscription data={transcription} key={i} />)
        )}
      </div>
    </div>
  );
};

export default DraggableLiveTranscription;

export function SingleTranscription({ data }: { data: any }) {
  return (
    <div className="flex w-full items-start space-x-3">
      <img
        src={
          data.isCandidate
            ? "https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=VA"
            : "https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=INT"
        }
        className="w-10 h-10 rounded-full object-cover"
        alt="avatar"
        loading="lazy"
      />
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-indigo-900 font-semibold text-sm">{data?.speaker}</span>
          <span className="text-gray-400 text-xs font-mono">{data?.timeStamp}</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{data?.transcription}</p>
      </div>
    </div>
  );
}
