import { useEffect, useState } from "react";
import { useTestWrapper } from "../context/TestWrapper";
import axios from "axios";
import Button from "./ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
    postfacto_link: string; 
  }[];
}

const statusOptions = [
  "pending",
  "interview scheduled",
  "interview done",
  "shortlisted",
  "rejected",
];

export default function CandidateView({ state }: any) {
  const ngRokL = "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis";
  const [apiJobs, setApiJobs] = useState<ApiJob[]>([]);
  const {jobIdRef,candiRef} = useTestWrapper();
  // const  = useTestWrapper().jobIdRef;

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

  const selectedJobId = jobIdRef.current;
  const selectedJob = apiJobs.find((job) => job.jobid === selectedJobId);
  const filteredCandidates = selectedJob?.candidate_data || [];

  const handleWithMeetingLink = (link: string) => {
    window.open(link, "_blank");
  };

  const handleScheduleJobMeeting = (jobId: string | null, candidateId: string) => {
    console.log("Schedule meeting for", jobId, candidateId);
    // alert(`Scheduling meeting for job ${jobId}`);
    // @ts-ignore
    jobIdRef.current = jobId;
    //@ts-ignore
    candiRef.current = candidateId;
    state("scheduleMeeting");
  };

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    try {
      const res = await axios.post(
        `${ngRokL}/main_router`,
        {
          trigger_func: "status_update",
          params: {
            candid: candidateId,
            status: newStatus,
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(`Status updated for ${candidateId} to ${newStatus}:`, res.data);
      // update local state for immediate UI feedback
      setApiJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          candidate_data: job.candidate_data.map((c) =>
            c.candidate_id === candidateId ? { ...c, status: newStatus } : c
          ),
        }))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
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
            <TableHead>Postfacto Dashboard</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <TableRow key={candidate.email}>
                <TableCell>{candidate.candidate_id}</TableCell>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>
                  <select
                    className="border px-2 py-1 rounded bg-white "
                    value={candidate.status}
                    onChange={(e) =>
                      handleStatusChange(candidate.candidate_id, e.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </TableCell>
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
                      onClick={() =>
                        handleScheduleJobMeeting(selectedJobId, candidate.candidate_id)
                      }
                    >
                      Schedule Meeting
                    </Button>
                  )}
                </TableCell>
                <TableCell>
  {candidate.postfacto_link && candidate.postfacto_link !== "N/A" ? (
    <Button
      className="bg-blue-600 hover:bg-blue-800"
      onClick={() => window.open(candidate.postfacto_link, "_blank")}
    >
      Postfacto Link
    </Button>
  ) : (
    <span className="text-gray-400">N/A</span>
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
