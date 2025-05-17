import React, { useState } from "react"
import axios from "axios"
import { Textarea } from "./ui/Textarea"
import Button from "./ui/Button"
import { DialogTitle, DialogHeader } from "./ui/Dailog"

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
  const ngrokL = "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis" 

  const handleSave = async () => {
    const payload = {
      agent_id: "1234", 
      job_id: "jb_3578",
      questions,
    }
    console.log("Payload:", payload)

    try {
      const response = await axios.post(`${ngrokL}/sample_questions`, payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (response.status !== 200) {
        throw new Error("Failed to save questions")
      }
      console.log("Saved successfully:", response.data)

      onSave(payload) 
      onClose()      
    } catch (error) {
      console.error("Error saving questions:", error)
      alert(" check console") 
    }
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
