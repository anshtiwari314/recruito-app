
import React from "react"
import { useState } from "react"
import { Input } from "./ui/Input"
import Button from "./ui/Button"
import { Textarea } from "./ui/Textarea"
import { DialogTitle,DialogHeader } from "./ui/Dailog"

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

  const handleSave = () => {
    onSave({
      id: jobId,
      title,
      description,
      criteria,
    })
    onClose()
  }

  return (
    <div className="w-full">
      <DialogHeader onClose={onClose}>
        <DialogTitle>Edit Job Details</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 mt-4">
        <Input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />

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
