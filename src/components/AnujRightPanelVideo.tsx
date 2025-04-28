"use client"
import React from "react";
import { useRef, useEffect } from "react"
import type { UserType } from "../reducers/usersReducer"

export function AnujRightPanelVideo({ e, muted }: { e: UserType; muted: boolean }) {
  console.log(e)
  const vidRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    console.log("Video stream update for user:", e?.id, {
      hasVideoStream: !!e?.videoStream,
      isCameraAvailable: e?.isCameraAvailable,
      cameraStatus: e?.cameraStatus,
      isLoading: e?.isLoading,
    })

    const vid = vidRef.current

    if (!vid || !e) return

    if (!e.videoStream || e.isLoading || e.cameraStatus === false) {
      if (vid.srcObject) {
        vid.srcObject = null
        vid.load()
      }
      return
    }

    if (e.videoStream instanceof MediaStream && vid.srcObject !== e.videoStream) {
      console.log("Setting video stream for user:", e.id)
      vid.srcObject = e.videoStream

      vid.onloadedmetadata = () => {
        console.log("Video metadata loaded for user:", e.id)
        vid.play().catch((err) => {
          console.error("Video play failed:", err)
        })
      }
    }

    return () => {
      if (vid) {
        vid.onloadedmetadata = null
      }
    }
  }, [e?.id, e?.videoStream, e?.isCameraAvailable, e?.cameraStatus, e?.isLoading])

  useEffect(() => {
    if (!e || !e.audioStream || !e.isMicrophoneAvailable) return

    const audio = new Audio()
    if (e.audioStream instanceof MediaStream) {
      audio.srcObject = e.audioStream
    }

    audio.muted = muted

    audio.addEventListener("canplaythrough", () => {
      audio.play().catch((err) => {
        console.error("Audio play failed:", err)
      })
    })

    return () => {
      audio.pause()
    }
  }, [e.audioStream, e.isMicrophoneAvailable, muted])

  const getMicIcon = () => {
    if (!e?.isMicrophoneAvailable) return null
    if (e?.microphoneStatus === false)
      return <i className="fa-solid fa-microphone-slash bg-black/50 text-white p-1 rounded"></i>
    return <i className="fa-solid fa-microphone bg-black/50 text-white p-1 rounded"></i>
  }

  const getVideoIcon = () => {
    if (!e?.isCameraAvailable) return null
    if (e?.cameraStatus === false) {
      return <i className="fa-solid fa-video-slash bg-black/50 text-white p-1 rounded"></i>
    }
    return <i className="fa-solid fa-video bg-black/50 text-white p-1 rounded"></i>
  }

  return (
    <div className="relative">
      <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
        <video
          ref={vidRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted={muted}
          style={{
            display: e?.videoStream && e?.cameraStatus ? "block" : "none",
            backgroundColor: "black",
          }}
        />
        {(!e?.videoStream || !e?.cameraStatus) && (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800">
            <div className="text-white text-4xl">
              <i className="fa-solid fa-user-circle"></i>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span className="text-sm bg-black/50 text-white px-2 py-1 rounded" style={{ textTransform: "capitalize" }}>
          {e?.name}
        </span>
        <div className="flex space-x-1">
          {getMicIcon()}
          {/* <i className="fa-solid fa-microphone-slash bg-black/50 text-white p-1 rounded"></i> */}
          {getVideoIcon()}
        </div>
      </div>
    </div>
  )
}
