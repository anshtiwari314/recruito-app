import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import Button from "./ui/Button";
import { useDispatch } from "react-redux";
import { addJob, updateJob } from "../reducers/jobSlices";
import axios from "axios";
import { useTestWrapper } from "../context/TestWrapper";

export interface ApiJob {
  jobid: string;
  title: string;
  job_description: string;
  key_criteria: string;
  sample_questions: string[];
  candidate_data: {
    email: string;
    name: string;
    status: string;
    score: number;
    candidate_id: string;
    meeting_link: string;
  }[];
}

export default function EditJobForm() {
  const dispatch = useDispatch();
  const { jobIdRef, cameForEdit } = useTestWrapper();
  const API_BASE =
    "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis";

  const [apiJobs, setApiJobs] = useState<ApiJob[]>([]);
  const [jobId, setJobId] = useState<string | null>(jobIdRef.current);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDesc, setJobDesc] = useState<string>("");
  const [jobCriteria, setJobCriteria] = useState<string>("");
  const [qs, setQs] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.post(
          `${API_BASE}/jobs-list`,
          { agent_id: "1234" },
          { headers: { "Content-Type": "application/json" } }
        );
        if (res.status === 200) setApiJobs(res.data.job_data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  
  useEffect(() => {
    if (cameForEdit.current && apiJobs.length) {
      const job = apiJobs.find((j) => j.jobid === jobIdRef.current);
      if (job) {
        setJobId(job.jobid);
        setJobTitle(job.title);
        setJobDesc(job.job_description);
        setJobCriteria(job.key_criteria);
        setQs(job.sample_questions);
      }
    }
  }, [apiJobs, cameForEdit, jobIdRef]);

  
  useEffect(() => {
    const valid =
      jobTitle.trim().length >= 8 && jobDesc.trim().length >= 15;
    setIsValid(valid);
  }, [jobTitle, jobDesc, jobCriteria, qs]);

  const onSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/edit_job_details`,
        {
          job_id: jobId,
          job_title: jobTitle,
          job_description: jobDesc,
          key_criteria: jobCriteria,
          sample_questions: qs.join("\n"),
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200 && res.data.updated === "Success") {
        alert("Job updated successfully! 🔄");
        dispatch(
          updateJob({ id: jobId, title: jobTitle, description: jobDesc, criteria: jobCriteria, sample_questions: qs })
        );
      } else {
        alert("Failed to update job.");
      }
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Error updating job. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">{cameForEdit.current ? "Edit Job" : "New Job"}</h2>
        <div className="space-y-4">
          <Input value={`Job ID: ${jobId}`} readOnly className="bg-gray-100" />
          <Input
            placeholder="Job Title (min 8 chars)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Textarea
            placeholder="Job Description (min 15 chars)"
            rows={4}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <Textarea
            placeholder="Key Criteria"
            rows={4}
            value={jobCriteria}
            onChange={(e) => setJobCriteria(e.target.value)}
          />
          <Textarea
            placeholder="Sample Questions (one per line)"
            rows={4}
            value={qs.join("\n")}
            onChange={(e) => setQs(e.target.value.split("\n"))}
          />
          <Button
            onClick={onSubmit}
            disabled={!isValid || loading}
            className={`${!isValid || loading ? "bg-gray-300 text-gray-500 pointer-events-none" : ""}`}
          >
            {loading ? (cameForEdit.current ? "Updating..." : "Creating...") : (cameForEdit.current ? "Update Job" : "Create Job")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
