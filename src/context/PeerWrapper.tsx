"use client"
import type React from "react"
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react"
import Peer, { type MediaConnection } from "peerjs"
import { v4 as uuidv4 } from "uuid"
import { useDispatch } from "react-redux"
import { useAppSelector } from "../store/store"
import { createPeerOptions } from "../functions/mettingUtils3"
import {
  addNewUserAction,
  removeUserAction,
  setUserAudioStreamAction,
  setUserLoadingAction,
  setUserStreamAction,
  setUserVideoStreamAction,
  updateUserAction,
  type UserType,
} from "../reducers/usersReducer"
import { useSocketWrapper } from "./SocketWrapper"

const PeerWrapperContext = createContext<any>(null)
export function usePeerWrapper() {
  const ctx = useContext(PeerWrapperContext)
  if (!ctx) throw new Error("usePeerWrapper must be inside PeerWrapper")
  return ctx
}

export default function PeerWrapper({ children }: { children: React.ReactNode }) {
  console.log("PeerWrapper rendering")

  const { isSocket1_Connected, socket1_emitEvent }: any = useSocketWrapper()
  const dispatch = useDispatch()
  const [users, myState] = useAppSelector((state) => [state.usersReducer, state.myStateReducer])

  const connectionAttemptsRef = useRef<Record<string, boolean>>({}) //for tracing already made cnntion or if tried already

  const [videoPeer, setVideoPeer] = useState<Peer | null>(null)
  const [screenPeer, setScreenPeer] = useState<Peer | null>(null)
  const [audioPeer, setAudioPeer] = useState<Peer | null>(null)

  const videoPeerRef = useRef<Record<string, MediaConnection>>({})
  const videoPeerArrRef = useRef<string[]>([])
  const screenPeersRef = useRef<Record<string, MediaConnection>>({})
  const screenPeersArrRef = useRef<string[]>([])
  const audioPeerRef = useRef<Record<string, MediaConnection>>({})
  const audioPeerArrRef = useRef<string[]>([])

  const peerOptions = createPeerOptions()
  //we will init the users
  useEffect(() => {
    if (!myState?.id) return

    console.log("Initializing Peers for:", myState.id)
    const screenPeerId = myState.peer2Id || uuidv4()
    const audioPeerId = myState.audioPeerId || uuidv4()

    const newVideoPeer = new Peer(myState.id, peerOptions)
    const newScreenPeer = new Peer(screenPeerId, peerOptions)
    const newAudioPeer = new Peer(audioPeerId, peerOptions)

    setVideoPeer(newVideoPeer)
    setScreenPeer(newScreenPeer)
    setAudioPeer(newAudioPeer)

    return () => {
      console.log("Destroying peers")
      newAudioPeer.destroy()
      newScreenPeer.destroy()
      newVideoPeer.destroy()
    }
  }, [myState.id, peerOptions])
  //removing the users from peers helperfxn
  const removeUserFromVidPeersArr = useCallback((userId: string) => {
    videoPeerArrRef.current = videoPeerArrRef.current.filter((id) => id !== userId)
  }, [])

  const removeUserFromScreenPeersArr = useCallback((id: string) => {
    screenPeersArrRef.current = screenPeersArrRef.current.filter((sid) => sid !== id)
  }, [])

  const removeUserFromAudioPeersArr = useCallback((id: string) => {
    audioPeerArrRef.current = audioPeerArrRef.current.filter((aid) => aid !== id)
  }, [])

  const removeUserFromPeers = useCallback(
    (userId: string) => {
      console.log("Removing user from peers:", userId)
      const u = users.find((u) => u.id === userId)
      const peer2Id = u?.peer2Id
      const audioId = u?.audioPeerId

      if (videoPeerArrRef.current.includes(userId) && videoPeerRef.current[userId]) {
        videoPeerRef.current[userId].close()
        delete videoPeerRef.current[userId]
        removeUserFromVidPeersArr(userId)
      }

      if (peer2Id && screenPeersRef.current[peer2Id]) {
        screenPeersRef.current[peer2Id].close()
        delete screenPeersRef.current[peer2Id]
        removeUserFromScreenPeersArr(peer2Id)
      }

      if (audioId && audioPeerRef.current[audioId]) {
        audioPeerRef.current[audioId].close()
        delete audioPeerRef.current[audioId]
        removeUserFromAudioPeersArr(audioId)
      }

      // Also remove from connection attempts tracking
      if (connectionAttemptsRef.current[userId]) {
        delete connectionAttemptsRef.current[userId]
      }

      dispatch(removeUserAction({ id: userId }))
    },
    [users, dispatch, removeUserFromVidPeersArr, removeUserFromScreenPeersArr, removeUserFromAudioPeersArr],
  )

  // Send video stream to a user
  const sendVideoToUser = useCallback(
    (stream: MediaStream, newUserId: string) => {
      if (!videoPeer || !stream) {
        console.log("Nothing to send: missing videoPeer or stream")
        return
      }

      try {
        console.log("Sending video to", newUserId)

        // Check if we already have a connection
        if (videoPeerRef.current[newUserId]) {
          console.log("Already have a video connection to", newUserId)
          return
        }

        // Call the peer with our stream
        const call = videoPeer.call(newUserId, stream)

        if (!call) {
          console.log(`Failed to establish video call with ${newUserId}`)
          return
        }

        // Store the call
        videoPeerRef.current[newUserId] = call

        // Add to our array of peers if not already there
        if (!videoPeerArrRef.current.includes(newUserId)) {
          videoPeerArrRef.current.push(newUserId)
        }

        call.on("close", () => {
          console.log("Video call closed with peer", call.peer)
          delete videoPeerRef.current[call.peer]
          removeUserFromVidPeersArr(call.peer)
        })

        console.log("Video call established with", newUserId)
      } catch (err) {
        console.error("Error sending video to user:", err)
      }
    },
    [videoPeer, removeUserFromVidPeersArr],
  )

  // Send audio stream to a user
  const sendAudioToUser = useCallback(
    (stream, newUserId: string) => {
      if (!audioPeer || !stream) {
        console.log("Nothing to send: missing audioPeer or stream")
        return
      }

      try {
        console.log("Sending audio to", newUserId)

        // Check if we already have a connection
        if (audioPeerRef.current[newUserId]) {
          console.log("Already have an audio connection to", newUserId)
          return
        }

        // Call the peer with our stream
        const call = audioPeer.call(newUserId, stream)

        if (!call) {
          console.log(`Failed to establish audio call with ${newUserId}`)
          return
        }

        // Store the call
        audioPeerRef.current[newUserId] = call

        // Add to our array of peers if not already there
        if (!audioPeerArrRef.current.includes(newUserId)) {
          audioPeerArrRef.current.push(newUserId)
        }

        call.on("close", () => {
          console.log("Audio call closed with peer", call.peer)
          delete audioPeerRef.current[call.peer]
          removeUserFromAudioPeersArr(call.peer)
        })

        console.log("Audio call established with", newUserId)
      } catch (err) {
        console.error("Error sending audio to user:", err)
      }
    },
    [audioPeer, removeUserFromAudioPeersArr],
  )

  // Send screen share to a user
  const sendScreenToUser = useCallback(
    (stream: MediaStream, newUserId: string) => {
      if (!screenPeer || !stream) {
        console.log("Nothing to send: missing screenPeer or stream")
        return
      }

      console.log("Sending screen to", newUserId)

      let call = screenPeer.call(newUserId, stream)
      let retryCnt = 0

      while (!call && retryCnt < 3) {
        console.log(`Retrying screen call to ${newUserId}, attempt ${retryCnt + 1}`)
        call = screenPeer.call(newUserId, stream)
        retryCnt++
      }

      if (!call) {
        console.log(`Failed to establish screen call with ${newUserId}`)
        return
      }

      // Store the call
      screenPeersRef.current[call.peer] = call

      call.on("close", () => {
        console.log("Screen call closed with peer", call.peer)
      })

      console.log("Screen call established with", newUserId)
    },
    [screenPeer],
  )

  // Set up event listeners for P2P connections
  useEffect(() => {
    if (!videoPeer || !screenPeer || !audioPeer || !myState?.id) {
      return
    }

    console.log("Setting up peer event listeners")

    // Handle incoming vid calls
    const handleVidCall = (call) => {
      console.log("Incoming video call from:", call.peer)

      call.answer()

      call.on("stream", (userVidStream) => {
        console.log("Received video stream from:", call.peer)

        // Storing the call incoming
        videoPeerRef.current[call.peer] = call

        const user = users.find((u) => u.id === call.peer)
        if (user) {
          console.log("Updating video stream for user:", user.id)

          dispatch(
            setUserStreamAction({
              id: user.id,
              stream: userVidStream,
            }),
          )

          dispatch(
            setUserVideoStreamAction({
              id: user.id,
              videoStream: userVidStream,
            }),
          )

          dispatch(
            setUserLoadingAction({
              id: user.id,
              isLoading: false,
            }),
          )
        } else {
          console.log("User not found for peer:", call.peer)
        }
      })

      call.on("close", () => {
        console.log("Video call closed by peer:", call.peer)
        if (videoPeerRef.current[call.peer]) {
          delete videoPeerRef.current[call.peer]
        }
      })

      call.on("error", (err) => {
        console.error("Video call error:", err)
        call.close()
        if (videoPeerRef.current[call.peer]) {
          delete videoPeerRef.current[call.peer]
        }
      })
    }

    // Handle incoming screen share calls
    const handleScreenCall = (call) => {
      console.log("Incoming screen call from:", call.peer)
      call.answer()

      call.on("stream", (userScreenStream) => {
        console.log("Received screen stream from:", call.peer)
        screenPeersRef.current[call.peer] = call

        for (let idx = 0; idx < users.length; idx++) {
          if (users[idx].peer2Id === call.peer && users[idx].containsScreenStream === true) {
            dispatch(
              setUserStreamAction({
                id: users[idx].id,
                stream: userScreenStream,
              }),
            )
            dispatch(
              setUserLoadingAction({
                id: users[idx].id,
                isLoading: false,
              }),
            )
            break
          }
        }
      })

      call.on("close", () => {
        console.log("Screen call closed by peer:", call.peer)
        if (screenPeersRef.current[call.peer]) {
          delete screenPeersRef.current[call.peer]
        }
      })
    }

    // Handle incoming audio calls
    const handleAudioCall = (call) => {
      console.log("Incoming audio call from:", call.peer)
      call.answer()

      call.on("stream", (userAudioStream) => {
        console.log("Received audio stream from:", call.peer)
        audioPeerRef.current[call.peer] = call

        for (let i = 0; i < users.length; i++) {
          if (users[i].audioPeerId === call.peer) {
            dispatch(
              setUserAudioStreamAction({
                id: users[i].id,
                audioStream: userAudioStream,
              }),
            )

            dispatch(
              setUserLoadingAction({
                id: users[i].id,
                isLoading: false,
              }),
            )
            break
          }
        }
      })

      call.on("close", () => {
        console.log("Audio call closed by peer:", call.peer)
        if (audioPeerRef.current[call.peer]) {
          delete audioPeerRef.current[call.peer]
        }
      })

      call.on("error", (err) => {
        console.error("Audio call error:", err)
        call.close()
        if (audioPeerRef.current[call.peer]) {
          delete audioPeerRef.current[call.peer]
        }
      })
    }

    // Handle peer connection events
    const handlePeerOpen = () => {
      console.log("Video peer connection opened")
    }

    const handleScreenPeerOpen = () => {
      console.log("Screen peer connection opened")
    }

    const handleAudioPeerOpen = () => {
      console.log("Audio peer connection opened")
    }

    // Register event handlers
    videoPeer.on("call", handleVidCall)
    audioPeer.on("call", handleAudioCall)
    screenPeer.on("call", handleScreenCall)

    videoPeer.on("open", handlePeerOpen)
    screenPeer.on("open", handleScreenPeerOpen)
    audioPeer.on("open", handleAudioPeerOpen)

    videoPeer.on("error", (err) => console.error("Video peer error:", err))
    screenPeer.on("error", (err) => console.error("Screen peer error:", err))
    audioPeer.on("error", (err) => console.error("Audio peer error:", err))

    // Clean up event handlers
    return () => {
      videoPeer.off("call", handleVidCall)
      audioPeer.off("call", handleAudioCall)
      screenPeer.off("call", handleScreenCall)

      videoPeer.off("open", handlePeerOpen)
      screenPeer.off("open", handleScreenPeerOpen)
      audioPeer.off("open", handleAudioPeerOpen)

      videoPeer.off("error", () => {})
      screenPeer.off("error", () => {})
      audioPeer.off("error", () => {})
    }
  }, [videoPeer, screenPeer, audioPeer, myState?.id, dispatch, users])

  // Connect to a user with our streams
  const connectToUser = useCallback(
    (userData: UserType) => {
      if (!userData || !userData.id) {
        console.error("Invalid user data for connection")
        return
      }

      // Check if we've already attempted to connect to this user
      if (connectionAttemptsRef.current[userData.id]) {
        return
      }

      console.log("Connecting to user:", userData.id)

      // Mark that we've attempted to connect to this user
      connectionAttemptsRef.current[userData.id] = true

      // Add user to our arrays if not already there
      if (!videoPeerArrRef.current.includes(userData.id)) {
        videoPeerArrRef.current.push(userData.id)
      }

      if (userData.audioPeerId && !audioPeerArrRef.current.includes(userData.audioPeerId)) {
        audioPeerArrRef.current.push(userData.audioPeerId)
      }

      if (userData.peer2Id && !screenPeersArrRef.current.includes(userData.peer2Id)) {
        screenPeersArrRef.current.push(userData.peer2Id)
      }

      // Make sure the user exists in our users
      const userExists = users.find((user) => user.id === userData.id)
      if (!userExists) {
        dispatch(addNewUserAction(userData))
      }

      // Send our streams after a short delay
      setTimeout(() => {
        // Send video stream if we have one
        if (myState.videoStream instanceof MediaStream) {
          sendVideoToUser(myState.videoStream, userData.id)
        }

        // Send audio stream if we have one and the user has an audioPeerId
        if (myState.audioStream instanceof MediaStream && userData.audioPeerId) {
          sendAudioToUser(myState.audioStream, userData.audioPeerId)
        }
      }, 1000)

      console.log("Connection initiated with user:", userData.id)
    },
    [myState.videoStream, myState.audioStream, users, dispatch, sendVideoToUser, sendAudioToUser],
  )

  // Connect to users when our streams are ready
  useEffect(() => {
    // only proceed if we have our ID and peers are initialized
    if (!myState?.id || !videoPeer || !audioPeer) {
      return
    }

    // connect to all users that aren't ourselves
    users.forEach((user) => {
      if (user.id !== myState.id && !connectionAttemptsRef.current[user.id]) {
        connectToUser(user)
      }
    })
  }, [myState?.id, users, videoPeer, audioPeer, connectToUser])

  // handle for screen sharing
  const startScreenSharing = useCallback(async () => {
    try {
      console.log("Starting screen sharing")

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })

      console.log("Screen sharing started")

      users.forEach((user) => {
        if (user.id !== myState.id) {
          sendScreenToUser(screenStream, user.id)
        }
      })

      // Add event listener to detect when screen sharing stops
      screenStream.getVideoTracks()[0].onended = () => {
        console.log("Screen sharing stopped by browser")
        screenStream.getTracks().forEach((track) => track.stop())
      }

      return screenStream
    } catch (error) {
      console.error("Error starting screen share:", error)
      return null
    }
  }, [myState.id, users, sendScreenToUser])

  const stopScreenSharing = useCallback(() => {
    console.log("Stopping screen sharing")

    const screenUser = users.find((u) => u.containsScreenStream)

    if (!screenUser) {
      console.log("No active screen share found")
      return
    }

    const data:UserType={
      ...myState,
      isScreenSharingEnabled: false,
    }
    dispatch(
      updateUserAction(data),
    )

    if (screenUser.stream instanceof MediaStream) {
      screenUser.stream.getTracks().forEach((t) => t.stop())
    }

    Object.keys(screenPeersRef.current).forEach((peerId) => {
      screenPeersRef.current[peerId].close()
    })

    screenPeersRef.current = {}

    if (isSocket1_Connected) {
      socket1_emitEvent("screen-share-end-transmitter", {
        videoId: screenUser.id,
        peerId: screenPeer?.id,
      })
    }

    dispatch(removeUserAction({ id: screenUser.id }))
    console.log("Screen sharing ended")
  }, [myState, screenPeer, isSocket1_Connected, dispatch, users])

  // Create the context value
  const value = {
    videoPeer,
    screenPeer,
    audioPeer,
    videoPeersRef: videoPeerRef.current,
    screenPeersRef: screenPeersRef.current,
    audioPeersRef: audioPeerRef.current,
    removeUserFromPeers,
    sendVideoToUser,
    sendAudioToUser,
    sendScreenToUser,
    stopScreenSharing,
    startScreenSharing,
    connectToUser,
    getPeerStatus: () => ({
      videoPeerInitialized: Boolean(videoPeer),
      screenPeerInitialized: Boolean(screenPeer),
      audioPeerInitialized: Boolean(audioPeer),
    }),
  }
  //@ts-ignore
  return <PeerWrapperContext.Provider value={value}>{children}</PeerWrapperContext.Provider>
}
