import { useEffect, useState } from "react";

export default function MeetingPageHeaderTimer() {
  const [seconds, setSeconds] = useState(0);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      //setToday(new Date());
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex place-items-center space-x-4">
      <button className="flex place-items-center px-3 py-1.5 bg-neutral-50 rounded-full text-md text-neutral-600">
        <i className="fa-solid fa-circle text-green-500 mr-2 text-xs"></i>
        Live
      </button>
      <button className="flex items-center justify-center w-24 px-3 py-1.5 bg-neutral-50 rounded-full text-md text-neutral-600">
        <i className="fa-regular fa-clock mr-1"></i>
        {formatTime(seconds)}
      </button>
      <button className="px-3 py-1.5 bg-neutral-50 rounded-full">
        <i className="fa-solid fa-download text-neutral-600"></i>
      </button>
      <button className="px-3 py-1.5 bg-neutral-50 rounded-full">
        <i className="fa-solid fa-ellipsis-vertical text-neutral-600"></i>
      </button>
    </div>
  );
}

