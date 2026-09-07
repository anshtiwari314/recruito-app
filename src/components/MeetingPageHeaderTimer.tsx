import { useEffect, useState } from "react";

export default function MeetingPageHeaderTimer() {
  const [seconds, setSeconds] = useState(0);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tabular-nums"
        style={{
          background: "rgba(74, 222, 128, 0.12)",
          border: "1px solid rgba(74, 222, 128, 0.28)",
          color: "var(--meeting-success)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: "var(--meeting-success)" }}
        />
        Live
      </span>
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tabular-nums app-brand-subtitle"
        style={{
          background: "var(--meeting-surface-elevated)",
          border: "1px solid var(--meeting-border)",
        }}
      >
        <i className="fa-regular fa-clock" />
        {formatTime(seconds)}
      </span>
    </div>
  );
}
