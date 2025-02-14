import React,{ useState } from "react";
import { useData } from "@/context/DataWrapper";
import { useNavigate } from "react-router-dom";
import ControlPanelTimer from "@/components/old-ControlPanelTimer";
import { useDispatch } from "react-redux";
import { setNVclosecall } from "@/reducers/navigationparamReducer";

export default function ControlPanel() {
  const dispatch = useDispatch();
  
  //@ts-ignore
  const {users,cameraToggle,setCameraToggle ,microphoneToggle,setMicroPhoneToggle,screenSharing,setScreenSharing,isHost,stopVideoRecording} = useData()
  
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
    setScreenSharing((p:boolean)=>!p)
    console.log("Sharing the screen...");
  };

  const toggleAudio = () => {
    setMicroPhoneToggle((p:boolean)=>!p)
    console.log("toggling the audio...");
  };

  const toggleVideo = () => {
   setCameraToggle((p:boolean)=>!p)
    console.log("toggling the video...");
  };

  return (
    <div
      id="control-panel"
      className="w-full bg-white border-t border-neutral-200 shadow-lg"
    >
      <div className="flex items-center justify-between px-6 py-3">
        <ControlPanelTimer />
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
        <div className="flex items-center space-x-4">
          <button className="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
            <i className="fa-solid fa-hand fa-lg"></i>
          </button>
          <button className="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
            <i className="fa-solid fa-gear fa-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

