import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (
  url: string,
  options = {}
): [
  boolean,
  (event: string, data: any) => void,
  (event: string, callback: (...args: any[]) => void) => void,
  (event: string, callback: (...args: any[]) => void) => void
] => {
  //coz it was cauisng issue so i mentioned the type
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create a new Socket.IO connection
    const socket = io(url, options);
    socketRef.current = socket;

    // Event: Connection established
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected:", socket.id);
    });

    // Event: Connection disconnected
    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    // Cleanup function to disconnect the socket
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, options]);

  // Function to emit events
  const emitEvent = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  // Function to listen to events
  const onEvent = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  //function to stop listening to an event
  const offEvent = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return [isConnected, emitEvent, onEvent, offEvent];
};

export default useSocket;
