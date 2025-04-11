import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const useSocket = (
  url: string,
  options = {},
  socketConnectedFirstTime
  ): [
  boolean,
  (event: string, data: any) => void,
  (event: string, callback: (...args: any[]) => void) => void,
  (event: string, callback: (...args: any[]) => void) => void
] => {
  //coz it was cauisng issue so i mentioned the type
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const countRef = useRef(0)
  const firstTimeConnect  = useRef(false)
  
  
  

  useEffect(()=>{
    console.log('url in usesocket get changed',url)
  },[url,options])

  useEffect(() => {
    // if(socketRef.current)
    //   return ;
    // Create a new Socket.IO connection
    const socket = io(url, options);
    socketRef.current = socket;

    // Event: Connection established
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
     // setIsConnected(true);

     socket.emit('connected',uuidv4(),uuidv4())
     // join room every time 
     
    
      if(firstTimeConnect.current===false){
        firstTimeConnect.current = true
        socketConnectedFirstTime()
      }
        
      
    });

    // Event: Connection disconnected
    socket.on("disconnect", () => {
      
      console.log("Socket disconnected",socket.id);
      //setIsConnected(false);
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

  return [isConnected, emitEvent, onEvent, offEvent,firstTimeConnect.current];
};

export default useSocket;
