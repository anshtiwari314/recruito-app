import type React from "react";
import {v4 as uuidv4} from "uuid";
import type { UserType } from "../reducers/usersReducer";
import {io} from "socket.io-client";
import Peer from "peerjs";
import type {CuesDataType} from "../reducers/cuesReducer";
import type { Dispatch } from "redux";
import {addCues,setCues,updateCues,initialCuesObj} from "../reducers/cuesReducer";

// @ts-ignore 
import vad from "voice-activity-detection";
import { getTimestamp,processRecordedAudio,sendToServer,isUserAvailable,sendVideoToServer } from "./mettingsUtils";
import { useMemo } from "react";
import WavToMp3 from "./wavToMp3";


export function createPeerOptions(){
    const peerOptions = useMemo(() => {
        return {
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
              { urls: "stun:stun3.l.google.com:19302" },
              { urls: "stun:stun4.l.google.com:19302" },
              { urls: "stun:stun.relay.metered.ca:80" },
              {
                urls: "turn:global.relay.metered.ca:80",
                username: "9a68873a2f7a5c9a9755e52e",
                credential: "2kG2qDdT1PESBuUQ",
              },
              {
                urls: "turn:global.relay.metered.ca:80?transport=tcp",
                username: "9a68873a2f7a5c9a9755e52e",
                credential: "2kG2qDdT1PESBuUQ",
              },
              {
                urls: "turn:global.relay.metered.ca:443",
                username: "9a68873a2f7a5c9a9755e52e",
                credential: "2kG2qDdT1PESBuUQ",
              },
              {
                urls: "turns:global.relay.metered.ca:443?transport=tcp",
                username: "9a68873a2f7a5c9a9755e52e",
                credential: "2kG2qDdT1PESBuUQ",
              },
              {
                urls: "stun:global.stun.twilio.com:3478",
              },
              {
                urls: "turn:global.turn.twilio.com:3478?transport=udp",
                username: "81c1cec94e2e43736ac98b05d3d093f19919a3405b5686dd57e4525c795f8832",
                credential: "uuaXnZ1XBD6pfyEiSC2owYcCMQkWhFI4sGvJQ+9yc3A=",
              },
              {
                urls: "turn:global.turn.twilio.com:3478?transport=tcp",
                username: "81c1cec94e2e43736ac98b05d3d093f19919a3405b5686dd57e4525c795f8832",
                credential: "uuaXnZ1XBD6pfyEiSC2owYcCMQkWhFI4sGvJQ+9yc3A=",
              },
              {
                urls: "turn:global.turn.twilio.com:443?transport=tcp",
                username: "81c1cec94e2e43736ac98b05d3d093f19919a3405b5686dd57e4525c795f8832",
                credential: "uuaXnZ1XBD6pfyEiSC2owYcCMQkWhFI4sGvJQ+9yc3A=",
              },
            ],
          },
        };
      }, []); 
    
      return peerOptions;
    }


export async function ShareScreenToUserIn(
    stream:MediaStream,
    newUserId:string,
    peer2:Peer | null,
    Peers2ObjRef:React.MutableRefObject<Record<string,any>>
):Promise<void> {
    console.log("Sharing Screen to User:",newUserId,stream);
    if(!peer2){
        console.error("Peer2 is null or not Initialized");
        return;
    }    
    let call=peer2.call(newUserId,stream);
    let count=0;
    //retry if calls fails-same as in original code 
    if(!call){
        console.error("Call failed");
        call=peer2.call(newUserId,stream);
    }
    try {
        Peers2ObjRef.current[call.peer]={call:call}
        call.on("close",()=>{
            console.log("Call closed");
            //clean up logic was commented in the og code.
        });
    }catch(error){
        console.error("Error in call.on close:",error);
    }
}

export async function SendVideoToNewUser(
    stream:MediaStream,
    newUserId:string,
    peer2:Peer|null,
    peersObjRef:React.MutableRefObject<Record<string,any>>
):Promise<void>{
    console.log("Sending Video to New User:",newUserId,stream);
    if(!peer2){
        console.error("Peer2 is null or not Initialized");
        return;
    }
    let call=peer2.call(newUserId,stream);
    let count=0;
    if(!call){
        console.error("Call failed trying again");
        call=peer2.call(newUserId,stream);
    }

    try {
        call.on('close',()=>{
            console.log("Call closed");
            //clean up logic was commented in the og code.
        })
        if(call && peersObjRef){
            peersObjRef.current[call.peer]={call:call}
        }
    } catch (error) {
        console.error("Error in sendVideoToNewUser:",error);
    }
}
export async function SendAudioToNewUser(
    stream:MediaStream,
    newUserId:string,
    audioPeer:Peer | null,
    audioPeersObjRef:React.MutableRefObject<Record<string,any>>
):Promise<void>{
    console.log("Sending Audio to New User:",newUserId,stream);
    if(!audioPeer){
        console.error("AudioPeer is null or not Initialized");
        return;
    }
    let call=audioPeer.call(newUserId,stream);
    let count=0;
    if(!call){
        console.error("Call failed trying again");
        call=audioPeer.call(newUserId,stream);
    }
    try {
        call.on('close',()=>{
            console.log("Close event fired in sendAudioToNewUser");
            //clean up logic was commented in the og code.
        })
        if(call && audioPeersObjRef){
            audioPeersObjRef.current[call.peer]={call:call}
        }
    }catch(error){
        console.error("Error in sendAudioToNewUser:",error);
    }
}

export function removeUserFromPeersArr(
    userId: string,
    peersArrRef:React.MutableRefObject<string[]>
):void{
    if(peersArrRef.current.includes(userId)){
        peersArrRef.current.splice(peersArrRef.current.indexOf(userId),1);
    }
}
export function startMediaRecorder(args){
    //let url = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'

    let {stream,url,time,recordingStatus,sessionid,userid,fileid,filename,timeStamp} = args
    console.log('startMediaRecorder triggered')

    //let url = audioServerUrl
     let arrayofChunks:any = []
       let mediaRecorder = new MediaRecorder(stream,{
         audioBitsPerSecond:32000
         })
     
     mediaRecorder.ondataavailable = (e)=>{ 
       arrayofChunks.push(e.data)
     }
     
     mediaRecorder.onstop = async ()=>{
      //setMsgLoading(true)
     
      //let url = `https://asia-south1-utility-range-375005.cloudfunctions.net/save_b64_1`
     //let url = `https://0455-182-72-76-34.ngrok.io`
     console.log(`%c just before wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
     let mp3Blob = await WavToMp3(new Blob(arrayofChunks,{type:'audio/wav'}))
     //console.log(mp3Blob)
     console.log(`%c just after wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
     
     let data = {
      
      mob:'vois',
     // uid:myId,
      userid,
      sessionid,
      url:window.location.href,
      date: '13.3.2025',
      time: '11.51.0.57',
      fileid,
      filename,
      timeStamp
    }

     sendToServer( mp3Blob,url,sessionid,data)
      arrayofChunks = []
     }

     //setTimeout(()=>mediaRecorder.stop(),time)
 
     //if recording true stop after 30 sec
     let timeOutId = setTimeout(()=>{
      if(mediaRecorder.state==='recording')
      mediaRecorder.stop()
     },time)
     //chk every second 

     

     let timeOutId2 =setTimeout(()=>requestAnimationFrame(()=>{

      if(recordingStatus.current ===false){
        //clearInterval(intervalId) 
        clearTimeout(timeOutId)
        clearTimeout(timeOutId2)
       if(mediaRecorder.state==='recording')
        mediaRecorder.stop()
        
      }
     }),1000)
     

    //  let intervalId = setInterval(
       
    //  },1000)
     mediaRecorder.start()
     
   }
export function startMediaRecorder2(args){
    //let url = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'

    const {stream,url,time,recordingStatus,sessionid,userid,fileid,filename,timeStamp} =args

    console.log('startMediaRecorder triggered')

    //let url = audioServerUrl
     let arrayofChunks:any = []
       let mediaRecorder = new MediaRecorder(stream,{
         audioBitsPerSecond:32000
         })
     
     mediaRecorder.ondataavailable = (e)=>{ 
       arrayofChunks.push(e.data)
     }
     
     mediaRecorder.onstop = async ()=>{
      //setMsgLoading(true)
     
      //let url = `https://asia-south1-utility-range-375005.cloudfunctions.net/save_b64_1`
     //let url = `https://0455-182-72-76-34.ngrok.io`
     console.log(`%c just before wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
     let mp3Blob = await WavToMp3(new Blob(arrayofChunks,{type:'audio/wav'}))
     //console.log(mp3Blob)
     console.log(`%c just after wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
     
     let data = {
      
      //mob:'vois',
     // uid:myId,
      userid,
      sessionid,
      url:window.location.href,
      date: '13.3.2025',
      time: '11.51.0.57',
      fileid,
      filename,
      timeStamp
    }

     sendToServer( mp3Blob,url,sessionid,data)
      arrayofChunks = []
     }

     //setTimeout(()=>mediaRecorder.stop(),time)
 
     //if recording true stop after 30 sec
     let timeOutId = setTimeout(()=>{
      if(mediaRecorder.state==='recording')
      mediaRecorder.stop()
     },time)
     //chk every second 

     

     let timeOutId2 =setTimeout(()=>requestAnimationFrame(()=>{

      if(recordingStatus.current ===false){
        //clearInterval(intervalId) 
        clearTimeout(timeOutId)
        clearTimeout(timeOutId2)
       if(mediaRecorder.state==='recording')
        mediaRecorder.stop()
        
      }
     }),1000)
     

    //  let intervalId = setInterval(
       
    //  },1000)
     mediaRecorder.start()
     
   }