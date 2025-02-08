import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from "@/context/DataWrapper";
import { v4 as uuidv4 } from "uuid";
import ContentPanel from "@/components/ContentPanel";
import type { QPState } from "@/reducers/queryparamReducer";
import { setQP } from "@/reducers/queryparamReducer";
import { useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import ControlPanel from "@/components/ControlPanel";
import RightPanel from "@/components/RightPanel";
import NotFound from "./NotFoundPage";
import Leave from "./Leave";

export default function MainPage() {
  //@ts-ignore
  const { setMyId, setName, setCustId } = useData();
  const { isHost, meetingIsLegit } = useAppSelector((state) => state.qpReducer);
  const { jobTitle } = useAppSelector((state) => state.cuesReducer);
  const { closeCall } = useAppSelector((state) => state.nvReducer);

  const dispatch = useDispatch();
  const [meetingIsLegitMain, setMeetingIsLegitMain] = useState<boolean>(true);

  const { link } = useParams();
  // const [searchParams,setSearchParams] = useSearchParams()
  const [isMobile, setIsMobile] = useState(false);
  const [tempIsHost, settempIsHost] = useState<boolean | null>(null);

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
    let isMounted = true;

    if (sessionStorage.getItem("exitdone") !== null) {
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
      // Determine if the user is the host based on api calls by first fetching name of user and then authenticating password
      let myName: string = "";
      myName = sessionStorage.getItem("userName") ?? "";

      // Check if the user's name is already stored in sessionStorage
      if (myName.length > 2) {
        // If the name is found, set it using setName function
        setName(myName);
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

      const checkLogin = async () => {
        // ✅ Step 1. Make a post api call here to check if user is present in server database -
        try {
          const response = await fetch(
            "https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/check-jarvis-login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ client: "recruito", userid: myName }),
            }
          );

          const data = await response.json();
          // ✅ Step 2: If the user exists, check the password
          if (data.result === true) {
            let password = prompt("Please provide the password") ?? "";
            const passwordResponse = await fetch(
              "https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/check-jarvis-login",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  client: "recruito",
                  userid: myName,
                  password,
                }),
              }
            );

            const passwordData = await passwordResponse.json();

            return { isAuthenticated: passwordData.result === true };
          } else {
            return { isAuthenticated: false };
          }
        } catch (error) {
          console.error("Error:", error);
          return { isAuthenticated: false };
        }
      };

      // Call async checkLogin function here
      const checkLoginData = async () => {
        const loginResult = await checkLogin(); // Wait for checkLogin to complete
        if (isMounted) {
          settempIsHost(loginResult?.isAuthenticated ?? false);
          const qParams: QPState = {
            roomId: params.get("room_id") ?? "",
            jobId: params.get("job_id") ?? "",
            custEmailId: params.get("cust_email_id") ?? "",
            agentId: params.get("agent_id") ?? "",
            isHost: loginResult?.isAuthenticated ?? false,
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
      };

      checkLoginData();
    }

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks
    };
  }, []);

  /* Executes beforeunload */
  useEffect(() => {
    function executeBeforeTabClose(e: BeforeUnloadEvent) {
      e.preventDefault();
      // Some browsers require returnValue, even though it's deprecated
      if ("returnValue" in e) {
        e.returnValue = ""; // Still required for confirmation dialog
      }
      return ""; // Some TypeScript versions require an explicit return
    }

    window.addEventListener("beforeunload", executeBeforeTabClose);

    return () => {
      window.removeEventListener("beforeunload", executeBeforeTabClose);
    };
  }, []);

  //http://localhost:5173/?room_id=abc-123-fgh-456&cust_email_id=saurabhahlawat89@gmail.com&agent_id=1234&job_id=1

  return (
    <>
      {tempIsHost === null ? (
        "Authenticating ..."
      ) : meetingIsLegitMain ? (
        closeCall ? (
          <Leave />
        ) : (
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
                  <div className="text-md text-neutral-500">
                    Interview: {jobTitle}
                  </div>
                ) : (
                  <div className="text-md text-neutral-500">
                    Recruiter Copilot
                  </div>
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
              <div
                id="content-panel"
                className="relative grow w-10/12 p-6 overflow-y-auto"
              >
                <ContentPanel isMobile={isMobile} />

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
        )
      ) : (
        <NotFound />
      )}
    </>
  );
}

