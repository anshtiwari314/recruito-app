import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from "@/context/DataWrapper";
import { v4 as uuidv4 } from "uuid";
import ContentPanel from "@/components/ContentPanel";
import type { QPState } from "@/reducers/queryparamReducer";
import { setQP } from "@/reducers/queryparamReducer";
import { useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import RightPanel from "@/components/RightPanel";
import NotFound from "./NotFoundPage";
import Leave from "./LeavePage";
import MeetingPageHeader from "../components/MeetingPageHeader";

export default function MainPage() {
  //@ts-ignore
  const { setMyId, setName } = useData();
  const { isHost, meetingIsLegit } = useAppSelector((state) => state.qpReducer);
  const { jobTitle } = useAppSelector((state) => state.cuesReducer);
  const { closeCall } = useAppSelector((state) => state.nvReducer);

  const dispatch = useDispatch();
  const [meetingIsLegitMain, setMeetingIsLegitMain] = useState<boolean>(true);
  const { link } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [tempIsHost, setTempIsHost] = useState<boolean | null>(null);



  function overRideConsoleLogsOld(initialRoomId, initialUserId, initialUsername) {
      let currentRoomId = initialRoomId || 'default_room';
      let currentUserId = initialUserId || 'anonymous_user';
      let currentUsername = initialUsername || 'browser_logs'; // Default username for log file part
  
      // Store a reference to the original console methods
      const originalConsole = {
          log: console.log,
          warn: console.warn,
          error: console.error
      };
  
      // Configuration for the logging endpoint
      const LOGGING_ENDPOINT = 'http://localhost:3001/api/log'; // Ensure this matches your server
      const BATCH_INTERVAL_MS = 2000;      // Send logs every 2 seconds
      const MAX_BATCH_SIZE = 10;           // Max logs per batch
      const LOG_LEVELS = {                 // Map console methods to log levels
          log: 'INFO',
          warn: 'WARN',
          error: 'ERROR'
      };
  
      let logQueue = [];
      let timeoutId = null;
  
      /**
       * Sends a batch of logs to the server.
       */
      function sendLogsToServer() {
          if (logQueue.length === 0) {
              return;
          }
  
          const logsToSend = logQueue.splice(0, MAX_BATCH_SIZE);
          if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
          }
  
          fetch(LOGGING_ENDPOINT, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ logs: logsToSend }),
              keepalive: true
          })
          .then(response => {
              if (!response.ok) {
                  originalConsole.error('Failed to send logs to server:', response.status, response.statusText);
              }
          })
          .catch(error => {
              originalConsole.error('Error sending logs to server:', error);
          });
  
          if (logQueue.length > 0) {
              timeoutId = setTimeout(sendLogsToServer, BATCH_INTERVAL_MS);
          }
      }
  
      /**
       * Queues a log message and schedules batch sending.
       * @param {string} level - The log level (e.g., 'INFO', 'WARN', 'ERROR').
       * @param {Array<any>} args - The arguments passed to the console method.
       */
      function queueLog(level, args) {
          const message = args.map(arg => {
              if (typeof arg === 'object' && arg !== null) {
                  try {
                      return JSON.stringify(arg);
                  } catch (e) {
                      return `[Circular Object or Unserializable: ${String(arg)}]`;
                  }
              }
              return String(arg);
          }).join(' ');
  
          logQueue.push({
              timestamp: new Date().toISOString(),
              level: level,
              message: message,
              roomId: currentRoomId,
              userId: currentUserId,   // Include userId
              username: currentUsername, // Include username (replaces logName)
              userAgent: navigator.userAgent,
              url: window.location.href,
              stack: level === 'ERROR' && new Error().stack ? new Error().stack : undefined
          });
  
          if (!timeoutId) {
              timeoutId = setTimeout(sendLogsToServer, BATCH_INTERVAL_MS);
          } else if (logQueue.length >= MAX_BATCH_SIZE) {
              sendLogsToServer();
          }
      }
  
      // Override console.log
      console.log = function(...args) {
          originalConsole.log.apply(this, args);
          queueLog(LOG_LEVELS.log, args);
      };
  
      // Override console.warn
      console.warn = function(...args) {
          originalConsole.warn.apply(this, args);
          queueLog(LOG_LEVELS.warn, args);
      };
  
      // Override console.error
      console.error = function(...args) {
          originalConsole.error.apply(this, args);
          queueLog(LOG_LEVELS.error, args);
      };
  
      // Capture uncaught errors and unhandled promise rejections
      window.addEventListener('error', (event) => {
          queueLog('ERROR', [`Uncaught Error: ${event.message}`, `File: ${event.filename}`, `Line: ${event.lineno}, Col: ${event.colno}`]);
      });
  
      window.addEventListener('unhandledrejection', (event) => {
          queueLog('ERROR', [`Unhandled Promise Rejection: ${event.reason}`]);
      });
  
      // New function to update the logger context (roomId, userId, username)
      window.setClientLoggerContext = function(newRoomId, newUserId, newUsername) {
          currentRoomId = newRoomId || currentRoomId;
          currentUserId = newUserId || currentUserId;
          currentUsername = newUsername || currentUsername; // Update username
          originalConsole.log(`Client-side logger context updated: RoomID=${currentRoomId}, UserID=${currentUserId}, Username=${currentUsername}`);
      };
  
      originalConsole.log("Client-side console logger initialized.");
  
      //(window.initialPeerId, window.initialUserId, window.initialUsername);
  }

  function overRideConsoleLogs(initialRoomId, initialUserId, initialUsername) {
     let currentRoomId = initialRoomId || 'default_room';
     let currentUserId = initialUserId || 'anonymous_user';
     let currentUsername = initialUsername || 'browser_logs'; // Default username for log file part
 
     // Store a reference to the original console methods
     const originalConsole = {
         log: console.log,
         warn: console.warn,
         error: console.error
     };
 
     // Configuration for the logging endpoint
     const LOGGING_ENDPOINT = 'http://localhost:3005/api/log'; // Ensure this matches your server
     const BATCH_INTERVAL_MS = 2000;      // Send logs every 2 seconds
     const MAX_BATCH_SIZE = 10;           // Max logs per batch
     const LOG_LEVELS = {                 // Map console methods to log levels
         log: 'INFO',
         warn: 'WARN',
         error: 'ERROR'
     };
 
     let logQueue = [];
     let timeoutId = null;
 
     /**
      * Sends a batch of logs to the server.
      */
     function sendLogsToServer() {
         if (logQueue.length === 0) {
             return;
         }
 
         const logsToSend = logQueue.splice(0, MAX_BATCH_SIZE);
         if (timeoutId) {
             clearTimeout(timeoutId);
             timeoutId = null;
         }
 
         fetch(LOGGING_ENDPOINT, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({ logs: logsToSend }),
             keepalive: true
         })
         .then(response => {
             if (!response.ok) {
                 originalConsole.error('Failed to send logs to server:', response.status, response.statusText);
             }
         })
         .catch(error => {
             originalConsole.error('Error sending logs to server:', error);
         });
 
         if (logQueue.length > 0) {
             timeoutId = setTimeout(sendLogsToServer, BATCH_INTERVAL_MS);
         }
     }
 
     /**
      * Queues a log message and schedules batch sending.
      * @param {string} level - The log level (e.g., 'INFO', 'WARN', 'ERROR').
      * @param {Array<any>} args - The arguments passed to the console method.
      */
     function queueLog(level, args) {
         // The 'message' field will contain a joined string for simpler display if originalArgs are not used.
         // This is primarily for backward compatibility or simpler parsing if needed.
         const message = args.map(arg => {
             if (typeof arg === 'object' && arg !== null) {
                 try {
                     return JSON.stringify(arg);
                 } catch (e) {
                     return `[Circular Object or Unserializable: ${String(arg)}]`;
                 }
             }
             return String(arg);
         }).join(' ');
 
         logQueue.push({
             timestamp: new Date().toLocaleString(), // Changed from toISOString() to toLocaleString()
             level: level,
             message: message, // A flattened string representation of the log
             // Store the original arguments array to preserve type information for console coloring
             originalArgs: args.map(arg => {
                 // For objects, deep clone them or serialize/deserialize to handle circular references
                 // and ensure they are independent copies for storage.
                 if (typeof arg === 'object' && arg !== null) {
                     try {
                         // Using JSON.parse(JSON.stringify(arg)) for a simple deep copy,
                         // handle cases where it might fail (e.g., functions, complex types).
                         return JSON.parse(JSON.stringify(arg));
                     } catch (e) {
                         return `[Circular Object or Unserializable: ${String(arg)}]`;
                     }
                 }
                 return arg; // Primitives (string, number, boolean) can be stored directly
             }),
             roomId: currentRoomId,
             userId: currentUserId,
             username: currentUsername, // Include username
             userAgent: navigator.userAgent,
             url: window.location.href,
             stack: level === 'ERROR' && new Error().stack ? new Error().stack : undefined
         });
 
         if (!timeoutId) {
             timeoutId = setTimeout(sendLogsToServer, BATCH_INTERVAL_MS);
         } else if (logQueue.length >= MAX_BATCH_SIZE) {
             sendLogsToServer();
         }
     }
 
     // Override console.log
     console.log = function(...args) {
         originalConsole.log.apply(this, args);
         queueLog(LOG_LEVELS.log, args);
     };
 
     // Override console.warn
     console.warn = function(...args) {
         originalConsole.warn.apply(this, args);
         queueLog(LOG_LEVELS.warn, args);
     };
 
     // Override console.error
     console.error = function(...args) {
         originalConsole.error.apply(this, args);
         queueLog(LOG_LEVELS.error, args);
     };
 
     // Capture uncaught errors and unhandled promise rejections
     window.addEventListener('error', (event) => {
         // Pass the full error object or relevant parts to capture stack trace
         queueLog('ERROR', [`Uncaught Error: ${event.message}`, `File: ${event.filename}`, `Line: ${event.lineno}, Col: ${event.colno}`, event.error]);
     });
 
     window.addEventListener('unhandledrejection', (event) => {
         // Capture the reason of the unhandled promise rejection
         queueLog('ERROR', [`Unhandled Promise Rejection: ${event.reason}`]);
     });
 
     // New function to update the logger context (roomId, userId, username)
     window.setClientLoggerContext = function(newRoomId, newUserId, newUsername) {
         currentRoomId = newRoomId || currentRoomId;
         currentUserId = newUserId || currentUserId;
         currentUsername = newUsername || currentUsername; // Update username
         originalConsole.log(`Client-side logger context updated: RoomID=${currentRoomId}, UserID=${currentUserId}, Username=${currentUsername}`);
     };
 
     originalConsole.log("Client-side console logger initialized.");
 
 }
 
  // Handle viewport resizing
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 800);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (sessionStorage.getItem("exitdone") !== null) {
      setMeetingIsLegitMain(false);
      return;
    }

    const query = window.location.search.slice(1);
    const parts = query.split("&");
    const roomParam = parts[0] || "";
    const candidParam = parts[1] || "";

    // Validate presence
    if (!roomParam.trim() || !candidParam.trim()) {
      setMeetingIsLegitMain(false);
      return;
    }

    // Store in local state if needed
    // e.g., setRoomId(roomParam); setCandid(candidParam);

    // Get or prompt user name
    let myName = sessionStorage.getItem("userName") ?? "";
    if (myName.length < 2) {
      while (myName.length < 2) {
        myName = prompt("Please enter your name") ?? "";
        if (myName.length < 2) alert("Name must be at least 2 characters");
      }
      sessionStorage.setItem("userName", myName);
    }

    
    setName(myName);

    // Authentication flow
    const checkLogin = async () => {
      try {
        const res1 = await fetch(
          "https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/check-jarvis-login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client: "recruito", userid: myName }),
          }
        );
        const data1 = await res1.json();
        if (!data1.result) return { isAuthenticated: false };

        const password = prompt("Please provide the password") ?? "";
        sessionStorage.setItem("userPassword", password);
        const res2 = await fetch(
          "https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/check-jarvis-login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client: "recruito", userid: myName, password }),
          }
        );
        const data2 = await res2.json();
        return { isAuthenticated: data2.result === true };
      } catch (err) {
        console.error(err);
        return { isAuthenticated: false };
      }
    };

    const initialize = async () => {
      const login = await checkLogin();
      if (!isMounted) return;
      setTempIsHost(login.isAuthenticated);

      // Fetch agent ID
      let agentId = "";
      try {
        const agentRes = await fetch(
          "https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/recruito-upload-apis/main_router",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              trigger_func: "get_agent_id",
              params: { user_name: myName, password: sessionStorage.getItem("userPassword") ?? "" },
            }),
          }
        );
        const agentData = await agentRes.json();
        if (agentData.agentid) {
          agentId = agentData.agentid;
          sessionStorage.setItem("agent_id", agentId);
        }
      } catch (err) {
        console.error("Failed to fetch agent id:", err);
      }

      // Dispatch query params
      const qParams: QPState = {
        roomId: roomParam,
        candid: candidParam,
        agentId,
        isHost: login.isAuthenticated,
        name: myName,
        meetingIsLegit: true,
      };
      dispatch(setQP(qParams));
      let id = uuidv4()
      console.log('initialization',roomParam,id,myName)
      //overRideConsoleLogs(roomParam,id,myName)
      setMyId(id);
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Warn on tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  //http://localhost:5173/?anuj-anuj-anuj&cid_7761

  return (
    <>
      {tempIsHost === null ? (
        "Authenticating ..."
      ) : meetingIsLegitMain ? (
        closeCall ? (
          <Leave />
        ) : (
          <div className="overflow-y-auto w-screen min-h-screen relative bg-neutral-50" style={{ height: '85vh', width: '100vw' }}>
            <MeetingPageHeader />
            <main id="main-content" className="flex h-[calc(100vh-120px)]">
            {/* grow w-10/12 p-6 */}
              <div id="content-panel" className="relative grow w-10/12 px-3 py-4 overflow-y-hidden" >
                <ContentPanel isMobile={isMobile} />
              </div>
              <RightPanel />
            </main>
          </div>
        )
      ) : (
        <NotFound />
      )}
    </>
  );
}
