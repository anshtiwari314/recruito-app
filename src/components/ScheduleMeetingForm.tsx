import React, { useEffect, useState } from "react";
import Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { useAppSelector } from "../store/store";
import { Job } from "../reducers/jobSlices";

const checkDate = (date: string, currDate: string) => {
  const selectedDate = new Date(date);
  const currentDate = new Date(currDate);
  return selectedDate >= currentDate;
}

export default function ScheduleMeetingForm() {
  const [jobId, setJobId] = useState("");
  const [candidate, setCandidate] = useState("");
  const [participants, setParticipants] = useState("");
  const [date, setDate] = useState("");
  const jobsAv: Job[] = useAppSelector((state) => state.jobReducer.jobs);
  console.log("Jobs from Redux:", jobsAv);  
  //i will get the the candiddate email from the backend
   
  //dates->logics 
   const currDate = new Date();
   const formattedDate = currDate.toISOString().split("T")[0];
   console.log( formattedDate) 

   
   const onSchedule = async () => {
    if (!jobId || !participants || !date) {
      alert("Please fill in all fields.");
      return;
    }
    if(checkDate(date,formattedDate) === false){
      alert("Please select a date that is not in the past.");
      return;    
    }
    const params = new URLSearchParams({ jobId, candidate, participants, date });
    try {
      const res = await fetch(`/api/schedule?${params.toString()}`, { method: 'GET' });
      const contentType = res.headers.get('content-type') || '';

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error ${res.status}: ${errText}`);
      }
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Expected JSON, got:', text);
        throw new Error('Non-JSON response');
      }

      const data = await res.json();
      console.log('Scheduled:', data);
      alert('Meeting scheduled: ' + data.scheduledFor);
      setJobId("");
      setCandidate("");
      setParticipants("");
      setDate("");
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
   };// i may have to chaange it or instead make the link myself 

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
            className="mt-1 block w-full border-gray-600 
            rounded-md shadow-sm border h-10"
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
        <Button onClick={onSchedule}>Schedule Meeting</Button>
      </CardContent>
    </Card>
  );
}
