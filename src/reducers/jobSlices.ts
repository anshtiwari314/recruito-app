import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
// import type { RootState } from "../store/store"

export interface Candidate {
  id?: string
  name?: string
  status?:  "Pending" | "Shortlisted" 
  score?: number
  jobId?: string
  email?: string
  phone?: string
  resumeUrl?: string
  candidate_id?:string
}

export interface Job {
  id: string
  title: string
  description: string
  criteria: string
  status?: "Open" | "Closed" | "On Hold"
  dateCreated?: string
  candidates?: Candidate[]
  sampleQuestions?: string[]
}

interface JobState {
  jobs: Job[]
  selectedJob: Job | null
  loading: boolean
  error: string | null
}

const initialState: JobState = {
  jobs: [
    {
      id: "J001",
      title: "Data Scientist",
      description: "We are looking for a data scientist to join our team.",
      criteria: "Python, R, Machine Learning, Statistics",
      status: "Open",
      dateCreated: "2025-05-01",
      candidates: [],
      sampleQuestions: [
        "What is your experience with data analysis?",
        "How do you handle missing data?",
        "Explain the difference between supervised and unsupervised learning.",
        "What is overfitting and how can you prevent it?",
      ]
    },
    {
      id: "J002",
      title: "Frontend Developer",
      description: "Frontend developer with React experience needed.",
      criteria: "React, TypeScript, CSS, HTML",
      status: "Open",
      dateCreated: "2025-05-02",
      candidates: [],
      sampleQuestions: [
      " what is azure \n what is dev \n tell me about yourself\n Q4"//expecting
      ]
    },
    {
      id: "J003",
      title: "Backend Developer",
      description: "Backend developer with Node.js experience needed.",
      criteria: "Node.js, Express, MongoDB, REST APIs",
      status: "Open",
      dateCreated: "2025-05-03",
      candidates: [],
    },
    {
      id: "J004",
      title: "DevOps Engineer",
      description: "DevOps engineer with AWS experience needed.",
      criteria: "AWS, Docker, Kubernetes, CI/CD",
      status: "Open",
      dateCreated: "2025-05-04",
      candidates: [],
    },
    {
      id: "J005",
      title: "UI/UX Designer",
      description: "UI/UX designer with Figma experience needed.",
      criteria: "Figma, UI Design, UX Research, Prototyping",
      status: "Open",
      dateCreated: "2025-05-05",
      candidates: [
        {
          id: "C001",
          name: "Sneha Roy",
          status: "Shortlisted",
          score: 8.9,
          jobId: "J005",
          email: "sneha@example.com",
          resumeUrl: "/resumes/sneha-roy.pdf",
        },
      ],
    },
  ],
  selectedJob: null,
  loading: false,
  error: null,
}





const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    addJob: (state, action: PayloadAction<Job>) => {
      const newJob = action.payload
      const existingJob = state.jobs.find((job) => job.id === newJob.id)
      if (!existingJob) {
        state.jobs.push(newJob)
      } else {
        state.error = "Job with this ID already exists."
      }
      console.log("Job added successfully!");
    },
    selectJob: (state, action: PayloadAction<string>) => {
      state.selectedJob = state.jobs.find((job) => job.id === action.payload) || null
    },

    
    editJob: (state, action: PayloadAction<{id:string,title:string,description:string,criteria:string}>) => {
      // state.selectedJob = state.jobs.find((job) => job.id === action.payload.id) || null
      const index = state.jobs.findIndex((job) => job.id === action.payload.id)
      if (index !== -1) {
        state.jobs[index] = { ...state.jobs[index], ...action.payload }
      } else {
        state.error = "Job not found."
      }
      console.log("Job edited successfully!");
    },

    addResumes: (state, action: PayloadAction<{ jobId: string; file: string }>) => {
      const { jobId, file } = action.payload
      const job = state.jobs.find((job) => job.id === jobId)
      if (job) {
        const newCandidate: Candidate = {
          id: `C${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}`,
          name: file.split(".")[0],
          status: "Pending",
          score: 0,
          jobId,
          resumeUrl: `/resumes/${file}`,
        }
        job?.candidates?.push(newCandidate)
        // job.status = "Reviewing"
        console.log("Resumes added successfully!",newCandidate);
        
      }
    },

    viewCandidates: (state, action: PayloadAction<string>) => {
      state.selectedJob = state.jobs.find((job) => job.id === action.payload) || null
    },

    // Add sample questions to a job
    addSampleQuestions: (state, action: PayloadAction<{id:string,qs:string}>) => {
      const job = state.jobs.find((job) => job.id === action.payload.id)
      if (job) {
        // job.sampleQuestions = [
        //   "Tell us about your experience with the required technologies.",
        //   "Describe a challenging project you worked on.",
        //   "How do you stay updated with industry trends?",
        // ]
        job?.sampleQuestions?.push(action.payload.qs)
        console.log("Sample questions added successfully!",job.sampleQuestions);
      }
    },

    scheduleInterview: (
      state,
      action: PayloadAction<{
        jobId: string
        candidateId: string
        date: string
        participants: string[]
      }>,
    ) => {
      // This would  create an interview in the database and send invites to participants
      // For now, we'll just log the details
      // For now, we'll just update the candidate status
      const { jobId, candidateId } = action.payload
      const job = state.jobs.find((job) => job.id === jobId)
      if (job) {
        const candidate = job?.candidates?.find((c) => c.id === candidateId)
        if (candidate) {
          candidate.status = "Shortlisted"
        }
      }
    },

    // Update a job
    updateJob: (state, action: PayloadAction<Partial<Job> & { id: string }>) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload.id)
      if (index !== -1) {
        state.jobs[index] = { ...state.jobs[index], ...action.payload }
      }
    },

    // Close a job
    closeJob: (state, action: PayloadAction<string>) => {
      const job = state.jobs.find((job) => job.id === action.payload)
      if (job) {
        job.status = "Closed"
      }
    },
    //deleete a job
    deleteJob: (state, action: PayloadAction<string>) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload)
      if (index !== -1) {
        state.jobs.splice(index, 1)
      }
    },

  },
})

export const {
  addJob,
  selectJob,
  editJob,
  addResumes,
  viewCandidates,
  addSampleQuestions,
  scheduleInterview,
  updateJob,
  closeJob,
} = jobSlice.actions

export default {
    jobReducer: jobSlice.reducer,
  };
