import React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { addResumes, viewCandidates, addSampleQuestions, Job } from "../reducers/jobSlices"
import Button from "./ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogHeader } from "./ui/Dailog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table"
import { Input } from "./ui/Input"
import { useAppSelector } from "../store/store"
import EditJobForm from "./EditJob"
import SampleQuestionsForm from "./SampleQuestion"
import { useTestWrapper } from "../context/TestWrapper"

//Main fxn 
export default function OpenJobTables({state}:any) {
  const dispatch = useDispatch()
  const jobs = useAppSelector((state) => state.jobReducer.jobs)
  console.log("Jobs from Redux:", jobs)
    const jobIdRef=useTestWrapper().jobIdRef;
  console.log("Job ID Ref:", jobIdRef)
  const [showCandidatesModal, setShowCandidatesModal] = useState(false)
  const [showResumesModal, setShowResumesModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showQuestionsModal, setShowQuestionsModal] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const selectedJob = jobs.find((job) => job.id === selectedJobId)
  const filteredCandidates = selectedJob?.candidates ?? []

  const handleEditJob = (jobId: string) => {
    setSelectedJobId(jobId)
    setShowEditModal(true)
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
    // dispatch(addSampleQuestions(jobId))
  }

  // New: Schedule meeting for a job
  const handleScheduleJobMeeting = (jobId: string) => {
    // TODO: implement
    alert(`Scheduling meeting for job ${jobId}`)
    //@ts-ignore
    jobIdRef.current = jobId
    state("scheduleMeeting")
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

  const handleSaveJobEdit = (data: any) => {
    console.log("Saving job edit:", data)
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
                  {/* New: Schedule Meeting button */}
                  <Button variant="outline" onClick={() => handleScheduleJobMeeting(job.id)}>
                    Schedule Meeting
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Candidates Modal */}
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
                          className=" bg-gray-500 hover:bg-zinc-900"
                          onClick={() =>handleScheduleJobMeeting(selectedJobId)}
                        >
                          Schedule Meeting
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center py-4">
                      No candidates found for this job
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="mt-4">
              <DialogClose asChild>
                <Button
                  className=" hover:bg-gray-600"
                  onClick={() => setShowCandidatesModal(false)}
                >
                  Close
                </Button>
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
              <Input type="file" onChange={handleFileChange} className="flex-1" />
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

        {/* Sample Questions Modal */}
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
