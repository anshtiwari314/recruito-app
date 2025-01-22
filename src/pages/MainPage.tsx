import React, { useState, useEffect, useRef } from "react";
import "./mainpage.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useData } from "../context/DataWrapper";
import { v4 as uuidv4 } from "uuid";
import DisplayLargerComp from "../components/DisplayLargerComp";
import DisplaySmallerComp from "../components/DisplaySmallerComp";
import Msg from "../components/Msg";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import ContentPanel from "@/components/ContentPanel";
import ContentPanelHeader from "@/components/ContentPanelHeader";

//@ts-ignore
export function Tray({
  openSideWindow,
  setOpenSideWindow,
  messagingOn,
  setMessagingOn,
  isMobile,
  toggleRmWindow,
  setToggleRmWindow,
  link,
}) {
  // const [cameraToggle,setCameraToggle ] = useState(true)
  // const [microphoneToggle,setMicroPhoneToggle] = useState(true)
  //@ts-ignore
  const {
    users,
    cameraToggle,
    setCameraToggle,
    microphoneToggle,
    setMicroPhoneToggle,
    screenSharing,
    setScreenSharing,
    isHost,
    stopVideoRecording,
  } = useData();
  const [time, setTime] = useState("");
  //const navigate = useNavigate()
  // const [] = useState()

  function handleLeave(e: { e: any }) {
    //navigate('/leave')
  }
  let styling: any = {
    tray: {
      position: "absolute",

      //border:"0.2rem solid blue",
      transform: "translate(-50%)",
      left: "50%",
      bottom: "1%",
    },
    trayWrapper: {
      width: isMobile === false ? "50vw" : "99vw",
      height: isMobile === false ? "6rem" : "8rem",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-equally",
    },
    iconHolderDiv: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
      backgroundColor: "gray",
      margin: "0 0.1rem",
      fontSize: "2.5rem",
      padding: "0.5rem 0.2rem",

      // justifyContent:"center",
      // alignItems:"center"
    },
    icon: {
      color: "white",
      fontSize: isMobile === false ? "3rem" : "3.5rem",
      margin: "0 1.2rem",
      cursor: "pointer",
    },
    iconRed: {
      color: "white",
      fontSize: "4rem",
    },
  };

  //@ts-ignore
  function timer(hour, min, sec, d) {
    let date2 = new Date();
    var diff = date2.getTime() - d.getTime();

    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    if (hh <= 0) setTime(`${mm}:${ss}`);
    else setTime(`${hh}:${mm}:${ss}`);
  }

  useEffect(() => {
    let d = new Date();
    let intervalId: any;
    intervalId = setInterval(() => {
      timer(d.getHours(), d.getMinutes(), d.getSeconds(), d);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div style={styling.tray}>
      <div style={styling.trayWrapper}>
        <div style={styling.iconHolderDiv}>{time}</div>
        {isHost === true ? (
          <div style={styling.iconHolderDiv}>
            <i
              style={{
                ...styling.icon,
                display: `${toggleRmWindow === true ? "" : "none"}`,
              }}
              className="fa-solid fa-table-cells-large icons"
              id="layoutIcon"
              onClick={() => setToggleRmWindow(false)}
            ></i>
            <i
              style={{
                ...styling.icon,
                display: `${toggleRmWindow === false ? "" : "none"}`,
              }}
              className="fa-solid fa-comment icons"
              id="commentIcon"
              onClick={() => setToggleRmWindow(true)}
            ></i>
          </div>
        ) : null}

        <div style={styling.iconHolderDiv}>
          <i
            style={{
              ...styling.icon,
              display: `${
                users[0]?.isCameraAvailable && cameraToggle === true
                  ? ""
                  : "none"
              }`,
            }}
            className="fa-solid fa-video icons"
            id="vidIcon"
            onClick={() => {
              setCameraToggle(false);
            }}
          ></i>
          <i
            style={{
              ...styling.icon,
              display: `${
                users[0]?.isCameraAvailable && cameraToggle === false
                  ? ""
                  : "none"
              }`,
            }}
            className="fa-solid fa-video-slash icons"
            id="crossVidIcon"
            onClick={() => {
              setCameraToggle(true);
            }}
          ></i>

          <i
            style={{
              ...styling.icon,
              display: `${
                users[0]?.isMicrophoneAvailable && microphoneToggle === true
                  ? ""
                  : "none"
              }`,
            }}
            className="fa-solid fa-microphone icons"
            id="micIcon"
            onClick={() => {
              setMicroPhoneToggle(false);
            }}
          ></i>
          <i
            style={{
              ...styling.icon,
              display: `${
                users[0]?.isMicrophoneAvailable && microphoneToggle === false
                  ? ""
                  : "none"
              }`,
            }}
            className="fa-solid fa-microphone-slash icons"
            id="crossMicIcon"
            onClick={() => {
              setMicroPhoneToggle(true);
            }}
          ></i>
        </div>
        <div style={styling.iconHolderDiv}>
          <i
            style={{ ...styling.icon, display: "" }}
            className="fa-solid fa-message icons"
            id="msgIcon"
            onClick={() => {
              setMessagingOn(true);
              setOpenSideWindow(true);
            }}
          ></i>
          <i
            style={{ ...styling.icon, display: "" }}
            className="fa-solid fa-users icons"
            id="usersIcon"
            onClick={() => {
              setMessagingOn(false);
              setOpenSideWindow(true);
            }}
          ></i>
        </div>
        {isMobile === false ? (
          <div style={styling.iconHolderDiv}>
            <i
              style={{
                ...styling.icon,
                color: "white",
                display: `${screenSharing === false ? "" : "none"}`,
              }}
              className="fa-solid fa-display icons"
              id="screen-sharing"
              onClick={() => {
                setScreenSharing(true);
              }}
            ></i>
            <i
              style={{
                ...styling.icon,
                color: "red",
                display: `${screenSharing === true ? "" : "none"}`,
              }}
              className="fa-brands fa-chromecast"
              id="screen-sharing"
              onClick={() => {
                setScreenSharing(false);
              }}
            ></i>
          </div>
        ) : null}

        <div style={{ ...styling.iconHolderDiv, backgroundColor: "red" }}>
          <span>
            <i
              style={{ ...styling.icon, ...styling.iconRed, display: "" }}
              className="fa-solid fa-xmark icons"
              id="crossIcon"
              //onClick={handleLeave}

              onClick={() => {
                //console.log(`${window.location.protocol})
                //console.log(`${window.location.protocol}//${window.location.host}/leave.html${window.location.href.split('meeting.html')[1]}`)

                //stopVideoRecording();
                window.location.href = `${window.location.protocol}//${
                  window.location.host
                }/leave.html${window.location.href.split("meeting.html")[1]}`;
              }}
            ></i>
          </span>
        </div>
      </div>
    </div>
  );
}
//@ts-ignore
export function SideWindow({
  openSideWindow,
  setOpenSideWindow,
  messagingOn,
  setMessagingOn,
  isMobile,
}) {
  //let [messagingOn,setMessagingOn] = useState<boolean>(false);
  //@ts-ignore
  const ref = useRef<any>(null);
  //@ts-ignore
  const {
    msg,
    setMsg,
    myId,
    name,
    msgArrRef,
    users,
    socket,
    largeVideo,
    setLargeVideo,
  } = useData();
  const [message, setMessage] = useState("");
  const msgRef = useRef("");

  useEffect(() => {
    if (ref.current === null) return;
    // console.log("refffing",ref)
    function onPressEnter(e: any) {
      console.log("keypressed");
      if (e.key === "Enter") {
        e.preventDefault();
        handleMessage();
      }
    }
    ref.current?.addEventListener("keypress", onPressEnter);
    return () => ref.current?.removeEventListener("keypress", onPressEnter);
  });

  function handleMessage() {
    if (socket === null || msgRef.current === "") return;
    //console.log("handle message clicked",socket,socket.connected)
    //send this message to other users
    let tempMsgObj = {
      id: myId,
      msg: msgRef.current,
      name: name,
    };

    msgArrRef.current.push(tempMsgObj);
    //@ts-ignore
    setMsg((prev) => [...msgArrRef.current]);

    msgRef.current = "";
    setMessage("");

    //send this message to other users
    socket.emit("send-msg", msgArrRef.current[msgArrRef.current.length - 1]);
  }

  let styling: any = {
    sideWindow: {
      position: "absolute",
      right:
        isMobile === false
          ? openSideWindow === true
            ? "0"
            : "-20vw"
          : openSideWindow === true
          ? "0"
          : "-100vw",
      top: "0",
      //border:"0.1rem solid blue",
      zIndex: "2",
    },
    sideWindowWrapper: {
      width: isMobile === false ? "20vw" : "100vw",
      height: "100vh",
      backgroundColor: "gray",
      // border:"0.2rem solid blue",
    },
    firstRow: {
      display: "flex",
      justifyContent: "flex-end",
      height: "4rem",
      // border:"0.1rem solid red"
    },
    crossButton: {
      // width:"2rem",
      // height:"1rem",
      //height:"2rem",
      marginRight: "2rem",
      padding: "2rem 2.2rem",
      fontSize: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    secondRow: {
      display: "flex",
      margin: "0 1rem",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-around",
    },
    button: {
      margin: "0.5rem 0",
      padding: "1rem 1.5rem",
      fontSize: "2rem",
      borderRadius: "0.2rem",
      outline: "none",
      border: "none",
    },
    subSideWindow: {
      margin: "2rem 0",
      height: "80%",
      border: "0.5rem solid blue",
    },
    usersWindow: {
      overflowY: "scroll",
      scrollBehaviour: "smooth",
    },
    user: {
      margin: "0.8rem 1rem",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      fontSize: "1.8rem",
      width: isMobile === false ? "80%" : "50%",
      padding: "0rem 0",
      // border:"0.1rem solid red",
    },
    msgWindow: {
      height: "90%",
      border: "0.1rem solid violet",
      overflowY: "scroll",
      scrollBehaviour: "smooth",
    },
    inputWrapper: {
      height: "5rem",
      display: "flex",
      alignItems: "center",
      backgroundColor: "white",
      padding: "0.5rem 0",
    },
    inputBar: {
      height: "100%",
      width: "80%",
      paddingLeft: "1rem",
      outline: "none",
      border: "none",
    },
    sendBtn: {
      width: "20%",
      margin: "0",
      padding: "0",
      height: "4rem",
      // margin:"0.5rem 0",
      // padding:"1rem 1.5rem",
      fontSize: "2rem",
      borderRadius: "1rem",
      outline: "none",
      border: "none",
      backgroundColor: "blue",
      color: "white",
    },
    msg: {
      // border:"0.1rem solid white",
      display: "flex",
      flexDirection: "column",
      margin: "0.5rem 0",
      // alignItems:"end"
    },
    msgWrapper: {
      width: "fit-content",
      // border:"0.1rem solid red",
      padding: "0 1rem",
    },
    incomingWrapper: {
      alignSelf: "start",
    },
    outgoingWrapper: {
      alignSelf: "end",
      textAlign: "right",
    },
    name: {
      letterSpacing: "0.1rem",
      textTransform: "capitalize",
      // border:"0.1rem solid red"
    },
    incoming: {
      padding: "1rem",
      backgroundColor: "silver",
      width: "fit-content",
      borderRadius: "0.5rem",
    },
    outgoing: {
      padding: "1rem",
      backgroundColor: "silver",
      width: "fit-content",
      borderRadius: "0.5rem",
    },
  };
  return (
    <div style={styling.sideWindow} className="side-window">
      <div style={styling.sideWindowWrapper} className="side-window-wrapper">
        <div style={styling.firstRow} className="first-row">
          <button
            style={styling.crossButton}
            onClick={() => setOpenSideWindow(false)}
          >
            <i
              style={{ ...styling.icon, ...styling.iconRed, fontSize: "3rem" }}
              className="fa-solid fa-xmark icons"
              //onClick={handleLeave}
            ></i>
          </button>
        </div>
        <br />
        <br />
        <div style={styling.secondRow} className="second-row">
          <span>users</span>
          <button onClick={() => setMessagingOn(true)}>message</button>
          <button onClick={() => setMessagingOn(false)}>users</button>
        </div>
        {messagingOn === false ? (
          <div
            style={{ ...styling.usersWindow }}
            className="sub-side-window users-window"
          >
            {users.map((e: any, i: number) => {
              return (
                <div className="user" key={i}>
                  <div className="childA">
                    <div className="circle">
                      <p className="text">
                        {e?.name?.substring(0, 2).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="childB">
                    <p className="name">{e?.name}</p>
                    {e.isAdmin === true ? (
                      <p className="host">meeting host</p>
                    ) : null}
                  </div>
                  <div className="childC">
                    {e.id === largeVideo?.id ? (
                      // <span className="material-symbols-outlined" style={{cursor:"pointer"}}>
                      // push_pin
                      // </span>
                      <PushPinIcon
                        style={{ cursor: "pointer", fontSize: "2.5rem" }}
                      />
                    ) : (
                      //fa-light fa-thumbtack pin
                      // <i className="material-symbols-outlined material-symbols-filled"
                      // onClick={()=>setLargeVideo(e)}>
                      // </i>
                      // <span className="material-symbols-rounded"  >
                      // push_pin
                      // </span>
                      <PushPinOutlinedIcon
                        onClick={() => setLargeVideo(e)}
                        style={{ cursor: "pointer", fontSize: "2.5rem" }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="sub-side-window">
            <div className="msgWindow">
              {msg.map((e: any, i: number) => {
                // console.log("msg map",e)
                if (e.id === myId)
                  return (
                    <div key={i} className="chat-msg">
                      <div className="msgWrapper outgoingWrapper">
                        <p
                          className="name"
                          style={{
                            width: "100%",
                            textAlign: "right",
                          }}
                        >
                          you
                        </p>
                        <p className="outgoing">{e.msg}</p>
                      </div>
                    </div>
                  );
                else
                  return (
                    <div key={i} className="chat-msg">
                      <div className="msgWrapper incomingWrapper">
                        <p className="name" style={{ width: "fit-content" }}>
                          {e.name}
                        </p>
                        <p className="incoming">{e.msg}</p>
                      </div>
                    </div>
                  );
              })}

              {/* <p>hi</p>
                  <p>hi</p>
                  <p>hi</p>
                  <p>hi</p> */}
            </div>
            <div className="input-wrapper">
              <input
                style={styling.inputBar}
                placeholder="write your message"
                value={message}
                onChange={(e) => {
                  msgRef.current = e.target.value;
                  setMessage(e.target.value);
                }}
                ref={ref}
              />
              <button className="send-btn" onClick={() => handleMessage()}>
                <i className="fa-solid fa-share"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function RmLayout() {
  //@ts-ignore
  const { cues, cueLoading } = useData();
  return (
    <div className="msg-box" style={{ border: "0.1rem solid red" }}>
      {/* {data && data.map((e:any,i:number)=>{
                    console.log(e)
                    if(e.type ==="TextMsg")
                        return <AddTextMsg data={e} key={i}/>
                    else if(e.type === "SuggestiveMsg")
                        return <AddOnlySuggestiveMsg data={e} key={i}/>
                    else if(e.type === "ImageMsg")
                        return <AddImageMsg data={e} key={i}/>
                    else if(e.type === "InputForm")
                        return <AddInputForm data={e} key={i}/>
                    else if(e.type === "RadioForm")
                        return <AddRadioForm data={e} key={i}/>;
                })} */}

      {cueLoading == true ? (
        <div className="msg-loader-wrapper">
          <img
            src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
            className="msg-loader"
          />
        </div>
      ) : null}
      {cues &&
        cues.map((e: any, i: number) => {
          return <Msg e={e} key={e.id} />;
        })}
      {/* <Msg e={Data} /> */}
    </div>
  );
}

export interface InitialLoadData {
  jobTitle: string;
  jobDescription: string;
  interviewGuide: string;
  preloadedQuestions: string[];
}

export default function MainPage() {
  //@ts-ignore
  const {
    setRoomId,
    users,
    myStream,
    setMob,
    roomId,
    setIsHost,
    setMyId,
    isHostRef,
    normalize,
    setName,
    setValidUrl,
    setCustId,
    adminUrl,
    setAdminUrl,
    videoUploadUrl,
    setVideoUploadUrl,
  } = useData();
  const { link } = useParams();
  // const [searchParams,setSearchParams] = useSearchParams()
  const navigate = useNavigate();
  const [openSideWindow, setOpenSideWindow] = useState<boolean>(false);
  const [messagingOn, setMessagingOn] = useState<boolean>(true);
  const [toggleVideo, setToggleVideo] = useState(true);
  const [toggleAudio, setToggleAudio] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [toggleRmWindow, setToggleRmWindow] = useState(false);
  let meetingDetails: InitialLoadData = {
    jobTitle: "EDI Developer",
    jobDescription: "https://arxiv.org/pdf/2301.12652", //pdf
    interviewGuide: "https://arxiv.org/pdf/2301.12652", //pdf
    preloadedQuestions: [
      "Ask about specific EDI protocols experience",
      "Discuss experience with mapping tools",
      "Probe cloud integration knowledge",
    ],
  };

  function diff_minutes(time2: number, time1: number) {
    var diff = (time2 - time1) / 1000;
    let diff_in_min = diff / 60;
    return Math.abs(Math.round(diff_in_min));
  }

  console.log("Start time", new Date().getTime());

  useEffect(() => {
    // Declare a variable to store the user's name
    let myName: string = "";

    // Check if the user's name is already stored in sessionStorage
    if (sessionStorage.getItem("userName") !== null) {
      // If the name is found, set it using setName function
      setName(sessionStorage.getItem("userName"));
    } else {
      // If the name is not found, prompt the user to enter their name
      while (myName.length < 2) {
        myName = prompt("Please enter your name") ?? "";

        // Alert the user if the entered name is less than 2 characters long
        if (myName.length < 2) alert("Name must have 2 letters long");
      }
      // Set the entered name using setName function
      setName(myName);
      // Store the entered name in sessionStorage
      sessionStorage.setItem("userName", myName);
    }
  }, []);

  useEffect(() => {
    function Resizing() {
      // Use window.innerWidth to get the current viewport width
      if (window.innerWidth < 800) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    // Initial check
    Resizing();

    // Add event listener for window resizing
    window.addEventListener("resize", Resizing);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", Resizing);
    };
  }, []);

  useEffect(() => {
    let params = new URL(window.location.href).searchParams;

    console.log("params", params.get("room_id"));
    if (
      !params.get("room_id")?.trim() ||
      !params.get("cust_id")?.trim() ||
      !params.get("mob")?.trim()
    ) {
      navigate("/404");
    } else {
      let tempId = "";
      //console.log(link,params.get('room_id'),params.get('cust_id'),params.get('mob') )
      setRoomId(params.get("room_id"));
      setMob(params.get("mob"));

      // Determine if the user is the host based on the is_host parameter
      let tempIsHost = params.get("is_host") === "true" ? true : false;
      if (tempIsHost) {
        // If the user is the host, generate a new temporary ID
        tempId = uuidv4();
        // Code block for calling API to fetch interview details like JD, candidate profile, job details, etc.
        // API call to fetch interview details
        // meetingDetails =
      } else {
        // If the user is not the host, use the cust_id as the temporary ID
        tempId = params.get("cust_id") ?? "";
      }

      // Set the cust_id state variable
      setCustId(params.get("cust_id"));
      // Set the myId state variable to the temporary ID
      setMyId(tempId);
      // Set the isHost state variable
      setIsHost(tempIsHost);
      // Update the isHostRef reference to the current host status
      isHostRef.current = tempIsHost;
    }
  }, []);

  //http://localhost:5173/?room_id=123&cust_id=123&mob=123&is_host=true
  //http://localhost:5173/?room_id=123&cust_id=123&mob=123&is_host

  return (
    <div className="overflow-hidden w-screen min-h-screen relative bg-neutral-50">
      {/* App header */}
      <header
        id="header"
        className="w-full bg-white border-b border-neutral-200 px-4 py-3 flex place-items-center justify-between shadow-sm"
      >
        <div className="flex place-items-center space-x-4">
          <div className="h-8 w-[2px] bg-neutral-200"></div>
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=Logo"
            className="h-8"
            alt="Logo"
          />
          <div className="text-md text-neutral-500">Recruiter Copilot</div>
        </div>

        {isHostRef.current && (
          <div className="flex place-items-center space-x-4">
            <button className="flex place-items-center px-3 py-1.5 bg-neutral-50 rounded-full text-md text-neutral-600">
              <i className="fa-solid fa-circle text-green-500 mr-2 text-xs"></i>
              Live
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

      {/* Text bar for loading backend api url */}
      <div className="flex justify-around place-items-center mt-2 bg-white border-b border-neutral-200 shadow-sm">
        <input
          type="text"
          value={adminUrl}
          onChange={(e) => setAdminUrl(e.target.value)}
          placeholder="enter an ngrok url"
          className="p-4 px-12 mx-auto w-1/2 rounded-lg border-2"
        />
      </div>

      {/* Main Content */}
      <main id="main-content" className="flex h-[calc(100vh-120px)]">
        {/* Content Panel */}
        <div id="content-panel" className="grow p-6 overflow-y-auto">
          <ContentPanel
            openSideWindow={openSideWindow}
            isMobile={isMobile}
            toggleRmWindow={toggleRmWindow}
            meetingDetails={meetingDetails}
          />
        
        {/**/}
        </div>

        {/* Right Panel */}
        <div id="right-panel" className="w-80 bg-white border-l border-neutral-200 flex flex-col">

        {/*
          
          <SideWindow
            openSideWindow={openSideWindow}
            setOpenSideWindow={setOpenSideWindow}
            messagingOn={messagingOn}
            setMessagingOn={setMessagingOn}
            isMobile={isMobile}
          />
        */}
        {/*
          <Tray
            openSideWindow={openSideWindow}
            setOpenSideWindow={setOpenSideWindow}
            messagingOn={messagingOn}
            setMessagingOn={setMessagingOn}
            isMobile={isMobile}
            toggleRmWindow={toggleRmWindow}
            setToggleRmWindow={setToggleRmWindow}
            link={link}
          />
          */}
          </div>
      </main>
    </div>
  );
}

