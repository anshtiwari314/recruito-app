import React, { useEffect, useState } from "react";
import { RightPanelResource } from "./RightPanelResource";
import { useData } from "../context/DataWrapper";
import { useAppSelector } from "@/store/store";
import ParticipantGrid from "./meeting/ParticipantGrid";
import ParticipantGalleryModal, {
  useParticipantGallery,
} from "./meeting/ParticipantGalleryModal";

type RightPanelProps = {
  isMobile?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export default function RightPanel({
  isMobile = false,
  onCollapsedChange,
}: RightPanelProps) {
  const { users } = useData();
  const { isHost } = useAppSelector((state) => state.qpReducer);
  const { galleryOpen, openGallery, closeGallery } = useParticipantGallery();
  const [collapsed, setCollapsed] = useState(isMobile);

  const setPanelCollapsed = (value: boolean) => {
    setCollapsed(value);
    onCollapsedChange?.(value);
  };

  useEffect(() => {
    if (isMobile) {
      setPanelCollapsed(true);
    }
  }, [isMobile]);

  if (collapsed) {
    return (
      <>
        <button
          type="button"
          onClick={() => setPanelCollapsed(false)}
          className="w-full h-full min-h-[2.5rem] meeting-glass flex flex-row lg:flex-col items-center justify-center gap-2 shrink-0 transition-colors"
          style={{ color: "var(--meeting-text-muted)" }}
          title="Show participants"
        >
          <i className="fa-solid fa-users" />
          <span className="text-xs font-medium lg:[writing-mode:vertical-rl] lg:rotate-180">
            {users.length} participant{users.length !== 1 ? "s" : ""}
          </span>
          <i className="fa-solid fa-chevron-up lg:hidden text-[10px]" />
          <i className="fa-solid fa-chevron-left hidden lg:inline text-[10px]" />
        </button>
        <ParticipantGalleryModal
          participants={users}
          isOpen={galleryOpen}
          onClose={closeGallery}
        />
      </>
    );
  }

  return (
    <>
      <aside
        id="right-panel"
        className="h-full w-full meeting-glass flex flex-col min-h-0"
      >
        <div
          className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 shrink-0"
          style={{ borderBottom: "1px solid var(--meeting-border)" }}
        >
          <div className="min-w-0">
            <h2 className="app-brand-title truncate">Participants</h2>
            <p className="app-brand-subtitle">{users.length} connected</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {users.length > 12 && (
              <button
                type="button"
                onClick={openGallery}
                className="control-btn control-btn--sm text-xs"
                title="Open gallery view"
              >
                <i className="fa-solid fa-table-cells" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setPanelCollapsed(true)}
              className="control-btn control-btn--sm text-xs"
              title="Collapse panel"
            >
              <i className="fa-solid fa-chevron-down lg:hidden text-[10px]" />
              <i className="fa-solid fa-chevron-right hidden lg:inline text-[10px]" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 p-2 sm:p-3 overflow-hidden">
          <ParticipantGrid
            participants={users}
            columns={isMobile ? 3 : 2}
            compact
            className="h-full"
          />
        </div>

        {isHost && (
          <div
            id="resources"
            className="shrink-0 p-3 sm:p-4 max-h-[22vh] lg:max-h-[28vh] overflow-y-auto meeting-scroll"
            style={{ borderTop: "1px solid var(--meeting-border)" }}
          >
            <h2 className="app-brand-title mb-2 sm:mb-3">Resources</h2>
            <RightPanelResource />
          </div>
        )}
      </aside>

      <ParticipantGalleryModal
        participants={users}
        isOpen={galleryOpen}
        onClose={closeGallery}
      />
    </>
  );
}
