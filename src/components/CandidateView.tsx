import { useEffect, useState } from "react";
import { useTestWrapper } from "../context/TestWrapper";
import axios from "axios";
import  Button  from "./ui/Button"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/Table";

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
    score: number | string;
    candidate_id: string;
    meeting_link: string;
  }[];
}

export default function CandidateView({ state }: any) {
  const ngRokL = "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis";
  const [apiJobs, setApiJobs] = useState<ApiJob[]>([]);
  const jobIdRef = useTestWrapper().jobIdRef;
  const candiRef=useTestWrapper().jobIdRef;

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
      console.log("Jobs from API:", res.data.job_data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  // Get current selected job from jobIdRef
  const selectedJobId = jobIdRef.current;
  const selectedJob = apiJobs.find((job) => job.jobid === selectedJobId);
  const filteredCandidates = selectedJob?.candidate_data || [];

  const handleWithMeetingLink = (link: string) => {
    window.open(link, "_blank");
  };

  const handleScheduleJobMeeting = (jobId: string | null, candidateId: string) => {
    console.log("Schedule meeting for", jobId, candidateId);
     alert(`Scheduling meeting for job ${jobId}`)
    // @ts-ignore
    jobIdRef.current = jobId
    //@ts-ignore
    candiRef.current=can_id
    state("scheduleMeeting")
  };

  return (
    <div className="overflow-x-auto max-h-[60vh] overflow-y-auto mt-4">
     
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Candidate ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <TableRow key={candidate.email}>
                <TableCell>{candidate.candidate_id}</TableCell>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>{candidate.status}</TableCell>
                <TableCell>{candidate.score}</TableCell>
                <TableCell>
                  {candidate.meeting_link ? (
                    <Button
                      className="bg-gray-500 hover:bg-zinc-900"
                      onClick={() => handleWithMeetingLink(candidate.meeting_link)}
                    >
                      Meeting Link
                    </Button>
                  ) : (
                    <Button
                      className="bg-gray-500 hover:bg-zinc-900"
                      onClick={() => handleScheduleJobMeeting(selectedJobId, candidate.candidate_id)}
                    >
                      Schedule Meeting
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No candidates found for this job
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
