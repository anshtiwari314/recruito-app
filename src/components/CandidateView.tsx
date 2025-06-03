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


function LinkToast({
  link,
  onClose,
}: {
  link: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  const handleTakeMe = () => {
    window.open(link, "_blank");
    onClose();
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg border border-gray-300 rounded-lg p-4 z-50">
      <div className="flex justify-between items-start mb-2">
        <strong className="text-gray-800">Your Link:</strong>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
      <p className="text-sm text-blue-600 truncate mb-4">{link}</p>
      <div className="flex space-x-2">
        <Button
          className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
          onClick={handleTakeMe}
        >
          Visit Link
        </Button>
      </div>
    </div>
  );
}


function NotificationToast({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";

  return (
    <div className={`fixed bottom-20 right-4 max-w-xs w-full ${bgColor} border rounded-lg p-4 z-50`}>
      <div className="flex justify-between items-center">
        <span className={`font-semibold ${textColor}`}>
          {type === "success" ? "Success" : "Error"}
        </span>
        <button onClick={onClose} className={`${textColor} hover:opacity-80`}>
          ✕
        </button>
      </div>
      <p className={`mt-2 text-sm ${textColor}`}>{message}</p>
    </div>
  );
}

export default function CandidateView({ state }: any) {
  const ngRokL =
    "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis";
  const [apiJobs, setApiJobs] = useState<ApiJob[]>([]);
  const { jobIdRef, candiRef } = useTestWrapper();
  const [linkModal, setLinkModal] = useState<{
    open: boolean;
    url: string;
  }>({ open: false, url: "" });

  const [linkToast, setLinkToast] = useState<{ open: boolean; url: string }>({
    open: false,
    url: "",
  });
  const [notifToast, setNotifToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

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

  const handleScheduleJobMeeting = (jobId: string | null, candidateId: string) => {
    //@ts-ignore
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

  const showLinkToast = (url: string) => {
    setLinkToast({ open: true, url });
  };

  const showNotifToast = (type: "success" | "error", message: string) => {
    setNotifToast({ open: true, type, message });
  };

  return (
    <div className="overflow-x-auto overflow-y-auto mt-4">
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
                    className="border px-2 py-1 rounded bg-white"
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
                      onClick={() => showLinkToast(candidate.meeting_link)}
                    >
                      Meeting Link
                    </Button>
                  ) : (
                    <Button
                      className="bg-gray-500 hover:bg-zinc-900"
                      onClick={() =>
                        handleScheduleJobMeeting(
                          selectedJobId,
                          candidate.candidate_id
                        )
                      }
                    >
                      Schedule Meeting
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {candidate.status === "interview scheduled" ? (
                    candidate.postfacto_link!=='N/A' ? (
                      <Button
                        className="bg-gray-500 hover:bg-zinc-900"
                        onClick={() => showLinkToast(candidate.postfacto_link)}
                      >
                        Postfacto Link
                      </Button>
                    ) : (
                      <Button
                        className="bg-gray-500 hover:bg-zinc-900"
                        onClick={async () => {
                          try {
                            const res = await axios.post(
                              `${ngRokL}/main_router`,
                              {
                                trigger_func: "trigger_metrics",
                                params: { candid: candidate.candidate_id },
                              },
                              {
                                headers: { "Content-Type": "application/json" },
                              }
                            );
                            // Yahan pe success message show karenge
                            showNotifToast("success", res.data.msg);
                          } catch (err) {
                            // Error case mein error message show karenge
                            showNotifToast("error", "Something went wrong");
                          }
                        }}
                      >
                        Generate Postfacto
                      </Button>
                    )
                  ) : (
                    <span>N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No candidates found for this job
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* LinkModal agar aapko modal bhi rakhni ho */}
      {/* <LinkModal
        isOpen={linkModal.open}
        onClose={() => setLinkModal({ open: false, url: "" })}
        link={linkModal.url}
      /> */}

      {/* Link Toast */}
      {linkToast.open && (
        <LinkToast
          link={linkToast.url}
          onClose={() => setLinkToast({ open: false, url: "" })}
        />
      )}

      {/* Notification Toast (success/error) */}
      {notifToast.open && (
        <NotificationToast
          type={notifToast.type}
          message={notifToast.message}
          onClose={() => setNotifToast({ ...notifToast, open: false })}
        />
      )}
    </div>
  );
}
