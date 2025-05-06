import React, { useState } from "react";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import Button from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { useDispatch } from "react-redux";
import { addJob } from "../reducers/jobSlices";

export default function NewJobForm() {
  const dispatch=useDispatch();
  const [jobId, setJobId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobCriteria, setJobCriteria] = useState("");

 
  const onBtnClick = async () => {
    if (!jobId || !jobTitle || !jobDesc || !jobCriteria) {
      alert("Please fill in all fields.");
      return;
    }
    const payload = {
      id: jobId,
      title: jobTitle,
      description: jobDesc,
      criteria: jobCriteria,
    };
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("Job Created:", data);
      setJobId("");
      setJobTitle("");
      setJobDesc("");
      setJobCriteria("");
      alert("Job created successfully!"); 
    } catch (err) {
      console.error(err);
      alert("Error creating job, check console.");
    }finally{
      // Optionally, you can dispatch an action to update the Redux store here
      dispatch(addJob({id: jobId, title: jobTitle, description: jobDesc, criteria: jobCriteria})); // Assuming you have an action creator for adding a job
      //  // Assuming you have an action creator for adding a job
    }
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Create New Job</h2>
        <div className="space-y-4">
          <Input
            placeholder="Job ID"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          />
          <Input
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Textarea
            placeholder="Job Description"
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
          <Button onClick={onBtnClick}>Create Job</Button>
        </div>
      </CardContent>
    </Card>
  );
}
