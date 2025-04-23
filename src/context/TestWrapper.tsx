
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

      try {
        const videoStream = await gettingVideoStream()
        const audioStream = await gettingAudioStream()

        if (videoStream) {
          tempUser.videoStream = videoStream
          tempUser.isCameraAvailable = true
        } else {
          tempUser.videoStream = false
          tempUser.isCameraAvailable = false
        }

        if (audioStream) {
          tempUser.audioStream = audioStream
          tempUser.isMicrophoneAvailable = true
        } else {
          tempUser.audioStream = false
          tempUser.isMicrophoneAvailable = false
        }
      } catch (err) {
        console.log("Error initializing media streams:", err.message)
      } finally {
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
      console.log("Cleaning on umount, removing user:", id)
      dispatch(removeUserAction({ id }))
    }
  }, [init, dispatch])

  useEffect(() => {
    console.log("Users count changed:", users.length)
  }, [users.length])

  useEffect(() => {
    console.log("MyState updated")
  }, [myState.id]) 

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
