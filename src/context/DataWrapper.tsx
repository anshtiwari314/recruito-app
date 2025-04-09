import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  useCallback,
} from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Peer from "peerjs";
import WavToMp3 from "../functions/wavToMp3";
import type { CuesDataType } from "../reducers/cuesReducer";
import {
  setCues,
  addCues,
  updateCues,
  initialCuesObj,
} from "../reducers/cuesReducer";
import { setNVaudioUploadAnimation } from "../reducers/navigationparamReducer";
import { useAppSelector } from "../store/store.ts";
import { useDispatch } from "react-redux";
import {
  TranscriptionDataType,
  addTranscription,
  initialTranscriptionObj,
} from "../reducers/transcriptionReducer";
import {
  getTimestamp,
  gettingAudioStream,
  gettingScreenStream,
  gettingVideoStream,
  isUserAvailable,
  processRecordedAudio,
  sendToServer,
  sendVideoToServer,
  stopVideoRecording,
} from "../functions/mettingsUtils";
import { addNewUserAction,removeUserAction,toggleCameraAction,toggleMicrophoneAction,setUserStreamAction,setUserVideoStreamAction,setUserAudioStreamAction,setUserLoadingAction,updateUserAvailabilityAction,setAllUserActions,type UserType} from "../reducers/usersReducer.ts";
import { bufferToWav, downsampleToWav, encodeMp3, handleRecordings, uploadFile } from "../functions/mettingUtils2.tsx";
import { createPeerOptions } from "../functions/mettingUtils3.tsx";
import { setUserAudioStream, setUserStream, setUserVideoStream } from "../functions/userStream.tsx";
//import * as ort from "onnxruntime-web";
//import * as vad from "@ricky0123/vad-web";

const Context = createContext("");

export function useData() {
  return useContext(Context);
}

type users = {
  id: string;
  peer2Id: string;
  audioPeerId: string;

  stream: MediaStream | null | boolean;
  videoStream: MediaStream | null | boolean;
  audioStream: MediaStream | null | boolean;
  isCameraAvailable: boolean;
  isMicrophoneAvailable: boolean;
  cameraStatus: boolean;
  microphoneStatus: boolean;

  isAdmin: boolean;
  isAudioStream: boolean;
  isLoading: boolean;
  roomId: string;
  custEmailId: string | number;
  agentId: string;
  remove: boolean;
  name: string;
  isScreenSharingEnabled: boolean;
  containsScreenStream: boolean;
};

export default function DataWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialUser: users = {
    id: "",
    peer2Id: "",
    audioPeerId: "",
    name: "",

    stream: null,
    videoStream: null,
    audioStream: null,
    isCameraAvailable: false,
    isMicrophoneAvailable: false,
    cameraStatus: false,
    microphoneStatus: true,

    isAdmin: false,
    isAudioStream: false,
    isLoading: true,
    roomId: "",
    custEmailId: "",
    agentId: "",
    remove: false,

    isScreenSharingEnabled: false,
    containsScreenStream: false,
  };
  let initialMsgArr = [
    {
      id: "abcd",
      name: "siar",
      msg: "hello everyone i hope u guys are fine",
    },
    {
      id: "1234",
      name: "suresh",
      msg: "is elss fund is better than other mutual funds",
    },
  ];

  const dispatch = useDispatch();
  const { CuesList, jobDescription, interviewGuide, jobTitle } = useAppSelector(
    (state) => state.cuesReducer
  );
  const { jobId, roomId, custEmailId, agentId, isHost, meetingIsLegit } =
    useAppSelector((state) => state.qpReducer);

  const { closeCall } = useAppSelector((state) => state.nvReducer);
  //got the user from redux store
  const user=useAppSelector((state)=>state.usersReducer)
  const [socket, setSocket] = useState<any>(null);
  const [socket2, setSocket2] = useState<any>(null);

  const [myId, setMyId] = useState<string>("");

  const [peer, setPeer] = useState<Peer | null>(null);
  const firstTimeConnectRef = useRef<boolean>(true);
  // const [users, setUsers] = useState<users[]>([]);

  const [myStream, setMyStream] = useState<MediaStream | null | boolean>(null);
  const [myAudioStream, setMyAudioStream] = useState<
    MediaStream | null | boolean
  >(null);

  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const peersObjRef = useRef<any>({});
  const peersArrRef = useRef<string[]>([]);

  const [peer2, setPeer2] = useState<Peer | null>(null);
  const peers2ObjRef = useRef<any>({});
  const peers2ArrRef = useRef<string[]>([]);

  const [audioPeer, setAudioPeer] = useState<Peer | null>(null);
  const audioPeerRef = useRef<any>(null);
  const audioPeersObjRef = useRef<any>({});
  const audioPeersArrRef = useRef<string[]>([]);
  const [screenRecording, setScreenRecording] = useState(false);

  const globalRef = useRef({
    recordingStatus: false,
    screenRecordingStatus: false,
    usersArrRefRenderCount: 0,
    myVad: null,
    renderCount: 0,
    socket2FirstTimeConnect: true,
  });


  const usersFlag = useRef(2)
  const usersArrRef = useRef<UserType[]>([])

  const [msg, setMsg] = useState([]);
  const [cueLoading, setCueLoading] = useState(false);
  const msgArrRef = useRef([]);

  const [name, setName] = useState("");
  const [cameraToggle, setCameraToggle] = useState(false);
  const [microphoneToggle, setMicroPhoneToggle] = useState(true);
  const microphoneToggleRef = useRef(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);
  const vadEffectRender = useRef(0);
  const vadFlag = useRef(false);
  const adminMediaRecorderStatus = useRef(false);
  const [validUrl, setValidUrl] = useState("");
  const globalStreamRef = useRef<any>(null);
  const [largeVideo, setLargeVideo] = useState(null);
  const largeVideoRef = useRef(null);
  const startAudioTimestampRef = useRef<string | null>(null);

  const [recordingOn, setRecordingOn] = useState(false);
  //const adminUrl = `https://tso4smyf1j.execute-api.ap-south-1.amazonaws.com/test/transcription-2way-clientaudio`;
  //https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/recruiter-copilot
  const [adminUrl, setAdminUrl] = useState(
    `https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/recruiter-copilot`
  );
  //
  //https://19vnck5aw8.execute-api.ap-south-1.amazonaws.com/Prod/save-adminaudio
  const adminClientUrl = `http://localhost:5005/admin-client`;
  //
  //https://19vnck5aw8.execute-api.ap-south-1.amazonaws.com/Prod/save-clientaudio
  const clientTranscriptionUrl = `https://583c-182-72-76-34.ngrok-free.app/client`;
  //http://localhost:5006/client
  //https://f6p70odi12.execute-api.ap-south-1.amazonaws.com

  const [videoUploadUrl, setVideoUploadUrl] = useState(
    "https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/postfacto-upload-test"
  );

  let peerOptions = createPeerOptions();
  //@ts-ignore

  const startRecordingScreen=async()=> {
    try {
      const stream=await navigator.mediaDevices.getDisplayMedia({
        video:true,
        audio:true
      })
      console.log("Screen Recording Stream",stream);
      setScreenRecording(true)
    } catch (error) {
      console.error("Error getting display media:", error);
    }
  }
  /* ========================================================================= */
  /* ========================================================================= */
  /* Function to send live audio packet along with payload to backend after every VAD hit */
  
  // sendToServer => here it was written this fxn now it is in mettings utils 
  
  /* ========================================================================= */
  /* ========================================================================= */
  /* Functions for utilizing live audio streams and converting from raw wav buffers to mp3 */
  /* Helper function used to convert audio buffers to wav - redundant (present in functions/wavToMp3) */
  
  /* ========================================================================= */
  /* ========================================================================= */
  /* Function used to convert raw blob / array of audio chunks into wav format - redundant (present in functions/wavToMp3) */
  
  
  /* ========================================================================= */
  /* ========================================================================= */
  /* Function to convert raw wav buffers to mp3 - redundant (present in functions/wavToMp3) */
  
  
  /* ========================================================================= */
  /* ========================================================================= */
  /* Function to create video streams/audio streams/screen sharing streams for new users */
  
  /* ========================================================================= */
  /* ========================================================================= */
  /* function used for creating a cues box based on response from socket2 server - deprecated */
  
  //function handleDataOld was here
  
  /* ========================================================================= */
  /* ========================================================================= */
  /* function used for updating cues box based on response from socket2 server - deprecated */
  
  
  /* ========================================================================= */
  /* ========================================================================= */
  /* Function for uploading file chunk by chunk using ajax/xhr */
  
  //---uploadFile() was here
  
  
  /* ========================================================================= */
  /* ========================================================================= */
  /* Media Recorder functionality that uploads recordings to backend server */  
  const mediaRecorder = globalStreamRef.current;
  stopVideoRecording(mediaRecorder);//since this was not use any place i leave it here as it is 
  // can be used in some button and stuff 
  
  /* ========================================================================= */
  /* ========================================================================= */
  /* Useeffect that triggeres to log events at the start of component mounting or when users update */
  /*
  let Data = {
    color: "#7D11E9",
    content: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
    iconColor: "blue",
    initquery: "what is mutual fund? what is mutual fund? is mutual fund what is mutual fund what is mutual fund",
    match_score: "0.9741857",
    matched_query: "what is a mutual fund",
    query: ['what is a mutual fund'],
    raw_modded_query: "what is mutual fund fund",
    sessionid: ['aff2b452-5014-4132-8d6d-6ccfa8d520b1'],
    similarity_query: "Definition of mutual fund"
    }
    */
   
   useEffect(() => {
     console.log(
       "users render count",
       ++globalRef.current.usersArrRefRenderCount,
       user,
       myId
      );
    }, [user, myId]);
    
    /* ========================================================================= */
    /* ========================================================================= */
    /* 1.1. Main functionality starts here - Set socket connections with server here */
    useEffect(() => {
      if (myId === "" || meetingIsLegit === false) return;
      
      //This is a socket connection to handle live messages between participants
      
      let url1 = "https://vitt-jarvis-node-production.up.railway.app/";
      let url2 = "http://localhost:3002";
      let url3 = "https://temp-meeting-server-production.up.railway.app/";
      let url4 = "https://temp-meeting-server.vercel.app/";
      let url5 = "https://temp-meeting-server.onrender.com";
      
      let tempSocket = io("wss://recruitonodesocket.vitti.insure");
      
      //This is a socket connection with backend server to handle cues specific requests or other api requests
      let tempSocket2 = io("wss://recruito.vitti.insure");
      // https://vitt-ai-request-broadcaster-production.up.railway.app
      
      let tempPeer = new Peer(uuidv4(), peerOptions);
      let tempAudioPeer = new Peer(uuidv4(), peerOptions);
      
      setSocket(tempSocket);
      setSocket2(tempSocket2);
      setPeer2(tempPeer);
      setAudioPeer(tempAudioPeer);
      
      return () => {
        if (socket) {
          socket.disconnect();
          console.log("Socket disconnected");
        }
        if (socket2) {
          socket2.disconnect();
          console.log("Socket2 disconnected");
        }
      };
    }, [myId, meetingIsLegit]);
    
    /* ========================================================================= */
    /* ========================================================================= */
    /* 2.1. Handle cues specific requests coming in from server via socket */
    useEffect(() => {
      if (
        socket2 === null ||
        myId === "" ||
        custEmailId === "" ||
        meetingIsLegit === false
      )
      return;
      
      function handleLiveTranscriptions(data: any) {
        console.log("handle live transcriptions", data);
        let tempArr: Array<TranscriptionDataType> = [];
        
        let obj: TranscriptionDataType = { ...initialTranscriptionObj };
        // obj.id  = data.id
        obj.speaker = data.speaker;
        obj.timeStamp = data?.time_stamp;
        obj.transcription = data.transcription;
        //obj.isCandidate = data.isCandidate
        
        tempArr.push(obj);
        
        dispatch(addTranscription(tempArr));
      }
      
      function handleJobDetails(data: any) {
        console.log("handle job details", data);
        let filteredCues = data?.preloadedQuestions;
        if (!filteredCues) {
          filteredCues = [];
        }
        
        if (CuesList?.length > 0) {
          filteredCues = [...CuesList, ...filteredCues];
          const seen = new Set<string>(); // Store unique queries
          filteredCues = filteredCues.filter((item: CuesDataType) => {
            if (item?.similarity_query) {
              if (seen.has(item?.similarity_query)) return false; // Skip duplicates
              seen.add(item?.similarity_query);
            }
            
            return true; // Keep the first occurrence
          });
        }
        
        dispatch(
          setCues({
            CuesList: filteredCues,
            jobDescription:
            (jobDescription === "" ? null : jobDescription) ??
            data?.jobDescription,
          interviewGuide:
          (interviewGuide === "" ? null : interviewGuide) ??
          data?.interviewGuide,
          jobTitle: (jobTitle === "" ? null : jobTitle) ?? data?.jobTitle,
        })
      );
    }
    
    socket2.on("live_transcriptions_res", handleLiveTranscriptions);
    socket2.on("questions_loader_res", handleJobDetails);
    return () => {
      socket2.off("live_transcriptions_res", handleLiveTranscriptions);
      socket2.off("questions_loader_res", handleJobDetails);
    };
  }, [myId, custEmailId, socket2, meetingIsLegit]);
  
  useEffect(() => {
    if (socket2 === null) return;
    
    function handleLiveQna(data: CuesDataType) {
      console.log("handle qna", data);
      if (data?.type === "cues-update") {
        let filteredCues = CuesList?.map((e) => {
          if (e.common_id === data?.common_id) {
            return {
              ...e,
              //content: e.content + " " + (data.content ?? ""),
              isanswered: data.isanswered,
              match_score: data.match_score,
              content: data.content ?? "",
            };
          }
          return e;
        });
        
        if (!filteredCues) {
          return;
        }
        
        console.log("i am filtered cues", filteredCues, CuesList);
        dispatch(
          updateCues({
            CuesList: filteredCues,
          })
        );
      } else {
        let tempArr: Array<CuesDataType> = [];
        
        let obj: CuesDataType = { ...initialCuesObj };
        obj.content = data.content;
        obj.sessionid = data.sessionid;
        obj.audiofiletimestamp = data.audiofiletimestamp;
        obj.common_id = data.common_id;
        obj.similarity_query = data.similarity_query;
        obj.isanswered = data.isanswered;
        //obj.type= data.type
        obj.match_score = data.match_score;
        tempArr.push(obj);

        dispatch(addCues(tempArr));
      }
    }
    socket2.on("ai_suggestion_res", handleLiveQna);
    
    return () => {
      socket2.off("ai_suggestion_res", handleLiveQna);
    };
  }, [socket2, CuesList]);
  
  function reqruiterNotesRes(data) {
    console.log("recruiter_notes_res", data);
  }
  
  useEffect(() => {
    if (socket2 === null) return;
    socket2.on("recruiter_notes_res", reqruiterNotesRes);
    
    return socket2.off("recruiter_notes_res", reqruiterNotesRes);
  }, [socket2]);
  
  //random testing
  /*useEffect(() => {
    let tempArr: Array<CuesDataType> = [];
    
    let obj: CuesDataType = { ...initialCuesObj };
    obj.content = "random";
    obj.sessionid = "xyz";
    obj.audiofiletimestamp = "";
    obj.common_id = "box_123";
    obj.similarity_query = "random new question";
    obj.isanswered = true;
    //obj.type= data.type
    obj.match_score = "55%";
    tempArr.push(obj);
    
    dispatch(addCues(tempArr));
    }, []);*/
    
    /* ========================================================================= */
    /* ========================================================================= */
    /* 3.1. Updated users const here, based on usersFlag */
    useEffect(() => {
      let intervalId = setInterval(() => {
        //after 4 minute if no one is joined refresh
        if (peersArrRef.current.length === 0) null;
        //window.location.reload();
        else clearInterval(intervalId);
      }, 1000 * 60 * 4);
      
      let id = setInterval(() => {
        if (usersFlag.current > 0) {
          console.log(usersArrRef.current, peersArrRef, peersObjRef,"haha");
          dispatch(setAllUserActions([...usersArrRef.current]))
          usersFlag.current--;
        }
      }, 5000);
      return () => {
        clearInterval(id);
        clearInterval(intervalId);
      };
    }, []);
    
    console.log("here came1");
  /* ========================================================================= */
  /* ========================================================================= */
  /* 3.2. Set users and usersarrref consts here (from the perspective of this user, put first user in usersarrref) */
  useEffect(() => {
    if (
      myId === "" ||
      roomId === "" ||
      custEmailId === "" ||
      name === "" ||
      audioPeer === null ||
      agentId === "" ||
      meetingIsLegit === false
    )
      return;

    //variables listed above change only one time

    console.log("myId is", myId);

    let tempObj = { ...initialUser };
    tempObj.id = myId;
    tempObj.isAdmin = isHost;

    tempObj.isLoading = false;
    tempObj.roomId = roomId;
    tempObj.custEmailId = custEmailId;
    tempObj.agentId = agentId;
    tempObj.name = name;
    tempObj.audioPeerId = audioPeer.id;
console.log("iha aaye");
    gettingVideoStream()
      .then((videoStream) => {
        console.log("553 line has been reaching ",videoStream);
        setMyStream(videoStream);
        // tempObj.videoStream = videoStream;
        videoStreamRef.current = videoStream;
        // tempObj.isCameraAvailable = true;
        // tempObj.isAudioStream = false;
           console.log(`559 video stream for user ${myId} in DataWrapper`)
        dispatch(updateUserAvailabilityAction({
          id: myId,
          isCameraAvailable: true,
        }))
        setUserStream(myId,videoStream);
        setUserVideoStream(myId,videoStream);
        dispatch(setUserVideoStreamAction({
          id: myId,
          videoStream: videoStream
        }))
        dispatch(setUserStreamAction({
          id: myId,
          stream:videoStream
        }))
        console.log("Video stream successfully set for user:", myId);
      })
      .catch((err) => {
        // let tempStream = new MediaStream()
        setMyStream(false);
        // tempObj.isCameraAvailable = false;
        tempObj.videoStream = false;
        console.log("camera permission", err);
        dispatch(
          updateUserAvailabilityAction({
            id: myId,
            isCameraAvailable: false,
          }
          )
        )
      });

    gettingAudioStream()
      .then((audioStream) => {
        setMyAudioStream(audioStream);
        // tempObj.audioStream = audioStream;
        // tempObj.isMicrophoneAvailable = true;
        audioStreamRef.current = audioStream;
        setUserAudioStream(myId,audioStream)
        dispatch(setUserAudioStreamAction({
          id: myId,
          audioStream: audioStream,
        }))
        dispatch(
          updateUserAvailabilityAction({
            id: myId,
            isMicroPhoneAvailable: true,
          })
        )
          if (audioStream instanceof MediaStream) {
          const audioTracks = audioStream.getAudioTracks()
          if (audioTracks.length > 0) {
            audioTracks[0].enabled = microphoneToggle
          }
        }
    handleRecordings(
      audioStream,
      uploadFile,                    
      setNVaudioUploadAnimation,    
      WavToMp3,                     
      globalStreamRef,               
      startAudioTimestampRef         
    );
      })
      .catch((err) => {
        // let tempStream = new MediaStream()
        // setMyAudioStream(false);
        // tempObj.isMicrophoneAvailable = false;
        // tempObj.audioStream = false;
        console.log("microphone permission", err);
        dispatch(
          updateUserAvailabilityAction({
            id: myId,
            isMicroPhoneAvailable: false,
          })
        )
      });

    usersArrRef.current.push(tempObj);
    let d = new Date();
    console.log("after setting usersArrRef", d.toLocaleTimeString());
    // setUsers((prev) => [...usersArrRef.current]);
    dispatch(addNewUserAction(tempObj));

    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((track) => track.stop()); // ✅ Stop camera stream
        videoStreamRef.current = null;
      }

      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop()); // ✅ Stop audio stream
        audioStreamRef.current = null;
      }
    };
  }, [myId, roomId, custEmailId, agentId, name, audioPeer, meetingIsLegit]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 3.3. Clean up function once closecall is initiated */
  useEffect(() => {
    if (closeCall === false) return;
    //else
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop()); // ✅ Stop camera stream
      videoStreamRef.current = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop()); // ✅ Stop audio stream
      audioStreamRef.current = null;
    }
  }, [closeCall]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 4.1. This code is responsible for enable & disable videostream */

  useEffect(() => {
    if (socket === null || myStream === null || myStream === false) return;
    //@ts-ignore

    //let d = new Date();
    //console.log("before accessing usersArrRef", d.toLocaleTimeString());

    if (
      usersArrRef.current &&
      usersArrRef.current[0]?.videoStream instanceof MediaStream
    ) {
  

      const videoTracks = usersArrRef.current[0].videoStream.getVideoTracks()
      if(videoTracks?.length){
        videoTracks[0].enabled=cameraToggle;
      }
      usersArrRef.current[0].cameraStatus=cameraToggle
    }
        if (myStream instanceof MediaStream) {
      const videoTracks = myStream.getVideoTracks()
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = cameraToggle
      }
    }

    socket.emit("camera-toggle-transmitter", {
      cameraStatus: cameraToggle,
      id: usersArrRef.current[0].id,
    });
    dispatch(
      toggleCameraAction({
        id:usersArrRef.current[0].id,
        enabled:cameraToggle
      })
    )
    // setUsers((prev) => [...usersArrRef.current]);

    console.log("myData modified", usersArrRef.current, cameraToggle);
  }, [socket, myStream, cameraToggle]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 4.2. this code is responsible for enable & disable audiostream */
  useEffect(() => {
    if (socket === null || myAudioStream === null || myAudioStream === false)
      return;
    //@ts-ignore

   
    // Update local reference
    if (usersArrRef.current && usersArrRef.current[0]?.audioStream instanceof MediaStream) {
      const audioTracks = usersArrRef.current[0].audioStream.getAudioTracks()
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = microphoneToggle
      }
      usersArrRef.current[0].microphoneStatus = microphoneToggle
    }

    // Update Redux state directly
    if (myAudioStream instanceof MediaStream) {
      const audioTracks = myAudioStream.getAudioTracks()
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = microphoneToggle
      }
    }

  socket.emit("microphone-toggle-transmitter", {
      microphoneStatus: microphoneToggle,
      id: usersArrRef.current[0].id,
    })
    
    dispatch(
      toggleMicrophoneAction({
        id: usersArrRef.current[0].id,
        enabled: microphoneToggle
      })
    )
    // setUsers((prev) => [...usersArrRef.current]);
  }, [socket, myAudioStream, microphoneToggle]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 4.3.1. Helper function for screen sharing - shares screen stream with all ids (peer2Ids) in peers2ArrRef and also new peer2Ids received on received on socket.on(""receive-connected-user-data") event */
  async function ShareScreenToUser(stream: MediaStream, newUserId: string) {
    console.log(socket, stream, usersArrRef.current);

    let call = peer2?.call(newUserId, stream);
    let count = 0;
    if (!call) {
      console.log("while triggers inside shareScreen", ++count);
      call = peer2?.call(newUserId, stream);
    }

    try {
      //@ts-ignore
      peers2ObjRef.current[call.peer] = { call: call };

      call?.on("close", () => {
        console.log("close event fired 1 inside shareScreen fn");
        /*
        // let tempUsers= usersArrRef.current.filter((e,i)=>e.id !== call.peer)
        // // let tempUsers= usersArrRef.current.map((e,i)=>{
        // //     if(e.id === call.peer){
        // //         e.remove = true ;
        // //         e.isLoading = true;
        // //         return e;
        // //     }else return e

        // // })

        // usersArrRef.current = tempUsers
        // usersFlag.current = 2

        // removeUserFromPeers2Arr(call.peer)
        // delete peers2ObjRef.current[call.peer]

        // clearInterval(intervalId)
        */
      });
    } catch (err) {
      console.log(err);
    }
  }

  /* ========================================================================= */
  /* ========================================================================= */
  /* 4.3.2. this code is responsible for enable & disable screen sharing */
  useEffect(() => {
    if (
      myStream === null ||
      socket === null ||
      peer2 === null ||
      usersArrRef.current.length === 0
    )
      return;

    //if both have same, nothing changed
    if (screenSharing === usersArrRef.current[0].isScreenSharingEnabled) return;

    if (screenSharing === false) {
      //stop screen sharing
      usersArrRef.current[0].isScreenSharingEnabled = false;
      screenStreamRef.current = null;

      console.log(
        "usersArrRef inside screen sharing useEffect",
        usersArrRef.current
      );

      let [first, second, ...rest] = usersArrRef.current;

      //notify others that u stopped screen share
      socket.emit("screen-share-end-transmitter", {
        videoId: second.id,
        peerId: peer2.id,
      });

      //stopping second track

      //@ts-ignore
      let tracks = second.stream.getTracks();
      //@ts-ignore
      tracks.forEach((track) => track.stop());

      Object.keys(peers2ObjRef.current).map((id: string) => {
        //close call from peer2ObjRef
        peers2ObjRef.current[id].call.close();
      });
      //do not reset peers2ArrRef beacuse it contains peers2 peerId

      //reset from peer2ObjRef
      peers2ObjRef.current = {};

      //remove second from usersList
      usersArrRef.current = [first, ...rest];
      // setUsers((prev) => [...usersArrRef.current]);
    } else {
      //start screen sharing
      gettingScreenStream()
        .then((screenStream) => {
          //@ts-ignore
          screenStreamRef.current = screenStream;

          //add screen sharing as new user
          let tempUser = { ...initialUser };
          tempUser.id = uuidv4();
          tempUser.containsScreenStream = true;
          tempUser.isCameraAvailable = true;
          tempUser.cameraStatus = true;
          tempUser.isLoading = false;
          tempUser.name = usersArrRef.current[0].name;
          tempUser.isScreenSharingEnabled = false;
          tempUser.isMicrophoneAvailable = false;
          tempUser.microphoneStatus = false;

          tempUser.peer2Id = peer2.id;
          tempUser.isAudioStream = false;

          socket.emit("screen-share-transmitter", {
            ...tempUser,
            isLoading: true,
          });

          tempUser.stream = screenStream;
          tempUser.videoStream = screenStream;

          usersArrRef.current[0].isScreenSharingEnabled = true;
          //putting this user after first position

          let [first, ...restData] = usersArrRef.current;
          usersArrRef.current = [first, tempUser, ...restData];

          // setUsers((prev) => [...usersArrRef.current]);

          //send this tempUsr info to every joined peer

          //make connection to every other user
          setTimeout(() => {
            peers2ArrRef.current.map((peerId) => {
              ShareScreenToUser(screenStream, peerId);
            });
          }, 2000);
        })
        .catch((err) => {
          console.log("error at getting screen stream", err);
        });
    }
  }, [myStream, socket, screenSharing, peer2]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 5.1. this code is responsible for initializing Peer variable - potentially move this declaration to 1.1. */
  /* Potentially put here after timeout because the socket connection might change i.e. new socket connection might be established */
  useEffect(() => {
    if (socket === null || myId === "" || meetingIsLegit === false) return;

    let timeOutId = setTimeout(() => {
      if (socket.connected) {
        //console.log('socket connected')
      }

      let tempPeer = new Peer(myId, peerOptions);
      setPeer(tempPeer);
      clearTimeout(timeOutId);
    }, 5000);

    return () => clearTimeout(timeOutId);
  }, [socket, myId, meetingIsLegit]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 6.1. Cleanup helper functions called when one of the users disconnect */
  function removeUserFromPeersArr(userId: string) {
    peersArrRef.current = peersArrRef.current.filter((id) => id !== userId);
  }
  function removeUserFromPeers2Arr(userId: string) {
    peers2ArrRef.current = peers2ArrRef.current.filter((id) => id !== userId);
  }
  function removeUserFromAudioPeersArr(userId: string) {
    audioPeersArrRef.current = audioPeersArrRef.current.filter(
      (id) => id !== userId
    );
  }
  /* ========================================================================= */
  /* ========================================================================= */
  /* 6.2. Function called when one of the users disconnect */
  function removeUserFromMainPage(userId: string) {
    //get peer2 id of user just disconnected
    console.log("remove user from mainpage triggered");
    let peer2Id: null | string = null;
    let audioPeerId: null | string = null;

    usersArrRef.current.map((e) => {
      if (e.id === userId) {
        peer2Id = e.peer2Id;
        audioPeerId = e.audioPeerId;
      }
    });

    //disconnect video call
    if (peersObjRef.current.hasOwnProperty(userId)) {
      peersObjRef.current[userId].call.close();
      delete peersObjRef.current[userId];
    }

    //disconnect audio call
    if (audioPeersObjRef.current.hasOwnProperty(audioPeerId)) {
      //@ts-ignore
      audioPeersObjRef.current[audioPeerId].call.close();
      //@ts-ignore
      delete audioPeersObjRef.current[audioPeerId];
    }

    // disconnect screen sharing if happening
    if (peers2ObjRef.current.hasOwnProperty(peer2Id)) {
      //@ts-ignore
      peers2ObjRef.current[peer2Id].call.close();
      //@ts-ignore
      delete peers2ObjRef.current[peer2Id];
    }

    //need to modify peersArrRef for video call
    if (userId) {
      removeUserFromPeersArr(userId);
    }
    //need to modify peers2ArrRef for screen sharing
    if (peer2Id) {
      removeUserFromPeers2Arr(peer2Id);
    }
    //need to modify audioPeersArrRef for audio call
    if (audioPeerId) {
      removeUserFromAudioPeersArr(audioPeerId);
    }

    //remove user from usersArrRef
    usersArrRef.current = usersArrRef.current.filter(
      (e, i) => e.peer2Id !== peer2Id
    );
    console.log("abt to dleeye")
    dispatch(
      removeUserAction({
        id:userId
      })
    )
    // setUsers((prev) => [...usersArrRef.current]);
    console.log("users changed due to user left", userId, peer2Id, usersArrRef);
  }

  /* ========================================================================= */
  /* ========================================================================= */
  /* 7.1. Handling of events from socket server - for connection, and disconnection */
  useEffect(() => {
    if (
      socket === null ||
      myStream === null ||
      myId === "" ||
      meetingIsLegit === false
    )
      return;

    function connected() {
      socket.emit("connected", myId);
      if (firstTimeConnectRef.current === true) {
        console.log("socket 1st connect triggered");
      } else {
        console.log("socket 2nd connect triggered");
        socket.emit("join-room", roomId, myId);
      }
    }

    function disconnect() {
      console.log("disconnected");
    }
    function userDisconnect(userId: string) {
      removeUserFromMainPage(userId);
    }
    socket.on("connect", connected);

    socket.on("disconnect", disconnect);

    socket.on("user-disconnected", userDisconnect); // Event when another user disconnects from the call.

    return () => {
      socket.off("connect", connected);
      socket.off("disconnect", disconnect);
      socket.off("user-disconnected", userDisconnect); // Event when another user disconnects from the call.
    };
  }, [socket, myStream, myId, meetingIsLegit]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 7.2. Join Room at socket server after peer has been initialized (some timeout introduced for that) */
  useEffect(() => {
    if (peer === null) return;

    let intervalId = setTimeout(() => {
      if (peer.disconnected === false) {
        // console.log("join-room-first-time")
        firstTimeConnectRef.current = false;
        socket.emit("join-room", roomId, myId);
        clearTimeout(intervalId);
      }
    }, 5000);
    return () => clearTimeout(intervalId);
  }, [peer]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 7.3. Handling of events from socket2 server i.e. API server - for connection, and disconnection */
  useEffect(() => {
    if (
      socket2 === null ||
      myStream === null ||
      myId === "" ||
      name === "" ||
      meetingIsLegit === false
    )
      return;

    function connected() {
      if (isHost === true) {
        let questionsApiReqPayload = {
          // jobid:jobId,
          // roomid : roomId,
          //agentid:agentId,
          roomid: "abc-123-fgh-456",
          jobid: "1",
          agentid: "1234",
          custemailid: custEmailId,
          name: name,
        };
        // let liveQnaReqPayload= {
        //   jobid:jobId,
        //   roomid : roomId,
        //   agentid:agentId,
        //   custemailid :custEmailId,
        //   name:name ,
        //   ishost:isHost,
        //   audiomessage:"base64",
        //   timestamp:"8:30pm"
        // }
        console.log("socket2 connect triggered", questionsApiReqPayload);
        //socket2.emit("questions_loader_req", questionsApiReqPayload);
      } else {
        console.log("socket2 connect triggered for client / not admin");
      }
    }

    function disconnect() {
      console.log("socket 2 disconnected");
    }

    socket2.on("connect", connected);

    socket2.on("disconnect", disconnect);

    return () => {
      socket2.off("connect", connected);
      socket2.off("disconnect", disconnect);
    };
  }, [socket2, myStream, myId, name, meetingIsLegit]);

  useEffect(() => {
    if (
      socket2 === null ||
      myId === "" ||
      myStream === null ||
      isHost === false
    )
      return;
    let questionsApiReqPayload = {
      // jobid:jobId,
      // roomid : roomId,
      //agentid:agentId,
      roomid: "abc-123-fgh-456",
      jobid: "1",
      agentid: "1234",
      custemailid: custEmailId,
      name: name,
    };
    console.log("before emiiting questions_loader_req", socket2.connected);
    socket2.emit("questions_loader_req", questionsApiReqPayload);
  }, [socket2, myStream, myId, isHost]);
  /* ========================================================================= */
  /* ========================================================================= */
  /* 8. Helper function for console.logging whether peers are available or not - used only for console.logging purpose */
  /* ========================================================================= */
  /* ========================================================================= */
  /* 9.1. Helper function for video sharing - shares video stream with any new peers received on */
  /* socket.on(""receive-connected-user-data") event by creating a call */
  async function sendVideoToNewUser(stream: MediaStream, newUserId: string) {
    console.log(socket, stream, usersArrRef.current);

    // Set up a connection between this instance (peer) and new peer
    let call = peer?.call(newUserId, stream);
    let count = 0;
    if (!call) {
      console.log("while triggers", ++count);
      call = peer?.call(newUserId, stream);
    }

    try {
      //if call undefined

      call?.on("close", () => {
        console.log("close event fired 1");
        /*
        // let tempUsers= usersArrRef.current.filter((e,i)=>e.id !== call.peer)
        // // let tempUsers= usersArrRef.current.map((e,i)=>{
        // //     if(e.id === call.peer){
        // //         e.remove = true ;
        // //         e.isLoading = true;
        // //         return e;
        // //     }else return e

        // // })

        // usersArrRef.current = tempUsers
        // usersFlag.current = 2

        // removeUserFromPeersArr(call.peer)
        // delete peersObjRef.current[call.peer]

        // clearInterval(intervalId)
        */
      });
    } catch (err) {
      console.log(err);
    }
  }

  /* ========================================================================= */
  /* ========================================================================= */
  /* 9.2. Helper function for audio sharing - shares audio stream with any new peers received on */
  /* socket.on(""receive-connected-user-data") event by creating a call */
  async function sendAudioToNewUser(stream: MediaStream, newUserId: string) {
    console.log("send audio to new user", socket, stream, usersArrRef.current);

    // Set up a connection between this instance (audioPeer) and new audioPeer
    let call = audioPeer?.call(newUserId, stream);
    let count = 0;
    if (!call) {
      console.log("while triggers", ++count);
      call = audioPeer?.call(newUserId, stream);
    }

    try {
      call?.on("close", () => {
        console.log("close event fired 1");
        /*
        // let tempUsers= usersArrRef.current.filter((e,i)=>e.id !== call.peer)
        // // let tempUsers= usersArrRef.current.map((e,i)=>{
        // //     if(e.id === call.peer){
        // //         e.remove = true ;
        // //         e.isLoading = true;
        // //         return e;
        // //     }else return e

        // // })

        // usersArrRef.current = tempUsers
        // usersFlag.current = 2

        // removeUserFromPeersArr(call.peer)
        // delete peersObjRef.current[call.peer]

        // clearInterval(intervalId)
        */
      });
    } catch (err) {
      console.log(err);
    }
  }

  /* ========================================================================= */
  /* ========================================================================= */
  /* 10.1. Handling of events from socket server (not socket2) - Definition of all functions as well as calls of those functions based on socket events */
  useEffect(() => {
    if (
      socket === null ||
      myStream === null ||
      myAudioStream === null ||
      peer === null ||
      peer2 === null ||
      audioPeer === null
    )
      return;

    /* 10.1.1. socket.on("user-connected") event handler i.e. new user has connected as a peer on the call */
    function newUser(userId: string) {
      console.log("new user triggered");
      if (peersArrRef.current.includes(userId) === true) return;

      peersArrRef.current.push(userId);

      console.log("user-connected", userId);

      //send this data to new user before making rtc connection
      socket.emit("connected-user-data", {
        ...usersArrRef.current[0],
        stream: null,
        videoStream: null,
        audioStream: null,
        toPeer: userId,
        peer2Id: peer2?.id,
        audioPeerId: audioPeer?.id,
        isLoading: true,
        count: 1,
      });
    }

    /* 10.1.2. socket.on("tab-close-remove-video") event handler */
    function removeUser() {}

    /* 10.1.3. socket.on("to-leave-page-receiver") event handler */
    function userMovedToLeavePage(userId: string) {
      console.log("user to leave triggered", userId);
      removeUserFromMainPage(userId);
    }

    /* 10.1.4. socket.on("receive-connected-user-data") event handler */
    function sendUserData(data: any) {
      console.log("send user triggered", data);
      if (data.count !== 0) {
        //new user data, make rtc connection here.
        console.log(data, data.count !== 0);
        socket.emit("connected-user-data", {
          ...usersArrRef.current[0],
          stream: null,
          videoStream: null,
          audioStream: null,
          toPeer: data.id,
          peer2Id: peer2?.id,
          audioPeerId: audioPeer?.id,
          isLoading: true,
          count: --data.count,
        });

        let timeoutId = setTimeout(() => {
          //@ts-ignore

          sendVideoToNewUser(myStream, data.id);
          console.log("before exec send audio", myAudioStream);

          //@ts-ignore
          sendAudioToNewUser(myAudioStream, data.audioPeerId);
          clearTimeout(timeoutId);
        }, 2500);
      } else {
        //@ts-ignore

        socket.emit("user-chat-transmitter", {
          chats: msgArrRef.current,
          toPeer: data.id,
          from: myId,
        });
        //@ts-ignore
        sendVideoToNewUser(myStream, data.id);
        console.log("before exec send audio", myAudioStream);
        //@ts-ignore
        sendAudioToNewUser(myAudioStream, data.audioPeerId);
        //share screen if enabled
        if (usersArrRef.current[0].isScreenSharingEnabled === true) {
          socket.emit("single-screen-share-transmitter", {
            ...usersArrRef.current[1],
            toPeer: data.id,
            isLoading: true,
          });
          //@ts-ignore
          console.log(
            "before exec ShareScreenToUser",
            screenStreamRef,
            data.peer2Id
          );
          setTimeout(() => {
            //@ts-ignore
            ShareScreenToUser(screenStreamRef.current, data.peer2Id);
          }, 2000);
        }
      }
      peers2ArrRef.current.push(data.peer2Id);
      audioPeersArrRef.current.push(data.audioPeerId);

      if (peersArrRef.current.includes(data.id) === false)
        peersArrRef.current.push(data.id);

      usersArrRef.current.push(data);
      console.log("connected-usr-data", data);

     dispatch(addNewUserAction(data))
    }

    /* 10.1.6. socket.on("camera-toggle-receiver") event handler */
    function cameraToggle(data: any) {
      console.log("camera toggle", data);

      usersArrRef.current = usersArrRef.current.map((e: any, i: number) => {
        if (e.id === data.id) {
          e.cameraStatus = data.cameraStatus;
        }
        return e;
      });
    dispatch(toggleCameraAction({
      id: data.id,
      enabled:data.cameraStatus,
    }))
      console.log("new data", usersArrRef.current);
    }

    /* 10.1.7. socket.on("microphone-toggle-receiver") event handler */
    function microphoneToggle(data: any) {
      console.log("microphone toggle", data);

      usersArrRef.current = usersArrRef.current.map((e: any, i: number) => {
        if (e.id === data.id) {
          // e.microphoneStatus = data.microphoneStatus;
        }
        return e;
      });

      dispatch(
        toggleMicrophoneAction({
          id: data.id,
          enabled: data.microphoneStatus,
        })
      )
      console.log("new data", usersArrRef.current);
    }

    /* 10.1.8. socket.on("user-chat-receiver") event handler */
    function chatsReceiver(data: any) {
      //@ts-ignore
      msgArrRef.current = [...data.chats, ...msgArrRef.current];
      setMsg((prev) => [...msgArrRef.current]);
      socket.off("user-chat-receiver", chatsReceiver);
    }

    /* 10.1.9. socket.on("screen-share-receiver") event handler */
    function screenShareDataReceiver(data: any) {
      console.log("screen share data receiver", data);

      //create new user in users
      //peers2ArrRef.current.push(data.id)
      usersArrRef.current.push(data);
      dispatch(addNewUserAction(
        data
      ))
    }

    /* 10.1.10. socket.on("screen-share-end-receiver") event handler */
    function stopScreenReceiving(data: any) {
      //remove screen sharing user
      // removeUserFromPeers2Arr(id)

      //remove screen from peersObj2Ref

      if (
        usersArrRef.current[0].isScreenSharingEnabled === false &&
        peers2ObjRef.current.hasOwnProperty(data.peerId)
      ) {
        // if my screen sharing is false then close the connection with other users
        //    peers2ObjRef.current[data.peerId].call.close()
        //    delete peers2ObjRef.current[data.peerId]
      }

      console.log(
        "from inside stopScreenReceiving",
        peers2ObjRef,
        peers2ArrRef
      );
      //modify usersArrRef
      usersArrRef.current = usersArrRef.current.filter(
        (e) => e.id !== data.videoId
      );
      //applied change immediately
      // dispatch(userScre)
    }

    /* 10.1.11. socket.on("receive-msg") event handler */
    function singleMsgReceiver(data: any) {
      console.log("msg receiver", data);
      //@ts-ignore
      msgArrRef.current = [...msgArrRef.current, data];
      setMsg((prev) => [...msgArrRef.current]);
    }

    /* 10.1.12. socket.on("cue-loading-receiver") event handler */
    function cueLoadingReceiver(data: any) {
      setCueLoading(data.toggle);
    }
    socket.on("receive-msg", singleMsgReceiver);
    socket.on("tab-close-remove-video", removeUser);
    socket.on("to-leave-page-receiver", userMovedToLeavePage);
    socket.on("receive-connected-user-data", sendUserData);
    socket.on("user-connected", newUser);
    socket.on("camera-toggle-receiver", cameraToggle);
    socket.on("microphone-toggle-receiver", microphoneToggle);
    socket.on("user-chat-receiver", chatsReceiver);
    socket.on("screen-share-end-receiver", stopScreenReceiving);
    socket.on("screen-share-receiver", screenShareDataReceiver);
    socket.on("single-screen-share-receiver", screenShareDataReceiver);
    socket.on("cue-loading-receiver", cueLoadingReceiver);

    return () => {
      socket.off("user-connected", newUser);
      socket.off("receive-msg", singleMsgReceiver);
      socket.off("to-leave-page-receiver", userMovedToLeavePage);
      socket.off("tab-close-remove-video", removeUser);
      socket.off("receive-connected-user-data", sendUserData);
      socket.off("camera-toggle-receiver", cameraToggle);
      socket.off("microphone-toggle-receiver", microphoneToggle);
      socket.off("user-chat-receiver", chatsReceiver);
      socket.off("screen-share-end-receiver", stopScreenReceiving);
      socket.off("screen-share-receiver", screenShareDataReceiver);
      socket.off("cue-loading-receiver", cueLoadingReceiver);
      socket.off("single-screen-share-receiver", screenShareDataReceiver);
    };
  }, [socket, myStream, myAudioStream, peer, peer2, audioPeer]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 11.1 Answering Peer connections that have been initiated by peers. Event handlers on peer connections. Obtaining videostreams/audiostreams of peer connections and updating usersArrRef to be used in components */
  useEffect(() => {
    if (
      peer === null ||
      peer2 === null ||
      audioPeer === null ||
      socket === null ||
      myId === "" ||
      roomId === "" ||
      myStream === null ||
      meetingIsLegit === false ||
      myAudioStream === null
    )
      return;

    console.log("triggering peer fn", peer, myStream);
    let id: number;

    function screenSharingReply(call: any) {
      console.log("screen sharing replying trigerred");
      let intervalId: number;
      call.answer();

      call.on("stream", (userVideoStream: MediaStream) => {
        //@ts-ignore

        console.log(
          "2nd getting screen screen stream ",
          userVideoStream,
          call.peer
        );

        //peers2ObjRef.current[call.peer] = {'call':call}

        for (let i = 0; i < usersArrRef.current.length; i++) {
          if (
            usersArrRef.current[i].peer2Id === call.peer &&
            usersArrRef.current[i].containsScreenStream === true
          ) {
            usersArrRef.current[i] = {
              ...usersArrRef.current[i],
              stream: userVideoStream,
              videoStream: userVideoStream,
              isLoading: false,
            };
            setUserStream(usersArrRef.current[i].id,userVideoStream);
            setUserVideoStream(usersArrRef.current[i].id,userVideoStream)
            dispatch(
              setUserStreamAction({
                id:usersArrRef.current[i].id,
                stream: userVideoStream,
              })
            )
            dispatch(
              setUserVideoStreamAction({
                id: usersArrRef.current[i].id,
                videoStream: userVideoStream,
              })
            )
            dispatch(
              setUserLoadingAction
              ({
                id: usersArrRef.current[i].id,
                isLoading: false,
              })
            )
            usersFlag.current = 2;
          }
        }

        console.log(
          "peersArray2",
          isUserAvailable(call.peer,peersArrRef),
          call.peer,
          peers2ArrRef.current,
          peers2ObjRef.current,
          call.peer
        );
      });

      call.on("close", () => {
        console.log("close event fired 2");

        //modifying users

        // let tempUsers= usersArrRef.current.filter((e,i)=>e.id !== call.peer)
        // usersArrRef.current = tempUsers
        // usersFlag.current = 2

        //removing from peersArrRef
        // removeUserFromPeersArr(call.peer)
        // removeUserFromPeers2Arr(call.peer)

        //removing call from peersObjRef
        // delete peersObjRef.current[call.peer]
        // delete peers2ObjRef.current[call.peer]
      });
    }

    function videoReply(call: any) {
      console.log("video replying trigerred");

      let intervalId: number;
      call.answer();

      call.on("stream", (userVideoStream: MediaStream) => {
        //@ts-ignore

        console.log("2nd getting video stream", userVideoStream, call.peer);

        //if data is present at peersArrRef then is normal video or audio stream, if data is present at peers2ArrRef then it is screen sharing connection
        peersObjRef.current[call.peer] = { call: call };

        for (let i = 0; i < usersArrRef.current.length; i++) {
          if (usersArrRef.current[i].id === call.peer) {
            usersArrRef.current[i] = {
              ...usersArrRef.current[i],
              stream: userVideoStream,
              videoStream: userVideoStream,
              isLoading: false,
            };
                setUserStream(call.peer, userVideoStream)
            setUserVideoStream(call.peer, userVideoStream)
            dispatch(
              setUserStreamAction({
                id:call.peer,
                stream: userVideoStream,
              })
            )
            dispatch(
              setUserVideoStreamAction({
                id: call.peer,
                videoStream: userVideoStream,
              })
            )
            dispatch(
              setUserLoadingAction({
                id: call.peer,
                isLoading: false,
              })
            )

            usersFlag.current = 2;
          }
        }

        console.log(
          "peersArray2",
          isUserAvailable(call.peer,peersArrRef),
          call.peer,
          peersArrRef.current,
          peersObjRef.current,
          call.peer
        );
      });

      call.on("close", () => {
        console.log("close event fired 2");

        //modifying users
        // let tempUsers= usersArrRef.current.filter((e,i)=>e.id !== call.peer)
        // usersArrRef.current = tempUsers
        // usersFlag.current = 2

        // //removing from peersArrRef
        // removeUserFromPeersArr(call.peer)
        // removeUserFromPeers2Arr(call.peer)

        // //removing call from peersObjRef
        // delete peersObjRef.current[call.peer]
        // delete peers2ObjRef.current[call.peer]

        if (intervalId) clearInterval(intervalId);
      });
    }

    function audioReply(call: any) {
      let intervalId: number;
      call.answer();

      call.on("stream", (userAudioStream: MediaStream) => {
        //@ts-ignore

        console.log("2nd getting audio stream", userAudioStream, call.peer);

        //if data is present at peersArrRef then is normal video or audio stream, if data is present at peers2ArrRef then it is screen sharing connection
        audioPeersObjRef.current[call.peer] = { call: call };

        for (let i = 0; i < usersArrRef.current.length; i++) {
          if (usersArrRef.current[i].audioPeerId === call.peer) {
            usersArrRef.current[i] = {
              ...usersArrRef.current[i],
              audioStream: userAudioStream,
              isLoading: false,
            };
              setUserAudioStream(usersArrRef.current[i].id, userAudioStream)
            dispatch(
              setUserAudioStreamAction({
                id:usersArrRef.current[i].id,
                audioStream: userAudioStream,
              })
            )

            dispatch(setUserLoadingAction({
              id: usersArrRef.current[i].id,
              isLoading: false
            }))

            usersFlag.current = 2;
          }
        }

        console.log(
          "audioPeersArrRef",
          isUserAvailable(call.peer,peersArrRef),
          call.peer,
          peersArrRef.current,
          peersObjRef.current,
          call.peer
        );
      });

      call.on("close", () => {
        console.log("close event fired 2");

        if (intervalId) clearInterval(intervalId);
      });
    }

    function onOpen() {
      console.log("peer open triggered");
    }

    function onConnection(conn: any) {
      console.log("conn opened");
    }

    peer.on("call", videoReply);
    peer2.on("call", screenSharingReply);
    audioPeer.on("call", audioReply);
    peer.on("open", onOpen);
    peer.on("connection", onConnection);

    return () => {
      peer.off("call", videoReply);
      peer2.off("call", screenSharingReply);
      audioPeer.off("call", audioReply);
      peer.off("open", onOpen);
      peer.off("connection", onConnection);
    };
  }, [
    peer,
    peer2,
    audioPeer,
    socket,
    roomId,
    myId,
    myStream,
    myAudioStream,
    meetingIsLegit,
  ]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 12.1  Old function for handling mediastream once VAD has turned on - deprecated  */
  //vad code here
  function sendVadStreamToServer(
    stream: MediaStream,
    data: any,
    url: string,
    time: number
  ) {
    let mediaStream = new MediaStream();
    //medRec = mediaStream
    mediaStream.addTrack(stream.getAudioTracks()[0]);
    try {
      let arrayofChunks: Blob[] = [];
      let mediaRecorder = new MediaRecorder(mediaStream, {
        audioBitsPerSecond: 32000,
      });
      mediaRecorder.ondataavailable = (e) => {
        arrayofChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        // console.log('media recorder stop triggered')
        //  adminMediaRecorderStatus.current = false
        downsampleToWav(
          new Blob(arrayofChunks, { type: "audio/ogg" }),
          (buffer: ArrayBuffer) => {
            const mp3Buffer = encodeMp3(buffer);
            let blob = new Blob(mp3Buffer, { type: "audio/mp3" });
            console.log("send to server", data);
            sendToServer(blob, url, data);
            arrayofChunks = [];
            //@ts-ignore
            blob = null;
          }
        );
      };

      let timeOutId: any = null;
      let intervalId: any = null;

      //stop after T time
      timeOutId = setTimeout(() => {
        // console.log('state mediaRecorder inside timeout',mediaRecorder.state,intervalId,timeOutId)
        clearInterval(intervalId);
        clearTimeout(timeOutId);
        if (mediaRecorder.state === "recording") mediaRecorder.stop();
      }, time);

      //check at specific interval & stop immediately
      intervalId = setInterval(() => {
        if (vadFlag.current === false) {
          // console.log('state mediaRecorder inside interval',mediaRecorder.state,intervalId,timeOutId)
          clearTimeout(timeOutId);
          clearInterval(intervalId);
          if (mediaRecorder.state === "recording") mediaRecorder.stop();

          adminMediaRecorderStatus.current === false;
        }
      }, 150);

      mediaRecorder.start();
      console.log("state mediaRecorder", mediaRecorder.state);
      // if(mediaRecorder.state==='recording'){

      // }
    } catch (e) {
      console.log(e);
      return;
    }
  }

  /* ========================================================================= */
  /* ========================================================================= */
  /* 12.2  Function for handling mediastream once VAD has turned on */
  function startMediaRecorder(stream: MediaStream, time: number) {
    //let url = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'
    let url = adminUrl;
    let arrayofChunks: any = [];
    let mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 32000,
    });

    mediaRecorder.ondataavailable = (e) => {
      arrayofChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      setCueLoading(true);

      console.log(
        `%c just before wav to mp3 ${new Date().toLocaleTimeString()}`,
        "background-color:teal;color:white"
      );
      let mp3Blob = await WavToMp3(
        new Blob(arrayofChunks, { type: "audio/wav" })
      );

      console.log(
        `%c just after wav to mp3 ${new Date().toLocaleTimeString()}`,
        "background-color:teal;color:white"
      );

      sendToServer(mp3Blob, url, { ...usersArrRef.current[0], init: false });
      arrayofChunks = [];
    };

    //if recording true stop after 30 sec
    let timeOutId = setTimeout(() => {
      if (mediaRecorder.state === "recording") mediaRecorder.stop();
    }, time);
    //chk every second
    let intervalId = setInterval(() => {
      if (globalRef.current.recordingStatus === false) {
        clearInterval(intervalId);
        clearTimeout(timeOutId);
        if (mediaRecorder.state === "recording") mediaRecorder.stop();
      }
    }, 1000);
    mediaRecorder.start();
  }

  function sendScreenStream(stream: MediaStream, time: number) {
    //let url = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'
    console.log("send screen stream hit", stream, time);
    let url = "http://localhost:5000";
    let arrayofChunks: any = [];
    let mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 32000,
    });

    mediaRecorder.ondataavailable = (e) => {
      arrayofChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      setCueLoading(true);

      let videoBlob = new Blob(arrayofChunks, { type: "video/webm" });

      sendVideoToServer(videoBlob, url, {
        ...usersArrRef.current[0],
        init: false,
      });

      console.log(
        `%c just after send to server executes ${new Date().toLocaleTimeString()}`,
        "background-color:teal;color:white"
      );
      arrayofChunks = [];
    };

    //if recording true stop after 30 sec
    let timeOutId = setTimeout(() => {
      if (mediaRecorder.state === "recording") mediaRecorder.stop();
    }, time);
    //chk every second
    let intervalId = setInterval(() => {
      if (globalRef.current.screenRecordingStatus === false) {
        clearInterval(intervalId);
        clearTimeout(timeOutId);
        if (mediaRecorder.state === "recording") mediaRecorder.stop();
      }
    }, 1000);
    mediaRecorder.start();
  }



  useEffect(() => {
    if (screenRecording === false || user.length === 0) {
      globalRef.current.screenRecordingStatus = false;
      return;
    }

    globalRef.current.screenRecordingStatus = true;
    let intervalId;
    gettingScreenStream().then((videoStream) => {
      console.log("videoStream", videoStream);
      sendScreenStream(videoStream, 4000);

      intervalId = setInterval(() => {
        sendScreenStream(videoStream, 4000);
      }, 4000);
    });

    return () => {
      intervalId && clearInterval(intervalId);
    };
  }, [screenRecording, user]);
  /* ========================================================================= */
  /* ========================================================================= */
  /* 12.3 Useeffect that calls startMediaRecorder as soon as VAD is turned on.  */
  /* recordingOn implies that VAD is on. If recordingOn is false then VAD is off. This useeffect gets executed every time the VAD goes on.
  Deprecated in the latest iteration as recordingOn is always false */
  useEffect(() => {
    let id: number;
    if (
      recordingOn === true &&
      microphoneToggle === true &&
      user.length > 0 &&
      user[0].isMicrophoneAvailable
    ) {
      console.log(
        `%c vad triggered ${new Date().toLocaleTimeString()}`,
        "background-color:teal;color:white"
      );

      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          startMediaRecorder(stream, 40000);
          //@ts-ignore
          id = setInterval(() => {
            console.log("recording is ", recordingOn);
            startMediaRecorder(stream, 40000);
          }, 40000);
        });
    }
    return () => clearInterval(id);
  }, [recordingOn, microphoneToggle, user]);

  /* ========================================================================= */
  /* ========================================================================= */
  /* 13.1. Declaration of the VAD function here */
  useEffect(() => {
    if (myAudioStream === null || user?.length === 0 || socket === null) return;
    // if(vadEffectRender.current>0)
    // return ;
    vadEffectRender.current++;
    //@ts-ignore
    let myVad = null;

    async function VAD(cb1: CallableFunction, cb2: CallableFunction) {
      sendToServer(new Blob([]), adminUrl, {
        ...usersArrRef.current[0],

        init: true,
      });

      const myvad = await vad?.MicVAD.new({
        onSpeechStart: cb1,
        onSpeechEnd: cb2,
        //positiveSpeechThreshold:0.9,
        //negativeSpeechThreshold:0.85,
        // positiveSpeechThreshold:0.5,
        // negativeSpeechThreshold:0.3,
        // redemptionFrames:100
      });
      // myvad.start()
      globalRef.current.myVad = myvad;
    }

    let stop;
    let medRec = null;
    let flag = false;
    let start2IntervalId: any = null;
    let stop2TimeoutId: any = null;
    function getWavBytes(buffer: any, options: any) {
      const type = options.isFloat ? Float32Array : Uint16Array;
      const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT;

      const headerBytes = getWavHeader(
        Object.assign({}, options, { numFrames })
      );
      const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

      // prepend header, then add pcmBytes
      wavBytes.set(headerBytes, 0);
      wavBytes.set(new Uint8Array(buffer), headerBytes.length);

      return wavBytes;
    }

    function getWavHeader(options: any) {
      const numFrames = options.numFrames;
      const numChannels = options.numChannels || 2;
      const sampleRate = options.sampleRate || 44100;
      const bytesPerSample = options.isFloat ? 4 : 2;
      const format = options.isFloat ? 3 : 1;

      const blockAlign = numChannels * bytesPerSample;
      const byteRate = sampleRate * blockAlign;
      const dataSize = numFrames * blockAlign;

      const buffer = new ArrayBuffer(44);
      const dv = new DataView(buffer);

      let p = 0;

      function writeString(s: string) {
        for (let i = 0; i < s.length; i++) {
          dv.setUint8(p + i, s.charCodeAt(i));
        }
        p += s.length;
      }

      function writeUint32(d: any) {
        dv.setUint32(p, d, true);
        p += 4;
      }

      function writeUint16(d: any) {
        dv.setUint16(p, d, true);
        p += 2;
      }

      writeString("RIFF"); // ChunkID
      writeUint32(dataSize + 36); // ChunkSize
      writeString("WAVE"); // Format
      writeString("fmt "); // Subchunk1ID
      writeUint32(16); // Subchunk1Size
      writeUint16(format); // AudioFormat https://i.stack.imgur.com/BuSmb.png
      writeUint16(numChannels); // NumChannels
      writeUint32(sampleRate); // SampleRate
      writeUint32(byteRate); // ByteRate
      writeUint16(blockAlign); // BlockAlign
      writeUint16(bytesPerSample * 8); // BitsPerSample
      writeString("data"); // Subchunk2ID
      writeUint32(dataSize); // Subchunk2Size

      return new Uint8Array(buffer);
    }

    function start() {
      let date = new Date();
      console.log(
        `%c vad started ${
          date.toLocaleTimeString() + ":" + date.getMilliseconds()
        }`,
        "background-color:teal;color:white"
      );

      if (adminMediaRecorderStatus.current === false) {
        console.log("caling the function");
        // sendVadStreamToServer(myStream,usersArrRef.current[0],adminUrl,4000)
      }
      vadFlag.current = true;
    }
    function stop1(audio: any) {
      let date = new Date();
      console.log(
        `%c vad stopped ${
          date.toLocaleTimeString() + ":" + date.getMilliseconds()
        }`,
        "background-color:teal;color:white"
      );
      let date2 = new Date();
      console.log(
        `%c  internal processing start ${
          date2.toLocaleTimeString() + ":" + date2.getMilliseconds()
        }`,
        "background-color:teal;color:white"
      );
      //@ts-ignore
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createBufferSource();

      const myArrayBuffer = audioCtx.createBuffer(1, audio.length, 16000);

      let nowBuffering;
      for (
        let channel = 0;
        channel < myArrayBuffer.numberOfChannels;
        channel++
      ) {
        // This gives us the actual array that contains the data
        nowBuffering = myArrayBuffer.getChannelData(channel);
        //  console.log('array buffer length',myArrayBuffer.length)
        for (let i = 0; i < myArrayBuffer.length; i++) {
          // Math.random() is in [0; 1.0]
          // audio needs to be in [-1.0; 1.0]
          nowBuffering[i] = audio[i] * 2;
        }
      }

      // set the buffer in the AudioBufferSourceNode
      //source.buffer = myArrayBuffer;

      // connect the AudioBufferSourceNode to the
      // destination so we can hear the sound
      //source.connect(audioCtx.destination);

      //start the source playing
      //console.log("ctx stream source",)

      //source.start();

      //let stream= audioCtx.createMediaStreamDestination()
      // stream

      const ch1Data = myArrayBuffer.getChannelData(0);
      const floatArr = new Float32Array(ch1Data.length);

      console.log("duration", myArrayBuffer.duration);
      const wavBytes = getWavBytes(nowBuffering?.buffer, {
        isFloat: true, // floating point or 16-bit integer
        numChannels: 1,
        sampleRate: 16000,
      });
      const wavBlob = new Blob([wavBytes], { type: "audio/ogg" });

      downsampleToWav(wavBlob, (buffer: ArrayBuffer) => {
        let date = new Date();
        console.log(
          `%c processing complete ${
            date.toLocaleTimeString() + ":" + date.getMilliseconds()
          }`,
          "background-color:teal;color:white"
        );

        const mp3Buffer = encodeMp3(buffer);
        let blob = new Blob(mp3Buffer, { type: "audio/mp3" });

        // cue logo will appear at admin end
        if (peersArrRef.current.length > 0)
          socket.emit("cue-loading-transmitter", {
            toPeer: peersArrRef.current[0],
            toggle: true,
          });

        //inserted here to ensure that the audio is not processed if there's only one person in the meeting.
        if (usersArrRef.current.length <= 1) return;
        sendToServer(blob, adminUrl, {
          ...usersArrRef.current[0],
          init: false,
        });
      });

      // console.log('myArray buffer',myArrayBuffer,myArrayBuffer.length)

      // let fA = new Float32Array(audio)
      // console.log('bufff',audio.buffer)
      // let arrBuf = new ArrayBuffer(audio)
      // console.log('arrBuf',arrBuf)
      // let blob = new Blob([fA.buffer],{type:'audio/wav'})
      // console.log('blob',URL.createObjectURL(blob))

      //let stream= audioCtx.createMediaStreamDestination()
      //console.log('context stream',stream.stream.getAudioTracks()[0])

      // let mediaRec = new MediaRecorder(audioCtx.createMediaStreamDestination())
      // medRec.

      // sendToServer(blob,adminUrl,usersArrRef.current[0])
      // vadFlag.current=false
    }

    function stop2() {
      stop2TimeoutId = setTimeout(() => {
        console.log(
          `%c audio stopped ${new Date().toLocaleTimeString()}`,
          "background-color:teal;color:white"
        );
        start2IntervalId ? clearInterval(start2IntervalId) : null;
        globalRef.current.recordingStatus = false;
        setRecordingOn(false);
      }, 1000);
    }

    //add isHost === false for client specific use-cases
    if (user && user[0]?.isMicrophoneAvailable && microphoneToggle) {
      //console.log("myvad if",globalRef.current.myVad,globalRef.current.myVad?.listening,microphoneToggle)

      if (globalRef.current.myVad === null) {
        VAD(start, stop1);
      } else {
        globalRef.current.myVad?.start();
      }
    } else {
      // myVad=null

      globalRef.current.myVad?.pause();
      // after pausing vad stop2 is not firing
      stop2();
      // console.log("myvad else",globalRef.current.myVad,globalRef.current.myVad?.listening,microphoneToggle)
    }

    return () => {
      start2IntervalId ? clearInterval(start2IntervalId) : null;
      stop2TimeoutId ? clearTimeout(stop2TimeoutId) : null;
    };
  }, [isHost, myAudioStream, user, socket, adminUrl]);

  console.log("MYID", myId);

  let values = {
    validUrl,
    setValidUrl,
    myId,
    setMyId,
    socket,
    setSocket,
    socket2,
    setSocket2,
    peersObjRef,
    peers2ObjRef,
    peersArrRef,
    peers2ArrRef,
    peer,
    setPeer,
    peer2,
    setPeer2,
    usersArrRef,
    user,
    myStream,
    setMyStream,
    name,
    setName,
    cameraToggle,
    setCameraToggle,
    microphoneToggle,
    setMicroPhoneToggle,
    msg,
    setMsg,
    cueLoading,
    setCueLoading,
    msgArrRef,
    screenSharing,
    setScreenSharing,
    largeVideoRef,
    largeVideo,
    setLargeVideo,
    adminUrl,
    setAdminUrl,
    videoStreamRef,
    videoUploadUrl,
    setVideoUploadUrl,
    stopVideoRecording,
    startRecordingScreen,
    screenRecording,
    setScreenRecording,
  };

  return (
    //@ts-ignore
    <Context.Provider value={values}>{children}</Context.Provider>
  );
}