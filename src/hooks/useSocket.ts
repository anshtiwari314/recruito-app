"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { io } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"

const useSocket = (
  url: string,
  options = {},
  socketConnectedFirstTime,
): [
  boolean,
  (event: string, ...args: any) => void,
  (event: string, callback: (...args: any[]) => void) => void,
  (event: string, callback: (...args: any[]) => void) => void,
  boolean,
] => {
    //coz it was cauisng issue so i mentioned the type
  const socketRef = useRef<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const firstTimeConnect = useRef(false)

  useEffect(() => {
    console.log("Socket URL:", url)
  }, [url])

  // Create socket connection only once or when URL changes
  useEffect(() => {
    // Only create a new socket if one doesn't exist or if the URL changed
    if (!socketRef.current || socketRef.current.io.uri !== url) {
      // Disconnect existing socket if it exists
      if (socketRef.current) {
        console.log("Disconnecting existing socket before creating new one")
        socketRef.current.disconnect()
      }

      console.log("Creating new socket connection to:", url)
      const socket = io(url, options)
      socketRef.current = socket

      // Event: Connection established
      socket.on("connect", () => {
        console.log("Socket connected with ID:", socket.id)
        setIsConnected(true)
        socket.emit("connected", uuidv4(), uuidv4())

        if (!firstTimeConnect.current) {
          firstTimeConnect.current = true
          socketConnectedFirstTime()
        }
      })

      // Event: Connection disconnected
      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id)
        setIsConnected(false)
      })
      socket.on("reconnect", (attempt) => {
        console.log("Socket reconnected, attempt:", attempt)
        setIsConnected(true)
        socketConnectedFirstTime()
      })
    }
    
    // Cleanup function to disconnect the socket
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection")
        socketRef.current.disconnect()
      }
    }
  }, [url]) // Only depend on the URL, not options or socketConnectedFirstTime

  // Memoize event emitter to maintain stable reference
  const emitEvent = useCallback((event: string, ...args: any[]) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log(`Emitting event: ${event}`)
      socketRef.current.emit(event, ...args)
    } else {
      console.log(`Cannot emit ${event}, socket not connected`)
    }
  }, [])

  // Memoize event listeners to maintain stable references
  const onEvent = useCallback((event, callback) => {
    if (socketRef.current) {
      console.log(`Registering listener for: ${event}`)
      socketRef.current.on(event, callback)
    }
  }, [])

  const offEvent = useCallback((event, callback) => {
    if (socketRef.current) {
      console.log(`Removing listener for: ${event}`)
      socketRef.current.off(event, callback)
    }
  }, [])

  return [isConnected, emitEvent, onEvent, offEvent, firstTimeConnect.current]
}

export default useSocket
