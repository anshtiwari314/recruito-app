import { useEffect, useRef, useState } from "react";
import { useData } from "../context/DataWrapper";

export default function MeetingPageHeaderTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { socket, socket2 }: any = useData();

  const disconnectTimers = useRef<{ [key: string]: NodeJS.Timeout | null }>({
    socket: null,
    socket2: null,
  });

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!socket || !socket2) return;

    const showCustomToast = (msg: string) => {
      setToastMessage(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    const handleDisconnection = (type: "socket" | "socket2") => {
      if (disconnectTimers.current[type]) return;

      disconnectTimers.current[type] = setTimeout(() => {
        setIsLive(false);
        if (type === "socket") {
          showCustomToast("⚠️ Problem with Meeting Server");
        } else {
          showCustomToast("⚠️ Problem with Transcription Server");
        }
      }, 5000);
    };

    const handleReconnection = (type: "socket" | "socket2") => {
      if (disconnectTimers.current[type]) {
        clearTimeout(disconnectTimers.current[type]!);
        disconnectTimers.current[type] = null;
      }
      if (socket.connected && socket2.connected) {
        setIsLive(true);
      }
    };

    socket.on("disconnect", () => handleDisconnection("socket"));
    socket2.on("disconnect", () => handleDisconnection("socket2"));
    socket.on("connect", () => handleReconnection("socket"));
    socket2.on("connect", () => handleReconnection("socket2"));

    return () => {
      socket.off("disconnect");
      socket2.off("disconnect");
      socket.off("connect");
      socket2.off("connect");
    };
  }, [socket, socket2]);

  return (
  <div className="relative inline-block">
 
    <div className="flex place-items-center space-x-4">
      
      <button
        className={`flex place-items-center px-3 py-1.5 rounded-full text-md transition ${
          isLive ? "bg-neutral-50 text-neutral-600" : "bg-red-100 text-red-600"
        }`}
        onMouseEnter={() => {
          if (!isLive) setShowToast(true);
        }}
        onMouseLeave={() => setShowToast(false)}
      >
        <i
          className={`fa-solid fa-circle mr-2 text-xs ${
            isLive ? "text-green-500" : "text-red-500"
          }`}
        ></i>
        {isLive ? "Live" : "Offline"}
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

 
    {showToast && (
      <div className="absolute left-0 mt-2 bg-red-200/80 text-red-800 px-4 py-2 rounded-lg shadow-md backdrop-blur-sm text-sm whitespace-nowrap">
        {toastMessage}
        </div>
      )}
  </div>
);

}
