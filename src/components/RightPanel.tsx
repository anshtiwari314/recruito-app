import React from "react";
import { RightPanelVideo } from "./RightPanelVideo";
import { RightPanelResource } from "./RightPanelResource";
import { useData } from "../context/DataWrapper";
import { useAppSelector } from "@/store/store";

export default function RightPanel() {
  const { users } = useData();
  const { isHost } = useAppSelector((state) => state.qpReducer);
  return (
    <div
      id="right-panel"
      className="w-2/12 bg-white border-l border-neutral-200 flex flex-col"
    >
      <div className="p-4 border-b border-neutral-200">
        <h2 className="font-semibold mb-4 text-neutral-900">
          Participants ({users.length})
        </h2>
        <div className="space-y-4">
          {users.map((e, i) => (
            <RightPanelVideo e={e} key={i} muted={i === 0 ? true : false} />
          ))}

          {/* <RightPanelVideo/> */}
        </div>
      </div>
      {isHost && (
        <div id="resources" className="flex-grow p-4 overflow-y-auto">
          <h2 className="font-semibold mb-4 text-neutral-900">Resources</h2>
          <div className="space-y-3">
            <RightPanelResource />
          </div>
        </div>
      )}
    </div>
  );
}

