import React, { useState } from "react";
import ParticipantGrid from "./ParticipantGrid";

type ParticipantGalleryModalProps = {
  participants: any[];
  isOpen: boolean;
  onClose: () => void;
};

export default function ParticipantGalleryModal({
  participants,
  isOpen,
  onClose,
}: ParticipantGalleryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close gallery"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-6xl max-h-[90vh] meeting-panel meeting-glass flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              All Participants
            </h2>
            <p className="text-sm text-slate-400">
              {participants.length} in meeting · paginated for performance
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="control-btn"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="p-4 flex-1 min-h-0 overflow-hidden">
          <ParticipantGrid
            participants={participants}
            columns={4}
            compact
            className="h-full max-h-[calc(90vh-8rem)]"
          />
        </div>
      </div>
    </div>
  );
}

export function useParticipantGallery() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  return {
    galleryOpen,
    openGallery: () => setGalleryOpen(true),
    closeGallery: () => setGalleryOpen(false),
  };
}
