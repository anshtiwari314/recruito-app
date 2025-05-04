
import React from "react"
import { useVadWrapper } from "../context/VadWrapper"
import { useEffect, useState } from "react"

export default function VadStatusIndicator() {
  const { vad, manualVadStatus } = useVadWrapper()
  const [status, setStatus] = useState("initializing")

  useEffect(() => {
    if (!vad) {
      setStatus("not available")
      return
    }

    if (vad.errored) {
      setStatus("error")
      return
    }

    if (vad.loading) {
      setStatus("loading")
      return
    }

    if (vad.listening) {
      setStatus("listening")
      return
    }

    if (manualVadStatus) {
      setStatus("ready")
    } else {
      setStatus("paused")
    }
  }, [vad, manualVadStatus])

  const getStatusColor = () => {
    switch (status) {
      case "listening":
        return "bg-green-500"
      case "ready":
        return "bg-blue-500"
      case "paused":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      case "loading":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
      <span className="text-lg">VAD: {status}</span>
    </div>
  )
}
