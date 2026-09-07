import React, { useMemo, useState } from "react";
import ParticipantTile from "./ParticipantTile";

const PAGE_SIZE = 24;

type ParticipantGridProps = {
  participants: any[];
  mutedFirst?: boolean;
  columns?: 2 | 3 | 4;
  showSearch?: boolean;
  showPagination?: boolean;
  compact?: boolean;
  className?: string;
  onParticipantClick?: (participant: any, index: number) => void;
};

export default function ParticipantGrid({
  participants,
  mutedFirst = true,
  columns = 3,
  showSearch = true,
  showPagination = true,
  compact = true,
  className = "",
  onParticipantClick,
}: ParticipantGridProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return participants;
    return participants.filter((p) => p?.name?.toLowerCase().includes(query));
  }, [participants, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  const visible = useMemo(() => {
    if (!showPagination) return filtered;
    const start = safePage * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage, showPagination]);

  const gridCols =
    columns === 4
      ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
      : columns === 2
        ? "grid-cols-2"
        : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      {showSearch && (
        <div className="relative mb-3 shrink-0">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--meeting-text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search participants..."
            className="landing-input pl-9"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-500 py-8">
          No participants found
        </div>
      ) : (
        <div
          className={`grid ${gridCols} gap-2 overflow-y-auto meeting-scroll flex-1 min-h-0 content-start`}
        >
          {visible.map((participant, index) => {
            const globalIndex = safePage * PAGE_SIZE + index;
            return (
              <ParticipantTile
                key={participant.id || `${participant.name}-${globalIndex}`}
                participant={participant}
                muted={mutedFirst && globalIndex === 0}
                compact={compact}
                onClick={
                  onParticipantClick
                    ? () => onParticipantClick(participant, globalIndex)
                    : undefined
                }
              />
            );
          })}
        </div>
      )}

      {showPagination && filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-700/50 shrink-0">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
          >
            Previous
          </button>
          <span className="text-xs text-slate-400 tabular-nums">
            {safePage + 1} / {totalPages}
            <span className="text-slate-600 mx-1">·</span>
            {filtered.length} total
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export { PAGE_SIZE };
