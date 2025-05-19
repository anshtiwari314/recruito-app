import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
  candidate_data: Candidate[];
}

interface Candidate {
  email: string;
  name: string;
  status: string;
  score: number | string;
  candidate_id: string;
  meeting_link?: string | null;
}

export default function ScheduleMeetingForm() {
  const jobIdRef = useTestWrapper().jobIdRef;
  const candidRef = useTestWrapper().candiRef;
  const API_BASE =
    "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis";

  const [jobId, setJobId] = useState<string>(jobIdRef.current || "");
  const [apiJobs, setApiJobs] = useState<ApiJob[]>([]);
  const [candidateList, setCandidateList] = useState<Candidate[]>([]);
  const [selectedCandidateEmail, setSelectedCandidateEmail] = useState<string>(
    ""
  );
  const [participants, setParticipants] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [meetingLink, setMeetingLink] = useState<string>("");

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

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
    const job = apiJobs.find((j) => j.jobid === jobId);
    if (job) {
      setCandidateList(job.candidate_data);
      setSelectedCandidateEmail("");
      setParticipants("");
      candidRef.current = "";
    } else {
      setCandidateList([]);
    }
  }, [jobId, apiJobs, candidRef]);

  useEffect(() => {
    const job = apiJobs.find((j) => j.jobid === jobId);
    const candidate = job?.candidate_data.find(
      (c) => c.email === selectedCandidateEmail
    );
    if (candidate) {
      candidRef.current = candidate.candidate_id;
      const details = `Name: ${candidate.name}\nEmail: ${candidate.email}\nCandidate ID: ${candidate.candidate_id}\nScore: ${candidate.score}\nStatus: ${candidate.status}`;
      setParticipants(details);
    } else {
      setParticipants("");
      candidRef.current = "";
    }
  }, [selectedCandidateEmail, jobId, apiJobs, candidRef]);

  // Validation
  useEffect(() => {
    const isDateValid = date && new Date(date) >= new Date(formattedDate);
    setIsValid(
      Boolean(
        jobId &&
          selectedCandidateEmail &&
          participants.trim() &&
          isDateValid &&
          !loading
      )
    );
  }, [jobId, selectedCandidateEmail, participants, date, loading, formattedDate]);

  // Schedule meeting with only roomId and candidateId in params
  const onSchedule = async () => {
    if (!isValid) return;

    setLoading(true);
    const roomId = uuidv4();
    // roomid and candidateid only
    const link = `https://app-domain-eg/?room_id="${roomId}"/candidate_id="${candidRef.current}"`;
    setMeetingLink(link);

    try {
      const res = await axios.post(
        `${API_BASE}/schedule_meeting`,
        {
          meeting_link: link,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        alert("Meeting scheduled successfully! ");
        setSelectedCandidateEmail("");
        setParticipants("");
        setDate("");
        // setMeetingLink("");
      } else {
        throw new Error("Failed to schedule meeting");
      }
    } catch (err) {
      console.error("Error scheduling meeting:", err);
      alert("Error scheduling meeting. Please check the console.");
    }

    setLoading(false);
  };

  const copyLink = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      alert("Meeting link copied! 📋");
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">Schedule Interview</h2>

        {/* Job ID Selector */}
        <div>
          <label className="block text-m ml-1 font-medium text-gray-700 mb-1">
            Job ID
          </label>
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

        {/* Candidate Selector */}
        <div>
          <label className="block text-m ml-1 font-medium text-gray-700 mb-1">
            Candidate ID
          </label>
          <select
            value={selectedCandidateEmail}
            onChange={(e) => setSelectedCandidateEmail(e.target.value)}
            className="mt-1 block w-full border-gray-600 rounded-md shadow-sm border h-10"
            disabled={!jobId}
            title={!jobId ? "Select a Job ID first" : ""}
          >
            <option value="">Select a candidate</option>
            {candidateList.map((c) => (
              <option key={c.candidate_id} value={c.email}>
                {c.candidate_id}
              </option>
            ))}
          </select>
        </div>

        {/* Participants Details */}
        <textarea
          placeholder="Participants details"
          rows={5}
          value={participants}
          readOnly
          className="w-full border border-gray-600 rounded-md p-2 bg-gray-50"
        />

        {/* Date Picker */}
        <div>
          <label className="block text-m ml-1 font-medium text-gray-700 mb-1">
            Pick Date
          </label>
          <Input
            type="date"
            value={date}
            min={formattedDate}
            onChange={(e) => setDate(e.target.value)}
            disabled={!selectedCandidateEmail}
            title={!selectedCandidateEmail ? "Select candidate first" : ""}
          />
        </div>

        {/* Schedule Button */}
        <Button onClick={onSchedule} disabled={!isValid}>
          {loading ? "Booking..." : "Book Slot"}
        </Button>

        {/* Meeting Link Display */}
        {meetingLink && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Meeting Link
            </label>
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
