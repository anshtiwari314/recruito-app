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
  const navigate = useNavigate();

  useEffect(() => {
    const agentId = sessionStorage.getItem("agent_id");
    if (!agentId) {
      navigate("/login");
    }
  }, []);

  const username = sessionStorage.getItem("username");
  const agentId = sessionStorage.getItem("agent_id");

  return (
    <div className="p-6 space-y-6">
  <h1 className="text-2xl font-semibold text-gray-800 ">
    Job Portal Dashboard
  </h1>

  {/* Top Row: Buttons Left, User Info Right */}
  <div className="flex justify-between items-center">
    <div className="flex gap-4">
      <Button onClick={() => setActive("newJob")}>Add New Job</Button>
      <Button onClick={() => setActive("openJobs")}>View Open Jobs</Button>
      <Button onClick={() => setActive("scheduleMeeting")}>Schedule Meeting</Button>
    </div>

    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-300 space-y-1 text-right">
      <div>
        <span className="font-medium">Logged in as:</span> {username}
        <span className="ml-4 font-medium">Agent ID:</span> {agentId}
      </div>
    </div>
  </div>

  {/* Conditional Sections */}
  {active === "newJob" && <NewJobForm jobId="" />}
  {active === "openJobs" && <OpenJobsTable state={setActive} />}
  {active === "scheduleMeeting" && <ScheduleMeetingForm />}
  {active === "candidate" && <CandidateView state={setActive} />}
  {active === "EditJob" && <EditJobForm />}
</div>

  );
}
