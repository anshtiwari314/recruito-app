import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
//@ts-ignore
import { useAppSelector } from "../store/store";
import {
  setNVclosecall,
  setNVaudioUploadAnimation,
} from "../reducers/navigationparamReducer";
import { useData } from "../context/DataWrapper";
import MeetingPageHeaderTimer from "./MeetingPageHeaderTimer";
import {
  clearAllUsersActions,
  toggleCameraAction,
  toggleMicrophoneAction,
} from "../reducers/usersReducer";
import myStateReducer from "../reducers/myStateReducer";
import { usePeerWrapper } from "../context/PeerWrapper";

export default function MeetingPageHeader() {
  const dispatch = useDispatch();
  const meUser=useAppSelector((state)=>state.myStateReducer);
  console.log(meUser,"[[DEBUG]]");
  
  const { jobTitle } = useAppSelector((state) => state.cuesReducer);
  const { isHost } = useAppSelector((state) => state.qpReducer);

  const { screenRecording, setScreenRecording }: any = useData();
  const {}=usePeerWrapper()
  //@ts-ignore

  const { name, myId, setScreenSharing, stopVideoRecording }: any = useData();
  const incomingUsers = useAppSelector((state) => state.usersReducer);
  console.log(incomingUsers);
  const theCurrentUser = incomingUsers.find((user) => user.id === myId);
  async function handleCloseCall() {
    const confirmQuit = window.confirm("Are you sure you want to quit?");
    console.log(confirmQuit);
    if (confirmQuit) {
      sessionStorage.setItem("exitdone", "true");
      dispatch(toggleMicrophoneAction({ id: myId }));
      dispatch(toggleCameraAction({ id: myId }));
      dispatch(setNVclosecall(true));
      dispatch(setNVaudioUploadAnimation(true));
      // await stopVideoRecording();
      dispatch(clearAllUsersActions());
      console.log("Closing the call...");
    }
  }

  const shareScreen = () => {
    setScreenSharing((p: boolean) => !p);
    console.log("Sharing the screen...");
  };

  const toggleAudio = () => {
    dispatch(toggleMicrophoneAction({ id: meUser.id }));
    console.log("Toggling The Audio");
    console.log(incomingUsers)
  };

  const toggleVideo = () => {
    dispatch(toggleCameraAction({ id: meUser.id}));
    console.log("Toggling The Video");
    console.log(incomingUsers)
  };

  const toggleScreenRecording = () => {
    setScreenRecording((p: boolean) => !p);
    console.log("toggling the screen recording...");
  };

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
          {meUser?.cameraStatus ? (
            <i className="fa-solid fa-video fa-lg"></i>
          ) : (
            <i className="fa-solid fa-video-slash fa-lg"></i>
          )}
        </button>
        <button
          className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
          onClick={toggleAudio}
        >
          {meUser?.microphoneStatus ? (
            <i className="fa-solid fa-microphone fa-lg"></i>
          ) : (
            <i className="fa-solid fa-microphone-slash fa-lg"></i>
          )}
        </button>

        <button
          className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
          onClick={toggleScreenRecording}
        >
          {screenRecording ? (
            <i className="fa-solid fa-circle-dot fa-lg text-red-500 animate-pulse"></i>
          ) : (
            <i className="fa-solid fa-circle-dot fa-lg text-gray-500"></i>
          )}

          {/* <i className="fa-solid fa-microphone-slash fa-lg"></i> */}
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

      {isHost && <MeetingPageHeaderTimer />}
    </header>
  );
}
