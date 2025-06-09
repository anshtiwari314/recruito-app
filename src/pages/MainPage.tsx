import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from "@/context/DataWrapper";
import { v4 as uuidv4 } from "uuid";
import ContentPanel from "@/components/ContentPanel";
import type { QPState } from "@/reducers/queryparamReducer";
import { setQP } from "@/reducers/queryparamReducer";
import { useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import RightPanel from "@/components/RightPanel";
import NotFound from "./NotFoundPage";
import Leave from "./LeavePage";
import MeetingPageHeader from "../components/MeetingPageHeader";

export default function MainPage() {
  //@ts-ignore
  const { setMyId, setName } = useData();
  const { isHost, meetingIsLegit } = useAppSelector((state) => state.qpReducer);
  const { jobTitle } = useAppSelector((state) => state.cuesReducer);
  const { closeCall } = useAppSelector((state) => state.nvReducer);

  const dispatch = useDispatch();
  const [meetingIsLegitMain, setMeetingIsLegitMain] = useState<boolean>(true);
  const { link } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [tempIsHost, setTempIsHost] = useState<boolean | null>(null);

  // Handle viewport resizing
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 800);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (sessionStorage.getItem("exitdone") !== null) {
      setMeetingIsLegitMain(false);
      return;
    }

    const query = window.location.search.slice(1);
    const parts = query.split("&");
    const roomParam = parts[0] || "";
    const candidParam = parts[1] || "";

    // Validate presence
    if (!roomParam.trim() || !candidParam.trim()) {
      setMeetingIsLegitMain(false);
      return;
    }

    // Store in local state if needed
    // e.g., setRoomId(roomParam); setCandid(candidParam);

    // Get or prompt user name
    let myName = sessionStorage.getItem("userName") ?? "";
    if (myName.length < 2) {
      while (myName.length < 2) {
        myName = prompt("Please enter your name") ?? "";
        if (myName.length < 2) alert("Name must be at least 2 characters");
      }
      sessionStorage.setItem("userName", myName);
    }
    setName(myName);

    // Authentication flow
    const checkLogin = async () => {
      try {
        const res1 = await fetch(
          "https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/check-jarvis-login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client: "recruito", userid: myName }),
          }
        );
        const data1 = await res1.json();
        if (!data1.result) return { isAuthenticated: false };

        const password = prompt("Please provide the password") ?? "";
        sessionStorage.setItem("userPassword", password);
        const res2 = await fetch(
          "https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/check-jarvis-login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client: "recruito", userid: myName, password }),
          }
        );
        const data2 = await res2.json();
        return { isAuthenticated: data2.result === true };
      } catch (err) {
        console.error(err);
        return { isAuthenticated: false };
      }
    };

    const initialize = async () => {
      const login = await checkLogin();
      if (!isMounted) return;
      setTempIsHost(login.isAuthenticated);

      // Fetch agent ID
      let agentId = "";
      try {
        const agentRes = await fetch(
          "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis/main_router",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              trigger_func: "get_agent_id",
              params: { user_name: myName, password: sessionStorage.getItem("userPassword") ?? "" },
            }),
          }
        );
        const agentData = await agentRes.json();
        if (agentData.agentid) {
          agentId = agentData.agentid;
          sessionStorage.setItem("agent_id", agentId);
        }
      } catch (err) {
        console.error("Failed to fetch agent id:", err);
      }

      // Dispatch query params
      const qParams: QPState = {
        roomId: roomParam,
        candid: candidParam,
        agentId,
        isHost: login.isAuthenticated,
        name: myName,
        meetingIsLegit: true,
      };
      dispatch(setQP(qParams));
      setMyId(uuidv4());
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Warn on tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  //http://localhost:5173/?a109-4dbd-8a2a&cid_7761
  return (
    <>
      {tempIsHost === null ? (
        "Authenticating ..."
      ) : meetingIsLegitMain ? (
        closeCall ? (
          <Leave />
        ) : (
          <div className="overflow-y-auto w-screen min-h-screen relative bg-neutral-50" style={{ height: '85vh', width: '100vw' }}>
            <MeetingPageHeader />
            <main id="main-content" className="flex h-[calc(100vh-120px)]">
            {/* grow w-10/12 p-6 */}
              <div id="content-panel" className="relative grow w-10/12 px-3 py-4 overflow-y-hidden" >
                <ContentPanel isMobile={isMobile} />
              </div>
              <RightPanel />
            </main>
          </div>
        )
      ) : (
        <NotFound />
      )}
    </>
  );
}
