import React, { useEffect, useState } from "react"
import { Input } from "./ui/Input"
import Button from "./ui/Button"
import { Textarea } from "./ui/Textarea"
import { DialogTitle, DialogHeader } from "./ui/Dailog"
import { useDispatch } from "react-redux"
import { editJob } from "../reducers/jobSlices"
import axios from "axios"

interface EditJobFormProps {
  jobId: string
  initialData?: {
    title: string
    description: string
    criteria: string
  }
  onClose: () => void
  onSave: (data: any) => void
}

export default function EditJobForm({
  jobId,
  initialData = { title: "", description: "", criteria: "" },
  onClose,
  onSave,
}: EditJobFormProps) {
  const [title, setTitle] = useState(initialData.title)
  const [description, setDescription] = useState(initialData.description)
  const [criteria, setCriteria] = useState(initialData.criteria)
  const dispatch = useDispatch()
  const ngrokL = "https://e3a8-49-204-210-210.ngrok-free.app" 

  const handleSave = async () => {
    const isValid = title.trim().length >= 8 && description.trim().length > 15;

    if (!isValid) {
      alert("Please fill all fields with valid values.");
      return;
    }

    onSave({
      id: jobId,
      title,
      description,
      criteria,
    })

    dispatch(editJob({ id: jobId, title, description, criteria }))

    try {
      const res = await axios.post(`${ngrokL}/add_new_job`, {
        job_id: jobId,
        job_title: title,
        job_description: description,
        key_criteria: criteria,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200 && res.data.created_newjob === "Success") {
        console.log("Job Created:", res.data);
        alert("Job created successfully!");
      } else {
        alert("Failed to create job.");
      }
    } catch (err) {
      console.error("Error while creating job:", err);
      alert("Failed to create job.");
    } finally {
      console.log("Job edited successfully! from the edit section");
      onClose()
    }
  }

  return (
    <div className="w-full">
      <DialogHeader onClose={onClose}>
        <DialogTitle>Edit Job Details</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 mt-4">
        <Input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Job Description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Textarea
          placeholder="Key Criteria (Skills, experience, etc.)"
          rows={4}
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />

        <Button onClick={handleSave} className="w-full bg-black text-white">
          Save
        </Button>
      </div>
    </div>
  )
}
