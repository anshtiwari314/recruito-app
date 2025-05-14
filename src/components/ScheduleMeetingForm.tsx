import React, { useEffect, useState } from "react";
import Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { useTestWrapper } from "../context/TestWrapper";
import axios from "axios";

interface ApiJob {
  jobid: string;
  title: string;
  job_description: string;
  key_criteria: string;
  sample_questions: string[];
  candidate_data: { email: string; name: string; status: string; score: number }[];
}

export default function ScheduleMeetingForm() {
  const jobIdRef = useTestWrapper().jobIdRef;
  const ngRokL = "https://bbbf-49-204-210-210.ngrok-free.app";

  const [jobId, setJobId] = useState(jobIdRef.current || "");
  const [apiJobs, setApiJobs] = useState<ApiJob[]>([]);
  const [candidateList, setCandidateList] = useState<{ email: string; name: string }[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [participants, setParticipants] = useState("");
  const [date, setDate] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  const currDate = new Date();
  const formattedDate = currDate.toISOString().split("T")[0];

  useEffect(() => {
    const getAllJobs = async () => {
      try {
        const res = await axios.post(
          `${ngRokL}/jobs-list`,
          { agent_id: "1234" },
          { headers: { "Content-Type": "application/json" } }
        );
        if (res.status === 200) {
          setApiJobs(res.data.job_data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    getAllJobs();
  }, []);

  useEffect(() => {
    const job = apiJobs.find((job) => job.jobid === jobId);
    if (job) {
      setCandidateList(job.candidate_data.map((c) => ({ name: c.name, email: c.email })));
      setSelectedCandidate(""); 
    } else {
      setCandidateList([]);
      setSelectedCandidate("");
    }
  }, [jobId, apiJobs]);

  useEffect(() => {
    const isDateValid = date && new Date(date) >= new Date(formattedDate);
    setIsValid(!!(jobId && selectedCandidate && participants.trim() && isDateValid));
  }, [jobId, selectedCandidate, participants, date]);

  const onSchedule = async () => {
    if (!isValid) return;

    const agentId = "1234";
    const roomId = "abc-123-fgh-456";
    const customerId = selectedCandidate;
    const jobno = jobId;

    const link = `https://app-domain-eg?room_id=${roomId}&cust_email_id=${customerId}&agent_id=${agentId}&job_id=${jobno}`;
    setMeetingLink(link);

    try {
      const res = await axios.post(
        `${ngRokL}/schedule-meeting`,
        { link },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        alert("Meeting scheduled successfully!");
      } else {
        throw new Error("Failed to schedule meeting");
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("Error scheduling meeting. Please check the console.");
    }

    setJobId("");
    setSelectedCandidate("");
    setParticipants("");
    setDate("");
    setIsValid(false);
  };

  const copyLink = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      alert("Meeting link copied to clipboard!");
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">Schedule Interview</h2>

        <div>
          <label className="block text-m ml-1 font-medium text-gray-700 mb-1">Job ID</label>
          <select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="mt-1 block w-full border-gray-600 rounded-md shadow-sm border h-10"
          >
            <option value="">Select a job</option>
            {apiJobs.map((job) => (
              <option key={job.jobid} value={job.jobid}>
                {job.jobid}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-m ml-1 font-medium text-gray-700 mb-1">Candidate</label>
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            className="mt-1 block w-full border-gray-600 rounded-md shadow-sm border h-10"
            disabled={candidateList.length === 0}
          >
            <option value="">Select a candidate</option>
            {candidateList.map((c, idx) => (
              <option key={idx} value={c.email}>
                 {c.email}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Participants (comma-separated emails)"
          rows={3}
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="w-full border border-gray-600 rounded-md p-2"
        />

        <Input
          type="date"
          value={date}
          min={formattedDate}
          onChange={(e) => setDate(e.target.value)}
        />

        <Button
          onClick={onSchedule}
          disabled={!isValid}
          className={`${isValid ? "" : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"}`}
        >
          Book Slot
        </Button>

        {meetingLink && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Meeting Link</label>
            <div className="flex items-center">
              <Input
                type="text"
                value={meetingLink}
                readOnly
                className="flex-1 bg-gray-100 cursor-not-allowed"
              />
              <Button onClick={copyLink} className="ml-2">
                Copy Link
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
