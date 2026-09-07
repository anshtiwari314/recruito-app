import React from "react";
import { useAppSelector } from "@/store/store";

export function RightPanelResource() {
  const { jobDescription } = useAppSelector((state) => state.cuesReducer);

  return (
    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-file-lines text-indigo-400 text-sm" />
            <div className="text-sm font-medium text-slate-200">
              Knowledge Base
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            Call Script & FAQs
          </div>
        </div>
        <a
          href={jobDescription}
          target="_blank"
          rel="noopener noreferrer"
          className="control-btn !w-9 !h-9 shrink-0 text-indigo-300 hover:text-indigo-200"
          title="Download resources"
        >
          <i className="fa-solid fa-download text-sm" />
        </a>
      </div>
    </div>
  );
}
