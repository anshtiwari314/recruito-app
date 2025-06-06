import React from "react";
import { RightPanelVideo } from "./RightPanelVideo";
import { RightPanelResource } from "./RightPanelResource";
import { useData } from "../context/DataWrapper";
import { useAppSelector } from "@/store/store";

export default function RightPanel() {
  const { users, selectedUserForLargeVideoRef,useSelectedUserForLargeVideoRef }: any = useData();
  const { isHost } = useAppSelector((state) => state.qpReducer);

  const handleUserSelect = (e: any) => {
    console.log("Selected user for large video:", e);
    useSelectedUserForLargeVideoRef(e);
  };
  return (
    <div
      id="right-panel"
      className="w-2/12 bg-white border-l border-neutral-200 flex flex-col"
    >
      <div className="p-4 border-b border-neutral-200">
        <h2 className="font-semibold mb-4 text-neutral-900">
          Participants ({users.length})
        </h2>
        <div
          className="space-y-4"
          style={{ height: "73.5vh" }}
        >
          {users.map((e, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => handleUserSelect(e)}
              className="cursor-pointer hover:bg-neutral-100 rounded-lg"
            >
              <RightPanelVideo e={e} muted={i === 0} />
            </div>
          ))}
        </div>
      </div>

      {/* {isHost && (
        <div
          id="resources"
          className="flex-grow p-4 overflow-y-auto"
          style={{ height: "20vh" }}
        >
          <h2 className="font-semibold mb-4 text-neutral-900">Resources</h2>
          <div className="space-y-3">
            <RightPanelResource />
          </div>
        </div>
      )} */}
    </div>
  );
}
