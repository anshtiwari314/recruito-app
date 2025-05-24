import React, { useState, useEffect } from "react";
import NewJobForm from "../components/NewJobForm.tsx";
import OpenJobsTable from "../components/OpenJobsTable.tsx";
import ScheduleMeetingForm from "../components/ScheduleMeetingForm.tsx";
import Button from "../components/ui/Button.tsx";
import CandidateView from "../components/CandidateView.tsx";
import EditJobForm from "../components/EditJobForm.tsx";
import Login from "./Login.tsx";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const [active, setActive] = useState<string>("openJobs");
  const [isReady, setIsReady] = useState<boolean>(false);
  const navigate = useNavigate()

  useEffect(() => {
    const agentId = sessionStorage.getItem("agent_id")
    if (!agentId) {
      navigate('/login')
    }
  }, [])
  
  return (
    <div className="p-4 space-y-6">
      <div className="text-sm text-gray-600">
        Logged in as <strong>{sessionStorage.getItem("username")}</strong>
      </div>
      <div className="text-sm text-gray-600">
        Agent ID: <strong>{sessionStorage.getItem("agent_id")}</strong>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => setActive("newJob")}>Add New Job</Button>
        <Button onClick={() => setActive("openJobs")}>View Open Jobs</Button>
        <Button onClick={() => setActive("scheduleMeeting")}>Schedule Meeting</Button>
      </div>

      {active === "newJob" && <NewJobForm jobId="" />}
      {active === "openJobs" && <OpenJobsTable state={setActive} />}
      {active === "scheduleMeeting" && <ScheduleMeetingForm />}
      {active === "candidate" && <CandidateView state={setActive} />}
      {active === "EditJob" && <EditJobForm />}
      {/* {active==="Login" && <Login state={setActive}/>} */}
    </div>
  );
}
