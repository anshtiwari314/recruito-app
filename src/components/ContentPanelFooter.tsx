import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";
import { useData } from "../context/DataWrapper";

export default function ContentPanelFooter() {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //@ts-ignore
  const { socket2 } = useData();
  const { jobId, roomId, agentId, name } = useAppSelector(
    (state) => state.qpReducer
  );

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const handleSendNotes = () => {
    setLoading(true);
    setStatus(null);

    let data = {
      jobid: jobId,
      roomid: roomId,
      agentid: agentId,
      agent_name: name,
      notes,
      candidateid: "abc123",
    };

    socket2.emit("recruiter_notes_req", data);
    setLoading(false);

    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        setStatus("success");
        setNotes("");
      } else {
        setStatus("error");
      }
    }, 2000);
  };

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div id="ai-query" className="shrink-0 mt-3">
      <div className="meeting-panel p-3">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Session notes
            </label>
            <textarea
              placeholder="Capture key observations, follow-ups, or candidate notes..."
              className="w-full p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 resize-none max-h-[120px] text-sm meeting-scroll"
              value={notes}
              onChange={handleNotesChange}
              disabled={loading}
              rows={2}
            />
          </div>
          <button
            className="shrink-0 h-11 w-11 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors"
            onClick={handleSendNotes}
            disabled={loading || !notes.trim()}
            title="Send notes"
          >
            {loading ? (
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            ) : (
              <i className="fa-solid fa-paper-plane" />
            )}
          </button>
        </div>
        {status === "success" && (
          <p className="mt-2 text-xs text-emerald-400">Notes sent successfully</p>
        )}
        {status === "error" && (
          <p className="mt-2 text-xs text-red-400">
            Failed to send notes. Try again.
          </p>
        )}
      </div>
    </div>
  );
}
