import  React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import {  addResumes, viewCandidates, addSampleQuestions, Job } from "../reducers/jobSlices"
import Button from "./ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Dialog, DialogContent, DialogTitle, DialogClose,DialogHeader } from "./ui/Dailog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table"
import { Input } from "./ui/Input"
import { useAppSelector } from "../store/store"
import EditJobForm from "./EditJob"
import SampleQuestionsForm from "./SampleQuestion"

const dummyCandidates = [
  {
    id: "C001",
    name: "Sneha Roy",
    status: "Shortlisted",
    score: 8.9,
    jobId: "J001",
    email: "sneha@example.com",
  },
  {
    id: "C002",
    name: "Rahul Sharma",
    status: "New",
    score: 7.5,
    jobId: "J001",
    email: "rahul@example.com",
  },
  {
    id: "C003",
    name: "Priya Patel",
    status: "Reviewing",
    score: 8.2,
    jobId: "J002",
    email: "priya@example.com",
  },
]

export default function OpenJobTables({jobG}:Job[]) {
  const dispatch = useDispatch()
  const jobs = useAppSelector((state) => state.jobReducer.jobs)
  console.log("Jobs from Redux:", jobs)
  // console.log("Jobs from props:", jobG)

  const [showCandidatesModal, setShowCandidatesModal] = useState(false)
  const [showResumesModal, setShowResumesModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showQuestionsModal, setShowQuestionsModal] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // const filteredCandidates = dummyCandidates.filter((candidate) => candidate.jobId === selectedJobId)
  const selectedJob = jobs.find((job) => job.id === selectedJobId)
  const filteredCandidates = selectedJob?.candidates ?? [];

  const handleEditJob = (jobId: string) => {
    setSelectedJobId(jobId)
    setShowEditModal(true)
    // dispatch(editJob(jobId))
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
    dispatch(addSampleQuestions(jobId))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUploadResume = () => {
    if (selectedFile && selectedJobId) {
      dispatch(addResumes({ jobId: selectedJobId, file: selectedFile.name }))
      setShowResumesModal(false)
      setSelectedFile(null)
    }
  }

  const handleScheduleMeeting = (candidateName: string) => {
    setShowCandidatesModal(false)
  }

  const handleSaveJobEdit = (data: any) => {
    console.log("Saving job edit:", data)
    // dispatch(updateJob(data))
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
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => handleEditJob(job.id)}>
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => handleAddResumes(job.id)}>
                    Add Resumes
                  </Button>
                  <Button variant="outline" onClick={() => handleViewCandidates(job.id)}>
                    View Candidates
                  </Button>
                  <Button variant="outline" onClick={() => handleAddSampleQuestions(job.id)}>
                    Add Sample Questions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={showCandidatesModal} onOpenChange={setShowCandidatesModal}>
        <DialogContent>
          <DialogHeader onClose={() => setShowCandidatesModal(false)}>
            <DialogTitle>View Candidates for Job {selectedJobId}</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.status}</TableCell>
                    <TableCell>{candidate.score}</TableCell>
                    <TableCell>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => handleScheduleMeeting(candidate.name)}
                      >
                        Schedule Meeting
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No candidates found for this job
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-4">
            <DialogClose asChild>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => setShowCandidatesModal(false)}
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>


      <Dialog open={showResumesModal} onOpenChange={setShowResumesModal}>
          <DialogContent>
            <DialogHeader onClose={() => setShowResumesModal(false)}>
              <DialogTitle>Add Resumes</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-4 mt-4">
              <Input type="file" onChange={handleFileChange} className="flex-1" />
              <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleUploadResume} disabled={!selectedFile}>
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <EditJobForm
              jobId={selectedJobId}
              initialData={
                selectedJob
                  ? {
                      title: selectedJob.title,
                      description: selectedJob.description,
                      criteria: selectedJob.criteria,
                    }
                  : undefined
              }
              onClose={() => setShowEditModal(false)}
              onSave={handleSaveJobEdit}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showQuestionsModal} onOpenChange={setShowQuestionsModal}>
          <DialogContent>
            <SampleQuestionsForm
              jobId={selectedJobId}
              initialQuestions={selectedJob?.sampleQuestions?.join("\n") || ""}
              onClose={() => setShowQuestionsModal(false)}
              onSave={handleSaveQuestions}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
