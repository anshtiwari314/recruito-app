"use client"

import React, { useContext, useEffect, useCallback, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAppSelector } from "../store/store"
import { useDispatch } from "react-redux"
import { updateMyState, UserTypeInitialLoadState } from "../reducers/myStateReducer"
import { addNewUserAction, removeUserAction } from "../reducers/usersReducer"
import { gettingVideoStream, gettingAudioStream } from "../functions/mettingsUtils"

const TestWrapperContext = React.createContext("testWrapper")

export function useTestWrapper() {
  return useContext(TestWrapperContext)
}

export default function TestWrapper({ children }) {
  const dispatch = useDispatch()
  const [users, myState] = useAppSelector((state) => [state.usersReducer, state.myStateReducer])
  //const [videoPeer,isVideoPeer_Connected,videoPeer_Connections,videoPeer_connectToPeer,peer1_sendToPeer] = usePeer(myState.id)
 //const [audioPeer,isAudioPeer_Connected,audioPeer_Connections,audioPeer_connectToPeer,audioPeer_sendToPeer] = usePeer(myState.audioPeerId)
 //const [screenPeer,isScreenPeer_Connected,screenPeer_Connections,screenPeer_connectToPeer,screenPeer_sendToPeer] = usePeer(myState.peer2Id)

  const { CuesList, jobDescription, interviewGuide, jobTitle } = useAppSelector((state) => state.cuesReducer)

  const init = useCallback(
    async (id: string) => {
      const tempUser = { ...UserTypeInitialLoadState }
      tempUser.id = id
      tempUser.audioPeerId = uuidv4()
      tempUser.peer2Id = uuidv4()
      tempUser.name=sessionStorage.getItem("userName")

      try {
        console.log("Initializing media streams for user:", id)
        const videoStream = await gettingVideoStream()
        if (videoStream) {
          console.log("Video stream obtained successfully")
          tempUser.videoStream = videoStream
          tempUser.isCameraAvailable = true
          tempUser.cameraStatus = true
        } else {
          console.log("Failed to get video stream")
          tempUser.videoStream = null
          tempUser.isCameraAvailable = false
          tempUser.cameraStatus = false
        }

        const audioStream = await gettingAudioStream()
        if (audioStream) {
          console.log("Audio stream obtained successfully")
          tempUser.audioStream = audioStream
          tempUser.isMicrophoneAvailable = true
          tempUser.microphoneStatus = true
        } else {
          console.log("Failed to get audio stream")
          tempUser.audioStream = null
          tempUser.isMicrophoneAvailable = false
          tempUser.microphoneStatus = false
        }
      } catch (err) {
        console.error("Error initializing media streams:", err.message)
      } finally {
        console.log("Updating user state with streams:", {
          hasVideo: !!tempUser.videoStream,
          hasAudio: !!tempUser.audioStream,
        })

        dispatch(updateMyState(tempUser))
        dispatch(addNewUserAction(tempUser))
      }
    },
    [dispatch],
  )

  useEffect(() => {
    const id = uuidv4()
    console.log("Init with unique Id:", id)
    init(id)

    return () => {
      console.log("Cleaning whne dismount, removing user:", id)
      dispatch(removeUserAction({ id }))
    }
  }, [init, dispatch])

   // for  unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      users,
      myState,
    }),
    [users, myState],
  )
  //@ts-ignore
  return <TestWrapperContext.Provider value={contextValue}>{children}</TestWrapperContext.Provider>
}
