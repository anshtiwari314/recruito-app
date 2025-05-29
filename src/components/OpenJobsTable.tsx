import React, { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { addResumes, viewCandidates, addSampleQuestions } from "../reducers/jobSlices"
import Button from "./ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/Dailog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table"
import { Input } from "./ui/Input"
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
  candidate_data: {
    email: string
    name: string
    status: string
    score: number
    candidate_id: string
    meeting_link: string
  }[]
}

export default function OpenJobTables({ state }: any) {
  const ngRokL =
    "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis"
  const dispatch = useDispatch()
  const { jobIdRef, candiRef, cameForEdit } = useTestWrapper()

  const [apiJobs, setApiJobs] = useState<ApiJob[]>([])
  const [showResumesModal, setShowResumesModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showQuestionsModal, setShowQuestionsModal] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle")
  const progressTimer = useRef<NodeJS.Timeout>()

  // Fetch jobs
  const getAllJobs = async () => {
    try {
      const res = await axios.post(
        `${ngRokL}/jobs-list`,
        { agent_id: "1234" },
        { headers: { "Content-Type": "application/json" } }
      )
      if (res.status === 200) setApiJobs(res.data.job_data)
    } catch (err) {
      console.error("Error fetching jobs:", err)
    }
  }
  useEffect(() => {
    getAllJobs()
  }, [])

  const startFakeProgress = () => {
    setUploadProgress(1)
    setUploadStatus("uploading")
    progressTimer.current = setInterval(() => {
      setUploadProgress((p) => {
        const next = p + Math.random() * 5
        return next < 90 ? Math.round(next) : 90
      })
    }, 300)
  }
  const stopFakeProgress = () => {
    if (progressTimer.current) clearInterval(progressTimer.current)
  }

  const pdfToBase64 = (): Promise<string | null> =>
    new Promise((resolve, reject) => {
      if (!selectedFile) return resolve(null)
      const reader = new FileReader()
      reader.readAsDataURL(selectedFile)
      reader.onload = () => resolve((reader.result as string).split(",")[1])
      reader.onerror = (err) => reject(err)
    })

  const resumeUploader = async (jobId: string) => {
    if (!jobId || !selectedFile) {
      alert("Select job and file pehle")
      return
    }
    try {
      startFakeProgress()
      const base64 = await pdfToBase64()
      if (!base64) throw new Error("Base64 fail")
      const payload = {
        filename: selectedFile.name,
        pdf_base64: base64,
        job_id: jobId,
      }
      const res = await axios.post(`${ngRokL}/cv-upload`, payload, {
        headers: { "Content-Type": "application/json" },
      })
      stopFakeProgress()
      if (res.status === 200) {
        setUploadProgress(100)
        setUploadStatus("success")
      } else throw new Error("Non-200")
    } catch (err) {
      console.error(err)
      stopFakeProgress()
      setUploadProgress(100)
      setUploadStatus("error")
    }
  }

  const handleUploadResume = () => {
    if (selectedFile && selectedJobId) {
      dispatch(addResumes({ jobId: selectedJobId, file: selectedFile.name }))
      resumeUploader(selectedJobId).then(() => {
        setSelectedFile(null)
        setTimeout(() => {
          setShowResumesModal(false)
          setUploadProgress(0)
          setUploadStatus("idle")
        }, 2000)
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setSelectedFile(e.target.files[0])
  }

  const takeToCandidates = (jobId: string) => {
    // @ts-ignore
    jobIdRef.current = jobId
    state("candidate")
  }
  const handleEdit = (jobId: string) => {
    // @ts-ignore
    cameForEdit.current = true
    // @ts-ignore
    jobIdRef.current = jobId
    setSelectedJobId(jobId)
    state("EditJob")
  }
  const handleQuestions = (jobId: string) => {
    setSelectedJobId(jobId)
    setShowQuestionsModal(true)
  }

  const selectedJob = apiJobs.find((j) => j.jobid === selectedJobId)

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
                <TableCell className="flex gap-2 flex-wrap">
                  <Button variant="outline" onClick={() => handleEdit(job.jobid)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedJobId(job.jobid)
                      setShowResumesModal(true)
                      setUploadProgress(0)
                      setUploadStatus("idle")
                    }}
                  >
                    Add Resumes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => takeToCandidates(job.jobid)}
                  >
                    View Candidates
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleQuestions(job.jobid)}
                  >
                    Add Sample Questions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Resumes Modal */}
        <Dialog open={showResumesModal} onOpenChange={setShowResumesModal}>
          <DialogContent>
            <DialogHeader onClose={() => setShowResumesModal(false)}>
              <DialogTitle>Upload Resume</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <div className="flex items-center gap-4 mt-4">
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <Button
                onClick={handleUploadResume}
                disabled={!selectedFile || uploadStatus === "uploading"}
              >
                {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
              </Button>
            </div>

            {/* Progress Bar */}
            {uploadStatus !== "idle" && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-200 ease-linear"
                    style={{
                      width: `${uploadProgress}%`,
                      background:
                        uploadStatus === "error"
                          ? "linear-gradient(90deg, #ef4444, #f87171)"
                          : "linear-gradient(90deg, #4ade80, #06b6d4)",
                    }}
                  />
                </div>
                <p className="mt-2 font-medium">
                  {uploadStatus === "uploading" && `${uploadProgress}%`}
                  {uploadStatus === "success" && "Resume Uploaded Successfully"}
                  {uploadStatus === "error" && "Upload Failed Try After sometimes"}
                </p>
              </div>
            )}
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
              onSave={(data) => console.log("Save edit:", data)}
            />
          </DialogContent>
        </Dialog>

        {/* Sample Questions Modal */}
        <Dialog open={showQuestionsModal} onOpenChange={setShowQuestionsModal}>
          <DialogContent>
            <SampleQuestionsForm
              jobId={selectedJobId}
              initialQuestions={selectedJob?.sample_questions.join("\n") || ""}
              onClose={() => setShowQuestionsModal(false)}
              onSave={(data) => dispatch(addSampleQuestions(data))}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
