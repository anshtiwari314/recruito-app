import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { addResumes, viewCandidates, addSampleQuestions } from "../reducers/jobSlices"
import Button from "./ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogHeader } from "./ui/Dailog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table"
import { Input } from "./ui/Input"
import { useAppSelector } from "../store/store"
import EditJobForm from "./EditJob"
import SampleQuestionsForm from "./SampleQuestion"
import { useTestWrapper } from "../context/TestWrapper"
import axios from "axios"

export interface ApiJob {
  jobid: string
  title: string
  job_description: string
  key_criteria: string
  sample_questions: string[]
  candidate_data: { email: string; name: string; status: string; score: number,candidate_id:string,meeting_link:string }[]
}

export default function OpenJobTables({ state }: any) {
  const ngRokL = "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis"
  const dispatch = useDispatch()
  const jobIdRef = useTestWrapper().jobIdRef
  const candiRef=useTestWrapper().candiRef

  
  const [apiJobs, setApiJobs] = useState<ApiJob[]>([])

  const [showCandidatesModal, setShowCandidatesModal] = useState(false)
  const [showResumesModal, setShowResumesModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showQuestionsModal, setShowQuestionsModal] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

 
  const getAllJobs = async () => {
    try {
      const res = await axios.post(
        `${ngRokL}/jobs-list`,
        { agent_id: "1234" },
        { headers: { "Content-Type": "application/json" } }
      )
      if (res.status === 200) {
        setApiJobs(res.data.job_data)
      }
      console.log("Jobs from API:", res.data.job_data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    }
  }

  useEffect(() => {
    getAllJobs()
  }, [])

  
  const selectedJob = apiJobs.find((job) => job.jobid === selectedJobId)
  const filteredCandidates = selectedJob?.candidate_data ?? []

  
  const handleEditJob = (jobId: string) => {
    setSelectedJobId(jobId)
    setShowEditModal(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const resumeUploader = async (jobId: string) => {
    if (!jobId || !selectedFile) {
      alert("Please select a job and a file to upload")
      return
    }
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("filename", selectedFile.name)
      formData.append("job_id", jobId)
      const res = await axios.post(`${ngRokL}/cv-upload`, formData)
      if (res.status === 200) console.log("Resume Uploaded for:", jobId)
    } catch (error) {
      console.error("Error uploading resume", error)
    }
  }

  const handleAddResumes = (jobId: string) => {
    setSelectedJobId(jobId)
    setShowResumesModal(true)
  }

  const handleViewCandidates = (jobId: string) => {
    setSelectedJobId(jobId)
    setShowCandidatesModal(true)
    dispatch(viewCandidates(jobId))
  }

  const handleAddSampleQuestions = (jobId: string) => {
    setSelectedJobId(jobId)
    setShowQuestionsModal(true)
  }

  const handleScheduleJobMeeting = (jobId: string,can_id:string) => {
    alert(`Scheduling meeting for job ${jobId}`)
    // @ts-ignore
    jobIdRef.current = jobId
    //@ts-ignore
    candiRef.current=can_id
    state("scheduleMeeting")
  }
 const handleWithMeetingLink = (ml:string) => {
  window.location.href = `${ml}`;  
}

  const handleUploadResume = () => {
    if (selectedFile && selectedJobId) {
      dispatch(addResumes({ jobId: selectedJobId, file: selectedFile.name }))
      resumeUploader(selectedJobId)
      setShowResumesModal(false)
      setSelectedFile(null)
    }
  }

  const handleSaveJobEdit = (data: any) => {
    console.log("Saving job edit:", data)
    // TODO: dispatch edit action
  }

  const handleSaveQuestions = (data: any) => {
    console.log("Saving questions:", data)
    dispatch(addSampleQuestions(data))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Open Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiJobs.map((job) => (
              <TableRow key={job.jobid}>
                <TableCell>{job.jobid}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => handleEditJob(job.jobid)}>Edit</Button>
                  <Button variant="outline" onClick={() => handleAddResumes(job.jobid)}>Add Resumes</Button>
                  <Button variant="outline" onClick={() => handleViewCandidates(job.jobid)}>View Candidates</Button>
                  <Button variant="outline" onClick={() => handleAddSampleQuestions(job.jobid)}>Add Sample Questions</Button>
                  <Button variant="outline" onClick={() => handleScheduleJobMeeting(job.jobid,"")}>Schedule Meeting</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Candidates Modal */}
        {/* Candidates Modal */}
<Dialog open={showCandidatesModal} onOpenChange={setShowCandidatesModal}>
  <DialogContent className="w-full max-w-3xl">
    <DialogHeader onClose={() => setShowCandidatesModal(false)}>
      <DialogTitle>View Candidates for Job {selectedJobId}</DialogTitle>
    </DialogHeader>
    {/* Scroll wrapper */}
    <div className="overflow-x-auto max-h-[60vh] overflow-y-auto mt-4">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Candidate_id</TableHead>
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
                  {candidate.meeting_link?(<Button
                    className="bg-gray-500 hover:bg-zinc-900"
                    onClick={() => handleWithMeetingLink(candidate.meeting_link)}
                  >
                   Meeting Link
                  </Button>):(<Button
                    className="bg-gray-500 hover:bg-zinc-900"
                    onClick={() => handleScheduleJobMeeting(selectedJobId, candidate.candidate_id)}
                  >
                    Schedule Meeting
                  </Button>)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              {/* Set colSpan equal to number of columns */}
              <TableCell colSpan={6} className="text-center py-4">
                No candidates found for this job
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="mt-4 text-right">
      <DialogClose asChild>
        <Button className="hover:bg-gray-600">Close</Button>
      </DialogClose>
    </div>
  </DialogContent>
</Dialog>


        {/* Resumes Modal */}
        <Dialog open={showResumesModal} onOpenChange={setShowResumesModal}>
          <DialogContent>
            <DialogHeader onClose={() => setShowResumesModal(false)}>
              <DialogTitle>Add Resumes</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-4 mt-4">
              <Input type="file" accept="application/pdf" onChange={handleFileChange} className="flex-1" />
              <Button className="bg-gray-500 hover:bg-zinc-950" onClick={handleUploadResume} disabled={!selectedFile}>
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Job Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <EditJobForm
              jobId={selectedJobId}
              initialData={
                selectedJob
                  ? {
                      title: selectedJob.title,
                      description: selectedJob.job_description,
                      criteria: selectedJob.key_criteria,
                    }
                  : undefined
              }
              onClose={() => setShowEditModal(false)}
              onSave={handleSaveJobEdit}
            />
          </DialogContent>
        </Dialog>

        {/* Sample Questions Modal */}
        <Dialog open={showQuestionsModal} onOpenChange={setShowQuestionsModal}>
          <DialogContent>
            <SampleQuestionsForm
              jobId={selectedJobId}
              initialQuestions={selectedJob?.sample_questions?.join("\n") || ""}
              onClose={() => setShowQuestionsModal(false)}
              onSave={handleSaveQuestions}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
