import React from "react"
import { useState } from "react"
import { Textarea } from "./ui/Textarea"
import Button from "./ui/Button"
// import { DialogHeader } from "./ui/DialogHeader"
import { DialogTitle,DialogHeader } from "./ui/Dailog"

interface SampleQuestionsFormProps {
  jobId: string
  initialQuestions?: string
  onClose: () => void
  onSave: (data: any) => void
}

export default function SampleQuestionsForm({
  jobId,
  initialQuestions = "",
  onClose,
  onSave,
}: SampleQuestionsFormProps) {
  const [questions, setQuestions] = useState(initialQuestions)

  const handleSave = () => {
    onSave({
      jobId,
      questions,
    })
    onClose()
  }

  return (
    <div className="w-full">
      <DialogHeader onClose={onClose}>
        <DialogTitle>Sample Questions</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 mt-4">
        <Textarea
          placeholder="Paste sample questions here"
          rows={6}
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
          className="w-full"
        />

        <Button onClick={handleSave} className="w-full bg-black text-white">
          Save
        </Button>
      </div>
    </div>
  )
}
