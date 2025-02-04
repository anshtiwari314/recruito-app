import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from "@/context/DataWrapper";
import { v4 as uuidv4 } from "uuid";
import ContentPanel from "@/components/ContentPanel";
import type { CuesDataType } from "@/reducers/cuesReducer";
import { setCues } from "@/reducers/cuesReducer";
import type { QPState } from "@/reducers/queryparamReducer";
import { setQP } from "@/reducers/queryparamReducer";
import { useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import ControlPanel from "@/components/ControlPanel";
import RightPanel from "@/components/RightPanel";
import NotFound from "./NotFoundPage";

export default function MainPage() {
  //@ts-ignore
  const {
    setMyId,
    setName,
    setCustId,
  } = useData();
  const { isHost, meetingIsLegit } = useAppSelector((state) => state.qpReducer);
  const { jobTitle } = useAppSelector( (state) => state.cuesReducer);
  const dispatch = useDispatch();
  const [meetingIsLegitMain, setMeetingIsLegitMain] = useState<boolean>(true);

  const { link } = useParams();
  // const [searchParams,setSearchParams] = useSearchParams()
  const [messagingOn, setMessagingOn] = useState<boolean>(true);
  const [toggleVideo, setToggleVideo] = useState(true);
  const [toggleAudio, setToggleAudio] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  let tempIsHost = false;
  
  

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

    if (
      sessionStorage.getItem("exitdone") !== null
    ) {
      setMeetingIsLegitMain(false);
      return;
    }

    if (
      !params.get("room_id")?.trim() ||
      !params.get("cust_email_id")?.trim() ||
      !params.get("agent_id")?.trim() ||
      !params.get("job_id")?.trim()
    ) {
      setMeetingIsLegitMain(false);
    } else {
      // Determine if the user is the host based on the is_host parameter
      tempIsHost = params.get("is_host") === "true" ? true : false;
      const qParams: QPState = {
        roomId: params.get("room_id") ?? "",
        jobId: params.get("job_id") ?? "",
        custEmailId: params.get("cust_email_id") ?? "",
        agentId: params.get("agent_id") ?? "",
        isHost: tempIsHost,
        name: sessionStorage.getItem("userName") ?? "",
        meetingIsLegit: true,
      };
      // Set the query params state for this meeting
      dispatch(setQP(qParams));
      // Set the cust_email_id state variable
      setCustId(params.get("cust_email_id"));
      // Set the myId state variable to the temporary ID
      setMyId(uuidv4());
    }
  }, []);

  useEffect(() => {
    if (meetingIsLegitMain) {
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
    }
  }, [meetingIsLegit]);

  

  useEffect(() => {
    if (tempIsHost && meetingIsLegit) {
      // Code block for calling API to fetch interview details like JD, candidate profile, job details, etc.
      // API call to fetch interview details
      // meetingDetails =

      // dispatch(
      //   setCues({
      //     CuesList: meetingDetails.preloadedQuestions,
      //     interviewGuide: meetingDetails.interviewGuide,
      //     jobDescription: meetingDetails.jobDescription,
      //     jobTitle: meetingDetails.jobTitle,
      //   })
      // );
      
    }
  }, [meetingIsLegit]);

  //http://localhost:5173/?room_id=123&cust_email_id=saurabhahlawat89@gmail.com&agent_id=43123&job_id=123&is_host=true
  //http://localhost:5173/?room_id=123&cust_email_id=saurabhahlawat89@gmail.com&agent_id=43123&job_id=123&is_host=false

  return (
    <>
      {meetingIsLegitMain ? (
        <div className="overflow-y-auto w-screen min-h-screen relative bg-neutral-50">
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
              {jobTitle ? (
                <div className="text-md text-neutral-500">Interview: {jobTitle}</div>
              ) : (
                <div className="text-md text-neutral-500">Recruiter Copilot</div>
              )}
              {/*<div className="text-md text-neutral-500">Recruiter Copilot</div>*/}
            </div>

            {isHost && (
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

          {/* Main Content */}
          <main id="main-content" className="flex h-[calc(100vh-120px)]">
            {/* Content Panel */}
            <div id="content-panel" className="relative grow w-10/12 p-6 overflow-y-auto">
              <ContentPanel
                isMobile={isMobile}
              />

              {/**/}
            </div>

            {/* Right Panel */}
            <RightPanel />

            
          </main>
          <footer
            id="footer"
            className="fixed bottom-0 w-full bg-white border-t border-neutral-200"
          >
            <ControlPanel />
          </footer>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
}

