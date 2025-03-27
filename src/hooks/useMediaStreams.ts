import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/store/tempStore.ts"
import { setVideoStream, setAudioStream, setScreenStream } from "@/store/slices/mediaSlice"
import { addUser, initialUser } from "@/store/slices/usersSlice"

export const useMediaStreams = () => {
  const dispatch = useAppDispatch()
  const { id, name, isAdmin } = useAppSelector((state) => state.media)
  const { roomId, custEmailId, agentId, audioPeer } = useAppSelector((state) => state.connection)

  const getVideoStream = useCallback(async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          frameRate: {
            ideal: 60,
            min: 10,
          },
        },
        audio: false,
      })
      dispatch(setVideoStream(videoStream))
      return videoStream
    } catch (err) {
      console.log("Camera permission error:", err)
      dispatch(setVideoStream(false))
      return false
    }
  }, [dispatch])

  const getAudioStream = useCallback(async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      dispatch(setAudioStream(audioStream))
      return audioStream
    } catch (err) {
      console.log("Microphone permission error:", err)
      dispatch(setAudioStream(false))
      return false
    }
  }, [dispatch])

  const getScreenStream = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          //@ts-ignore
          cursor: "always",
        },
        audio: false,
      })
      dispatch(setScreenStream(screenStream))
      return screenStream
    } catch (err) {
      console.log("Screen sharing error:", err)
      return null
    }
  }, [dispatch])

  const initializeStreams = useCallback(async () => {
    if (!id || !roomId || !custEmailId || !name || !audioPeer || !agentId) return

    const tempObj = {
      ...initialUser,
      id,
      isAdmin,
      isLoading: false,
      roomId,
      custEmailId,
      agentId,
      name,
      audioPeerId: audioPeer.id,
    }

    const videoStream = await getVideoStream()
    if (videoStream instanceof MediaStream) {
      tempObj.videoStream = videoStream
      tempObj.isCameraAvailable = true
    } else {
      tempObj.isCameraAvailable = false
      tempObj.videoStream = false
    }

    const audioStream = await getAudioStream()
    if (audioStream instanceof MediaStream) {
      tempObj.audioStream = audioStream
      tempObj.isMicrophoneAvailable = true
    } else {
      tempObj.isMicrophoneAvailable = false
      tempObj.audioStream = false
    }

    dispatch(addUser(tempObj))
  }, [id, isAdmin, roomId, custEmailId, agentId, name, audioPeer, getVideoStream, getAudioStream, dispatch])

  return {
    getVideoStream,
    getAudioStream,
    getScreenStream,
    initializeStreams,
  }
}

