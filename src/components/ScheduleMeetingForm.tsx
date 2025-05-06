import React, { useState } from "react";
import Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";

export default function ScheduleMeetingForm() {
  const [jobId, setJobId] = useState("");
  const [candidate, setCandidate] = useState("");
  const [participants, setParticipants] = useState("");
  const [dateTime, setDateTime] = useState("");

  const onSchedule = async () => {
    if (!jobId || !candidate || !participants || !dateTime) {
      alert("Please fill in all fields.");
      return;
    }
    const params = new URLSearchParams({ jobId, candidate, participants, dateTime });
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
      setDateTime("");
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };
  

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">Schedule Interview</h2>

        <Input
          placeholder="Job ID"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        />

        <Input
          placeholder="Candidate Email / Name"
          value={candidate}
          onChange={(e) => setCandidate(e.target.value)}
        />

        <Textarea
          placeholder="Participants (comma-separated emails)"
          rows={3}
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
        />

        <Input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />

        <Button onClick={onSchedule}>Schedule Meeting</Button>
      </CardContent>
    </Card>
  );
}
