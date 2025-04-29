import React from "react"
import { useDispatch } from "react-redux"
//@ts-ignore
import { useAppSelector } from "../store/store"
import { setNVclosecall, setNVaudioUploadAnimation } from "../reducers/navigationparamReducer"
import MeetingPageHeaderTimer from "./MeetingPageHeaderTimer"
import {
  clearAllUsersActions,
  toggleCameraAction,
  toggleMicrophoneAction,
  toggleScreenSharingAction,
} from "../reducers/usersReducer"
import { usePeerWrapper } from "../context/PeerWrapper"

export default function MeetingPageHeader() {
  const dispatch = useDispatch()
  const meUser = useAppSelector((state) => state.myStateReducer)
  const users=useAppSelector((state)=>state.usersReducer);
  console.log(meUser, "[[DEBUG]]")
  const { jobTitle } = useAppSelector((state) => state.cuesReducer)
  const { isHost } = useAppSelector((state) => state.qpReducer)
  //@ts-ignore
  const incomingUsers = useAppSelector((state) => state.usersReducer)
  console.log(incomingUsers)
  async function handleCloseCall() {
    const confirmQuit = window.confirm("Are you sure you want to quit?")
    console.log(confirmQuit)
    if (confirmQuit) {
      sessionStorage.setItem("exitdone", "true")
      dispatch(toggleMicrophoneAction({ id: meUser.id }))
      dispatch(toggleCameraAction({ id: meUser.id }))
      dispatch(setNVclosecall(true))
      dispatch(setNVaudioUploadAnimation(true))
      // await stopVideoRecording();
      dispatch(clearAllUsersActions())
      console.log("Closing the call...")
    }
  }
  const RealUser=users.find((u)=>u.id===meUser.id)
  console.log(RealUser);
  const toggleScreenSharing = async () => {
    if (users[0].isScreenSharingEnabled) {
      console.log("Stopping screen sharing")

      if (users[0].stream instanceof MediaStream) {
        users[0].stream.getTracks().forEach((track) => track.stop())
      }

      dispatch(
        toggleScreenSharingAction({
          id: users[0].id,
          enabled: false,
        }),
      )
      return
    }

    try {
      console.log("Starting screen sharing")
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })

      dispatch(
        toggleScreenSharingAction({
          id: meUser.id,
          enabled: true,
          screenStream: screenStream,
        }),
      )

      screenStream.getVideoTracks()[0].onended = () => {
        console.log("Screen sharing stopped via browser controls")
        dispatch(
          toggleScreenSharingAction({
            id: meUser.id,
            enabled: false,
          }),
        )
      }
    } catch (error) {
      console.error("Error starting screen share:", error)
    }
  }

  const toggleAudio = () => {
    dispatch(toggleMicrophoneAction({ id: meUser.id }))
    console.log("Toggling The Audio")
    console.log(incomingUsers)
  }

  const toggleVideo = () => {
    dispatch(toggleCameraAction({ id: meUser.id }))
    console.log("Toggling The Video")
    console.log(incomingUsers)
  }
  return (
    <header
      id="header"
      className="w-full bg-white border-b border-neutral-200 px-4 py-3 flex place-items-center justify-between shadow-sm"
      style={{ height: "10vh" }}
    >
      <div className="flex place-items-center space-x-4">
        <div className="h-8 w-[2px] bg-neutral-200"></div>
        <img src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=Logo" className="h-8" alt="Logo" />
        {jobTitle ? (
          <div className="text-md text-neutral-500">
            <div>Interview: {jobTitle}</div>
            <div style={{ textTransform: "capitalize" }}>Name</div>
          </div>
        ) : (
          <div className="text-md text-neutral-500">Recruiter Copilot</div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
          onClick={toggleVideo}
        >
          {users[0]?.cameraStatus ? (
            <i className="fa-solid fa-video fa-lg"></i>
          ) : (
            <i className="fa-solid fa-video-slash fa-lg"></i>
          )}
        </button>
        <button
          className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
          onClick={toggleAudio}
        >
          {users[0]?.microphoneStatus ? (
            <i className="fa-solid fa-microphone fa-lg"></i>
          ) : (
            <i className="fa-solid fa-microphone-slash fa-lg"></i>
          )}
        </button>
        <button
          className="py-3 px-6 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-neutral-700"
          onClick={toggleScreenSharing}
        >
          {users[0]?.isScreenSharingEnabled ? (
            <i className="fa-solid fa-circle-dot fa-lg text-red-500"></i>
          ) : (
            <i className="fa-solid fa-circle-dot fa-lg text-gray-500"></i>
          )}
        </button>
        <div className="h-8 w-[2px] bg-neutral-200"></div>
        <button
          className="px-8 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg flex items-center text-lg"
          onClick={handleCloseCall}
        >
          <i className="fa-solid fa-xmark mr-4 fa-lg"></i>
          End Call
        </button>
      </div>

      {isHost && <MeetingPageHeaderTimer />}
    </header>
  )
}
