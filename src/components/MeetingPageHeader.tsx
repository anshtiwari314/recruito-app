import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
//@ts-ignore
import { useAppSelector } from "@/store/store";
import { setNVclosecall, setNVaudioUploadAnimation } from "@/reducers/navigationparamReducer";
import { useData } from "../context/DataWrapper";
import MeetingPageHeaderTimer from "./MeetingPageHeaderTimer";
import playSound from '../assets/sound-play.gif'
import { useVad } from "../context/VadWrapper";
import LoadingIcons, { 
  Audio, BallTriangle, Bars, Circles, Grid, Hearts, Oval, 
  Puff, Rings, SpinningCircles, TailSpin, ThreeDots 
} from 'react-loading-icons';
import rectLoading from '../assets/reactangle-loading.gif'


export function CameraIcon(){
  
  //@ts-ignore
  const {myStream,cameraToggle,setCameraToggle,enableDisabledCamera}=useData();

  
  const toggleVideo = () => {
    setCameraToggle((p: boolean) => !p);
    console.log("toggling the video...");
  };

  if(myStream===false || myStream===null)
  return (
    <button
              className="py-3 px-6 bg-neutral-200 bg-red-600 rounded-lg text-neutral-700"
              onClick={enableDisabledCamera}
              //disabled={true}
            >
              <i className="fa-solid fa-video-slash fa-lg" style={{color:'white'}}></i>
            </button>
  )
  else{
      return (
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
          )
  }
  
  
}

export function MicIcon(){
  
  //@ts-ignore
  const {manualVadStatus,setManualVadStatus,vadRecordingOn,
    setVadRecordingOn,vadStatus,setVadStatus,vadInstance,VAD2,userSpeaking} = useVad()

  //@ts-ignore
  const {myAudioStream,microphoneToggle,setMicroPhoneToggle,enableDisabledMicrophone}=useData();

  const toggleAudio = () => {
    setMicroPhoneToggle((p: boolean) => !p);
    setManualVadStatus((p) => !p)
    console.log("toggling the audio...");
  };


  //console.log('myAudioStream',myAudioStream,microphoneToggle)

  if(myAudioStream===false || myAudioStream===null)
  return (
    <button
              className="py-3 px-6 bg-neutral-200 bg-red-600 rounded-lg text-neutral-700"
              onClick={enableDisabledMicrophone}
              //disabled={true}
            >
              <i className="fa-solid fa-microphone-slash fa-lg" style={{color:'white'}}></i>
            </button>
  )
  else{
      return (
        <>
        {
          VAD2 !==undefined && !VAD2.loading ? 
            <button
              className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
              onClick={toggleAudio}
             // style={{border:'0.1rem solid red'}}
            >
              {microphoneToggle ? (
                <i className="fa-solid fa-microphone fa-lg"></i>
              ) : (
                <i className="fa-solid fa-microphone-slash fa-lg"></i>
              )}
            </button>
            
            : 
            <div style={{}}>
                <TailSpin stroke="red"  strokeOpacity={1} speed={.95} style={{margin:'2rem'}}/>
            </div>
            }
          </>
          )
  }
  
  
}

export default function MeetingPageHeader() {
  const dispatch = useDispatch();

  const { jobTitle } = useAppSelector((state) => state.cuesReducer);
  const { isHost } = useAppSelector((state) => state.qpReducer);

  const {manualVadStatus,setManualVadStatus,vadRecordingOn,
    setVadRecordingOn,vadStatus,setVadStatus,vadInstance,VAD2,userSpeaking} = useVad()
  //@ts-ignore
  
  //@ts-ignore
  const {
    name,
    
    setCameraToggle,
    microphoneToggle,
    setMicroPhoneToggle,
    setScreenSharing,
    stopVideoRecording,
    setUnreadCount,
    unreadCount,
    chatToggle,setChatToggle,
    screenRecording,setScreenRecording,ngrokServerUrl,setNgrokServerUrl
  }:any = useData();

  async function handleCloseCall() {
    const confirmQuit = window.confirm("Are you sure you want to quit?");

    if (confirmQuit) {
      sessionStorage.setItem("exitdone", "true");
      setMicroPhoneToggle(false);
      setCameraToggle(false);
      dispatch(setNVclosecall(true));
      dispatch(setNVaudioUploadAnimation(true));

     // await stopVideoRecording(); // Wait for recording to stop

      // Include logic here to send audio out along with corresponding ui
      console.log("Closing the call...");
    }
  };

  const shareScreen = () => {
    setScreenSharing((p: boolean) => !p);
    console.log("Sharing the screen...");
  };

  

  

  const toggleScreenRecording = () => {
    setScreenRecording((p:boolean)=>!p)
    console.log("toggling the screen recording...");
  };

  const toggleChatWindow = () => {
    setChatToggle(true)
    console.log(unreadCount)
    // Reset unread count when opening chat
    if (!chatToggle) {
      setUnreadCount(0)
    }
  }

  // useEffect(()=>{
  //   console.log('vad2 loading status',VAD2.loading)
  // },[VAD2.loading])

  return (
    <>
    
    <div style={{textAlign:'center',display:'flex',justifyContent:'space-around',width:'80%',margin:'0 auto'}}>
          <div>
          {/* <FileLoadChecker/> */}
          {VAD2 !==undefined && !VAD2.loading ? (
              <h3 style={{ color: "green",margin:'0.5rem 0',fontWeight:700,textTransform:'capitalize'}}>Vad files are loaded ✅</h3>
            ) : (
              <div style={{display:'flex',alignItems:'center'}}>
              <h3 style={{ color: "red",margin:'0.5rem 0',fontWeight:700,textTransform:'capitalize' }}>Vad is loading Wait...
                
              </h3>
              <img
                    src={rectLoading}
                    style={{height:'2rem',width:'2rem'}}
                  />
              </div>
            )}
          </div>
          <div style={{flex:0.8}}>
          <input
          type="text"
          placeholder="Enter your ngrok url"
          value={ngrokServerUrl}
          onChange={(e)=>setNgrokServerUrl(e.target.value)}
          style={{width: "100%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            outline: "none",
            transition: "border-color 0.3s",}}
          />
          </div>
        </div>
    
    <header
      id="header"
      className="w-full bg-white border-b border-neutral-200 px-4 py-3 flex place-items-center justify-between shadow-sm"
      style={{ height: "10vh" }}
    >
      <div className="flex place-items-center space-x-4" style={{}}>
            
            <div className="h-8 w-[2px] bg-neutral-200"></div>
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=Logo"
              className="h-8"
              alt="Logo"
            />
            {jobTitle ? (
              <div className="text-md text-neutral-500">
                <div>{jobTitle}</div>
                <div style={{ textTransform: "capitalize" }}>{name}</div>
              </div>
            ) : (
              <div className="text-md text-neutral-500"></div>
            )}
            {/*<div className="text-md text-neutral-500">Recruiter Copilot</div>*/}
            
            
          </div>
      
      
      
      
      <div className="flex items-center space-x-4">

            
            <CameraIcon/>

            <MicIcon/>

            
            
            <button
              className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
              onClick={toggleScreenRecording}
            >
              {screenRecording 
              ? 
              <i className="fa-solid fa-circle-dot fa-lg text-red-500 animate-pulse"></i>
              :
              <i className="fa-solid fa-circle-dot fa-lg text-black-500"></i>
              }
              
              
                {/* <i className="fa-solid fa-microphone-slash fa-lg"></i> */}
              
            </button>
     <div className="relative">
             <button 
            className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
            onClick={toggleChatWindow}
            >
              {
                chatToggle ? 
              <i className="fas fa-comment text-black-500 fa-lg" ></i>:
              <i className="far fa-comment text-black-500 fa-lg" ></i>
              }
              {unreadCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-md border border-white z-10 ${
                    chatToggle
                      ? "bg-red-500 animate-pulse"
                      : "bg-red-600 animate-bounce"
                  }`}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            
            </button>
     </div>
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
            
            <div style={{height:'3.5rem',width:'6rem',backgroundColor:'white',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {
                userSpeaking ? 
                <img src={playSound} style={{width:'6rem',height:'3.5rem'}}/>:
                null
              }
              {
                VAD2?.userSpeaking && microphoneToggle ?             
                <img src={playSound} style={{width:'6rem',height:'3.5rem'}}/>:
                null
              }
            {/* <img src={playSound} style={{width:'8rem',height:'4.5rem'}}/> */}

            </div>

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
        <MeetingPageHeaderTimer />
      )}
    </header>
    </>
  );
}
