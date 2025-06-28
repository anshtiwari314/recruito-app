import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";
import { useData } from "../context/DataWrapper";
import { AiOutlineDownload } from "react-icons/ai";

const FooterTemp: React.FC = () => {
  const { jobId, roomId, agentId, name: agentName, candid } =
    useAppSelector((state) => state.qpReducer);
  const { jobTitle } = useAppSelector((state) => state.cuesReducer);

  const { socket2, interviewMetaRef }: any = useData();

  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  const res = interviewMetaRef.current?.resources || [];
  const jobDescLink = res.find((r: any) => r.key === "Job Description")?.value;
  const candResumeLink = res.find((r: any) => r.key === "Candidate Resume")?.value;
  const candName = res.find((r: any) => r.key === "Candidate Name")?.value;
  const candEmail = res.find((r: any) => r.key === "Candidate Email")?.value;
  const candidateId = interviewMetaRef.current?.candidateId || "placeholder_id";

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const handleSendNotes = () => {
    if (!notes.trim()) return;

    setLoading(true);
    setStatus(null);

    let data = {
      jobid:jobId, 
      roomid:roomId, 
      agentid:agentId, 
      agent_name:name, 
      notes, 
      candidateid: 'abc123'
    }


    console.log("➡️ recruiter_notes_req emitted:", data);
    socket2.emit("recruiter_notes_req", data);
  };

  useEffect(() => {
    if (!socket2) return;

    const handleResponse = (payload: { success: boolean }) => {
      setLoading(false);
      if (payload.success) {
        setStatus("success");
        setNotes("");
      } else {
        setStatus("error");
      }
    };

    socket2.on("recruiter_notes_res", handleResponse);
    return () => {
      socket2.off("recruiter_notes_res", handleResponse);
    };
  }, [socket2]);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    // mb-6
    <footer className="text-white" >
      <div className="flex w-full" style={{flexDirection:'row',alignItems:'center'}}>
       
        <div className="w-[45%] pr-4 flex flex-col space-y-3" >
          <div id="ai-query" style={{ flex: 0.2, }} >
            <div className="bg-white rounded-lg shadow p-4" >
              <div className="flex items-center text-black space-x-3">
                <textarea
                  placeholder="Enter your notes here ..."
                  className="flex-grow p-2.5 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-neutral-200 resize-none max-h-[150px] overflow-y-auto"
                  value={notes}
                  onChange={handleNotesChange}
                  disabled={loading}
                  rows={3}
                />
                <button
                  className="p-2.5 bg-neutral-600 hover:bg-neutral-700 rounded-lg text-white"
                  onClick={handleSendNotes}
                  disabled={loading}
                >
                  {loading ? (
                    <i className="flex space-x-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
                    </i>
                  ) : (
                    <i className="fa-solid fa-paper-plane"></i>
                  )}
                </button>
                {status === "success" && (
                  <p className="mt-2 text-green-600 whitespace-normal max-w-24">
                    Notes sent successfully!
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-2 text-red-600 whitespace-normal max-w-24">
                    Failed to send notes. Try again.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

       
        <div className="w-[52%] ml-5 h-full bg-white flex border rounded-lg overflow-hidden" >
         
          <div className="w-1/2 px-4 py-4  flex flex-col">
           
          {/* px-3 py-1 mb-4 */}
            <div className="inline-block bg-white text-black rounded-md px-2 py-1 mb-1 border self-center">
              Resources
            </div>

            {/* Candidate Resume */}
            <div className="flex items-center mb-2">
              <span className="text-black text-sm font-medium">Candidate Resume:</span>
              {candResumeLink ? (
                <a
                  href={candResumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500"
                >
                  <AiOutlineDownload className="w-5 h-5" />
                </a>
              ) : (
                <span className="ml-2 text-gray-400 text-sm">[No Link]</span>
              )}
            </div>

            <div className="flex items-center mb-2">
              <span className="text-black text-sm font-medium">Job Description:</span>
              {jobDescLink ? (
                <a
                  href={jobDescLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500"
                >
                  <AiOutlineDownload className="w-5 h-5" />
                </a>
              ) : (
                <span className="ml-2 text-gray-400 text-sm">[No Link]</span>
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="border-r" />

          {/* Right Half: Candidate Info */}
          <div className="w-1/2 px-4 py-4 flex flex-col">
            
          {/* px-3 py-1 mb-4 */}
            {/* Heading: Centered Horizontally */}

            <div className="inline-block bg-white text-black rounded-md px-2 py-1 mb-1 border self-center">
              Candidate Info
            </div>

            {/* Candidate Name */}
            <div className="text-black text-sm mb-2">
              <span className="font-medium">Name:</span>{" "}
              <span className="text-gray-600">{candName || "[Candidate Name]"}</span>
            </div>

            {/* Candidate Email */}
            <div className="text-black text-sm">
              <span className="font-medium">Email:</span>{" "}
              <span className="text-gray-600">{candEmail || "[Add Candidate Email]"}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterTemp;
