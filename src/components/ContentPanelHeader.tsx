import { useEffect, useState } from "react";

export default function ContentPanelHeader({ jobTitle }: { jobTitle: string }) {
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

  const day = today.toLocaleString('en-US', { weekday: 'long' });
  const date = today.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="mb-6 flex justify-between items-start">
      <div>
        <h1 className="p-0 text-2xl font-semibold mb-2 text-neutral-900">
          Interview: {jobTitle}
        </h1>
        <div className="flex items-center text-md text-neutral-500">
          <i className="fa-regular fa-calendar mr-2"></i>
          <span>{day}, {date}</span>
          <span className="mx-2">•</span>
          <span>{time}</span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <i className="fa-regular fa-clock mr-1"></i>{formatTime(seconds)}
          </span>
        </div>
      </div>
      <button className="px-4 py-2 bg-neutral-600 text-white rounded-lg text-md font-medium hover:bg-neutral-700">
        End Interview
      </button>
    </div>
  );
}
