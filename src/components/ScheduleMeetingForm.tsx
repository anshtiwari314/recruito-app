import React, { useEffect, useState } from "react";
import Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { useAppSelector } from "../store/store";
import { Job } from "../reducers/jobSlices";
import { useTestWrapper } from "../context/TestWrapper";

// Date checker function
const checkDate = (date: string, currDate: string) => {
  const selectedDate = new Date(date);
  const currentDate = new Date(currDate);
  return selectedDate >= currentDate;
};

export default function ScheduleMeetingForm() {
  const jobIdRef=useTestWrapper().jobIdRef;
  const [jobId, setJobId] = useState(jobIdRef.current || "");
  console.log("Job ID from ref:", jobIdRef.current);
  
  const [candidate, setCandidate] = useState("example@example.com");
  const [participants, setParticipants] = useState("");
  const [date, setDate] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  const jobsAv: Job[] = useAppSelector((state) => state.jobReducer.jobs);

  const currDate = new Date();
  const formattedDate = currDate.toISOString().split("T")[0];

  // Get the userEmail from sessionStorage
  useEffect(() => {
    const userEmail = sessionStorage.getItem("userEmail") || "";
    setCandidate(userEmail);
  }, []);

  // Update isValid when form fields change
  useEffect(() => {
    const isDateValid = date && checkDate(date, formattedDate);
    setIsValid(!!(jobId && candidate && participants.trim().length > 0 && isDateValid));
  }, [jobId, candidate, participants, date]);

  const onSchedule = async () => {
    if (!isValid) return;

    // Replace them with bcend values
    const agentId = "1234";
    const roomId = "abc-123-fgh-456";
    const customerId = candidate;
    const jobno = jobId;

    const params = new URLSearchParams({
      room_id: roomId,
      cust_email_id: customerId,
      agent_id: agentId,
      job_id: jobno,
    });

    const link = `https://app-domain-eg?${params.toString()}`;
    setMeetingLink(link);
    setJobId("")
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
          <label className="block text-m ml-1 font-medium text-gray-700 mb-1">
            Job ID
          </label>
          <select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="mt-1 block w-full border-gray-600 rounded-md shadow-sm border h-10"
          >
            <option value="">Select a job</option>
            {jobsAv.map((job) => (
              <option key={job.id} value={job.id}>
                {job.id}
              </option>
            ))}
          </select>
        </div>

        <Input
          value={`Candidate: ${candidate}`}
          readOnly
          className="bg-gray-100 cursor-not-allowed"
        />

        <Textarea
          placeholder="Participants (comma-separated emails)"
          rows={3}
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
        />

        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Button
          onClick={onSchedule}
          disabled={!isValid}
          className={`${isValid ? "" : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"}`}
        >
          Schedule Meeting
        </Button>

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
