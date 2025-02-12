import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
//@ts-ignore
import { useAppSelector } from "@/store/store";
import { setNVclosecall } from "@/reducers/navigationparamReducer";
import { useData } from "../context/DataWrapper";

export default function MeetingPageHeader() {
  const dispatch = useDispatch();

  const { jobTitle } = useAppSelector((state) => state.cuesReducer);
  const { isHost, meetingIsLegit } = useAppSelector((state) => state.qpReducer);
  //@ts-ignore
  const {
    name,
    cameraToggle,
    setCameraToggle,
    microphoneToggle,
    setMicroPhoneToggle,
    setScreenSharing,
  } = useData();
  const [seconds, setSeconds] = useState(0);

  const handleCloseCall = () => {
    const confirmQuit = window.confirm("Are you sure you want to quit?");

    if (confirmQuit) {
      sessionStorage.setItem("exitdone", "true");
      setMicroPhoneToggle(false);
      setCameraToggle(false);
      dispatch(setNVclosecall(true));
      // Include logic here to send audio out along with corresponding ui
      console.log("Closing the call...");
    }
  };

  const shareScreen = () => {
    setScreenSharing((p: boolean) => !p);
    console.log("Sharing the screen...");
  };

  const toggleAudio = () => {
    setMicroPhoneToggle((p: boolean) => !p);
    console.log("toggling the audio...");
  };

  const toggleVideo = () => {
    setCameraToggle((p: boolean) => !p);
    console.log("toggling the video...");
  };

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
    <header
      id="header"
      className="w-full bg-white border-b border-neutral-200 px-4 py-3 flex place-items-center justify-between shadow-sm"
      style={{ height: "10vh" }}
    >
      <div className="flex place-items-center space-x-4">
        <div className="h-8 w-[2px] bg-neutral-200"></div>
        <img
          src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=Logo"
          className="h-8"
          alt="Logo"
        />
        {jobTitle ? (
          <div className="text-md text-neutral-500">
            <div>Interview: {jobTitle}</div>
            <div style={{ textTransform: "capitalize" }}>{name}</div>
          </div>
        ) : (
          <div className="text-md text-neutral-500">Recruiter Copilot</div>
        )}
        {/*<div className="text-md text-neutral-500">Recruiter Copilot</div>*/}
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
          onClick={toggleVideo}
        >
          {cameraToggle ? (
            <i className="fa-solid fa-video fa-lg"></i>
          ) : (
            <i className="fa-solid fa-video-slash fa-lg"></i>
          )}
        </button>
        <button
          className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
          onClick={toggleAudio}
        >
          {microphoneToggle ? (
            <i className="fa-solid fa-microphone fa-lg"></i>
          ) : (
            <i className="fa-solid fa-microphone-slash fa-lg"></i>
          )}
        </button>
        {/*
          <button
            className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-600"
            onClick={shareScreen}
          >
            {screenSharing ? (
              <i className="fa-solid fa-window-close fa-lg"></i>
              
            ) : (
              <i className="fa-solid fa-laptop fa-lg"></i>
            )}
          </button>
          */}
        <div className="h-8 w-[2px] bg-neutral-200"></div>
        <button
          className="px-8 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg flex items-center text-lg"
          onClick={handleCloseCall}
        >
          <i className="fa-solid fa-xmark mr-4 fa-lg"></i>
          End Call
        </button>
      </div>

      {isHost && (
        <div className="flex place-items-center space-x-4">
          <button className="flex place-items-center px-3 py-1.5 bg-neutral-50 rounded-full text-md text-neutral-600">
            <i className="fa-solid fa-circle text-green-500 mr-2 text-xs"></i>
            Live
          </button>
          <button className="flex place-items-center px-3 py-1.5 bg-neutral-50 rounded-full text-md text-neutral-600">
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
      )}
    </header>
  );
}
