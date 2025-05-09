import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import Button from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { useDispatch } from "react-redux";
import { addJob } from "../reducers/jobSlices";


export default function NewJobForm() {
  const dispatch = useDispatch();
  const [jobId, setJobId] = useState("123456"); 
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobCriteria, setJobCriteria] = useState("");
  const [isValid, setIsValid] = useState(false);

 
  useEffect(() => {
    const fetchJobId = async () => {
      try {
        const res = await fetch("/api/jobs/new-id"); 
        if (!res.ok) {
          throw new Error(`Error fetching job ID: ${res.status}`);
        }
        const data = await res.json();
        setJobId(data.id); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobId();
  }, []);

  useEffect(() => {
    if (
      jobId &&
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

      setJobTitle("");
      setJobDesc("");
      setJobCriteria("");
      alert("Job created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating job, check console.");
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
