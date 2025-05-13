import React, { useState, useEffect } from "react";
import NewJobForm from "../components/NewJobForm.tsx";
import OpenJobsTable from "../components/OpenJobsTable.tsx"
import ScheduleMeetingForm from "../components/ScheduleMeetingForm.tsx"
import Button from "../components/ui/Button.tsx";
import axios from "axios";

export default function MainPage() {
  const getFromSTorage=sessionStorage.getItem("userEmail");
  if(getFromSTorage===null){
    alert("Please login to continue")
    window.location.href="/login"
  }
  const [active,setActive]=useState<string>("newJob");
  const [jobId,setJobId]=useState<string>("");
  const ngrokL="https://e3a8-49-204-210-210.ngrok-free.app";
 
 
  
  const onBtnClick1=(val:string)=>{
    setActive(val);
    
  }
  const onBtnClick2=(val:string)=>{
    setActive(val);
  }
  const onBtnClick3=(val:string)=>{
     setActive(val);
  }
  return (
  <>
   <div className="p-4 space-y-6">
    <div className="flex gap-4">
      <Button onClick={()=>onBtnClick1("newJob")}>
        Add New Job
      </Button>
      <Button onClick={()=>onBtnClick2("openJobs")}>
        View Open Jobs
      </Button>
      <Button onClick={() => onBtnClick3("scheduleMeeting")}>
      Schedule Meeting
      </Button>
    </div>
    {active==="newJob" && <NewJobForm jobId={jobId} />}
    {active==="openJobs" && <OpenJobsTable state={setActive} />}
    {active==="scheduleMeeting" && <ScheduleMeetingForm/>}
   </div>
  </>
  );
}

//job id remove->call from backend to get id ->done
//nothing can be empty ->third can be empty ->done
//ensure saftey of ates and times stuff 
//candidate-id ,job id,customer emai and candidate email 
//cna-backend->done
//jobid  i have ->done
//email id of person who logged in->done
//agent id of person who logged in->backend->done 


