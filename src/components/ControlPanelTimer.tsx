import { useEffect, useState } from "react";

export default function ControlPanelTimer() {
  const [today, setToday] = useState(new Date());
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Set an interval to update the time every second
    const interval = setInterval(() => {
      setToday(new Date());
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const day = today.toLocaleString("en-US", { weekday: "long" });
  const date = today.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = today.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="flex-col items-center text-md text-neutral-500">
      <div>
        <i className="fa-regular fa-calendar mr-2"></i>
        <span>
          {day}, {date}
        </span>
      </div>
      <div className="flex justify-start mt-1">
        <span>{time}</span>
        <span className="mx-2">•</span>
        <span className="flex items-center">
          <i className="fa-regular fa-clock mr-1"></i>
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  );
}

