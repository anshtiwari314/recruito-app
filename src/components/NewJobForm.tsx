import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import Button from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { useDispatch } from "react-redux";
import { addJob } from "../reducers/jobSlices";
import axios from "axios";


export default function NewJobForm(jobID:string) {
  const dispatch = useDispatch();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobCriteria, setJobCriteria] = useState("");
  const [isValid, setIsValid] = useState(false);
  const ngrokL="https://bbbf-49-204-210-210.ngrok-free.app";
   const [jobId, setJobId] = useState(""); 
   const getJobId=async()=>{
    try {
    const res = await axios.post(`${ngrokL}/create_new_jobid`);
    
    const newJobId = res.data?.new_job_id;

    if (newJobId) {
      setJobId(newJobId); 
    } else {
      console.error("new_job_id not found in response", res.data);
    }
  } catch (error) {
    console.error("Error fetching job ID:", error);
   }
  }
  useEffect(() => {
    getJobId();
  }, []);
  
  useEffect(() => {
    if (
      jobTitle.trim().length >= 8 &&
      jobDesc.trim().length > 15
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [jobId, jobTitle, jobDesc, jobCriteria]);

 const onBtnClick = async () => {
  if (!isValid) {
    alert("Please fill all fields with valid values.");
    return;
  }

  const payload = {
    id: jobId,
    title: jobTitle,
    description: jobDesc,
    criteria: jobCriteria,
  };

  try {
    const res = await axios.post(`${ngrokL}/add_new_job`, {
      job_id: jobId,
      job_title: jobTitle,
      job_description: jobDesc,
      key_criteria: jobCriteria,
    },{
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200 && res.data.created_newjob === "Success") {
      console.log("Job Created:", res.data);

      setJobTitle("");
      setJobId("");
      setJobDesc("");
      setJobCriteria("");

      alert("Job created successfully!");
    } else {
      alert("Failed to create job.");
    }

  } catch (err) {
    console.error("Error while creating job:", err);
    alert("Failed to create job.");
  } finally {
    dispatch(addJob(payload));
  }
};


  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Create New Job</h2>
        <div className="space-y-4">
          <Input
            value={`Job ID: ${jobId}`}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
          <Input
            placeholder="Job Title (min 8 chars)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Textarea
            placeholder="Job Description (min 10 chars)"
            rows={4}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <Textarea
            placeholder="Key Criteria (Skills, experience, etc.)"
            rows={4}
            value={jobCriteria}
            onChange={(e) => setJobCriteria(e.target.value)}
          />
          <Button
            onClick={onBtnClick}
            className={` ${isValid ? "" : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"}`}
          >
            Create Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
//resume ->form /data -> pdf[bytes format]