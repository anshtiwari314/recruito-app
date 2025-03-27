import { useCallback, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/store/tempStore.ts"
import { setCueLoading } from "@/store/slices/chatSlice"
import WavToMp3 from "@/functions/wavToMp3"
import { PostReq } from "@/functions/requests"
import { v4 as uuidv4 } from "uuid"

export const useRecording = () => {
  const dispatch = useAppDispatch()
  const { adminUrl, videoUploadUrl } = useAppSelector((state) => state.config)
  const { socket2 } = useAppSelector((state) => state.connection)
  const { users } = useAppSelector((state) => state.users)
  const { custEmailId, isHost } = useAppSelector((state) => state.qpReducer)

  const arrayOfChunksRef = useRef<BlobPart[]>([])
  const startAudioTimestampRef = useRef<string | null>(null)
  const globalStreamRef = useRef<MediaRecorder | null>(null)

  const getTimestamp = useCallback(() => {
    const now = new Date()
    const year = now.getUTCFullYear()
    const month = String(now.getUTCMonth() + 1).padStart(2, "0")
    const day = String(now.getUTCDate()).padStart(2, "0")
    const hours = String(now.getUTCHours()).padStart(2, "0")
    const minutes = String(now.getUTCMinutes()).padStart(2, "0")
    const seconds = String(now.getUTCSeconds()).padStart(2, "0")
    const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0")
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
  }, [])

  const sendToServer = useCallback(
    (blob: Blob, url: string, data: any) => {
      if (!socket2) return

      let date = new Date()
      console.log(`Just before sending the data ${date.toLocaleTimeString()}:${date.getMilliseconds()}`)

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result
        blob = null

        date = new Date()
        dispatch(setCueLoading(true))

        const payload = {
          roomid: "abc-123-fgh-456",
          jobid: "1",
          agentid: "1234",
          custemailid: custEmailId,
          isHost: isHost,
          name: users[0]?.name || "",
          init: data.init,
          audiomessage: base64data?.split(",")[1],
          timeStamp: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}`,
        }

        console.log("Sending data to server:", payload)
        socket2.emit("ai_suggestion_req", payload)
      }

      reader.readAsDataURL(blob)
    },
    [socket2, custEmailId, isHost, users, dispatch],
  )

  const sendVideoToServer = useCallback(
    async (blob: Blob, url: string, data: any) => {
      let date = new Date()
      console.log(`Just before sending the data ${date.toLocaleTimeString()}:${date.getMilliseconds()}`)

      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64data = reader.result
        blob = null

        date = new Date()
        dispatch(setCueLoading(true))

        const payload = {
          ...data,
          roomid: "abc-123-fgh-456",
          jobid: "1",
          agentid: "1234",
          custemailid: custEmailId,
          isHost: isHost,
          name: users[0]?.name || "",
          init: data.init,
          audiomessage: base64data?.split(",")[1],
          timeStamp: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}`,
        }

        console.log("Sending video data to server:", payload)
        const result = await PostReq(url, payload)
        console.log("Video send result:", result)
      }

      reader.readAsDataURL(blob)
    },
    [custEmailId, isHost, users, dispatch],
  )

  const startRecording = useCallback(
    (stream: MediaStream) => {
      const mediaRecorder = new MediaRecorder(stream, {
        audioBitsPerSecond: 32000,
      })

      mediaRecorder.ondataavailable = (event) => {
        arrayOfChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        try {
          console.log(`Just before processing audio ${new Date().toLocaleTimeString()}`)

          const audioBlob = new Blob(arrayOfChunksRef.current, { type: "audio/wav" })
          const convertedBlob = await WavToMp3(audioBlob)

          const audioFile = new File([convertedBlob], "audio.mp3", {
            type: "audio/mpeg",
          })

          arrayOfChunksRef.current = []

          // Upload the file
          uploadFile(audioFile)
        } catch (error) {
          console.error("Error processing recorded audio:", error)
        }
      }

      globalStreamRef.current = mediaRecorder
      startAudioTimestampRef.current = getTimestamp()
      mediaRecorder.start()
    },
    [getTimestamp],
  )

  const uploadFile = useCallback(
    (file: File) => {
      const uid = uuidv4()
      const chunkSize = 5 * 1024 * 1024
      const totalChunks = Math.ceil(file.size / chunkSize)
      let currentChunk = 0

      function uploadChunk(chunkStart: number) {
        const chunk = file.slice(chunkStart, chunkStart + chunkSize)

        const chunkFormData = new FormData()
        chunkFormData.append("original_file_name", file.name)
        chunkFormData.append("file", chunk)

        const fileExt = file.name.split(".").pop()
        chunkFormData.append("filename", `${uid}.${fileExt}`)
        chunkFormData.append("fileid", `${uid}`)
        chunkFormData.append("fileext", `${fileExt}`)
        chunkFormData.append("chunk", `${currentChunk}`)
        chunkFormData.append("startTime", `${startAudioTimestampRef.current}`)
        chunkFormData.append("roomid", "abc-123-fgh-456")
        chunkFormData.append("agentid", "1234")
        chunkFormData.append("ishost", String(isHost))
        chunkFormData.append("jobid", "1")
        chunkFormData.append("custemailid", String(custEmailId))
        chunkFormData.append("name", users[0]?.name || "")
        chunkFormData.append("totalChunks", `${totalChunks}`)

        const xhr = new XMLHttpRequest()

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = ((currentChunk * chunkSize + event.loaded) / file.size) * 100
            console.log(`Upload progress: ${Math.round(percentComplete)}%`)
          }
        }

        xhr.onload = () => {
          if (xhr.status === 200) {
            currentChunk++
            if (currentChunk < totalChunks) {
              uploadChunk(currentChunk * chunkSize)
            } else {
              console.log("File upload complete")
            }
          } else {
            console.error("Error uploading file:", xhr.responseText)
          }
        }

        xhr.onerror = () => {
          console.log("Network error or request failed")
        }

        xhr.open("POST", videoUploadUrl, true)
        xhr.send(chunkFormData)
      }

      uploadChunk(0)
    },
    [videoUploadUrl, isHost, custEmailId, users],
  )

  const stopRecording = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = globalStreamRef.current

      if (!mediaRecorder || mediaRecorder.state !== "recording") {
        console.warn("MediaRecorder is already stopped or not initialized.")
        resolve()
        return
      }

      try {
        mediaRecorder.stop()
        console.log("Stopping recording...")
        resolve()
      } catch (error) {
        console.error("Error stopping MediaRecorder:", error)
        reject(error)
      }
    })
  }, [])

  return {
    startRecording,
    stopRecording,
    sendToServer,
    sendVideoToServer,
  }
}

