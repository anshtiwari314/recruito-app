// this file will be used for testing & Replacement for DataWrapper in future 

import { useSelector } from "react-redux";
import useSocket from "../hooks/useSocket";
import usePeer from "../hooks/usePeer";
import React,{ createContext, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import { setId,updateMyState,UserTypeInitialLoadState } from "../reducers/myStateReducer";
import { removeUser, toggleCamera } from "../functions/users";
import { addNewUserAction, removeUserAction, toggleCameraAction, toggleMicrophoneAction, UserType } from "../reducers/usersReducer";
import { addTranscription, initialTranscriptionObj } from "../reducers/transcriptionReducer";
import { addCues, initialCuesObj, setCues, updateCues } from "../reducers/cuesReducer";
import { gettingVideoStream,gettingAudioStream,gettingScreenStream } from "../functions/mettingsUtils";
import SocketWrapper from "./SocketWrapper";

const TestWrapperContext = React.createContext('testWrapper')

export function useTestWrapper(){
    return useContext(TestWrapperContext)
}

export default function TestWrapper({children}){
    const dispatch=useDispatch();
    //as what has been mentioned in the DataWrapper.tsx   
const [videoPeer,isVideoPeer_Connected,videoPeer_Connections,videoPeer_connectToPeer,peer1_sendToPeer] = usePeer(myState.id)
const [audioPeer,isAudioPeer_Connected,audioPeer_Connections,audioPeer_connectToPeer,audioPeer_sendToPeer] = usePeer(myState.audioPeerId)
const [screenPeer,isScreenPeer_Connected,screenPeer_Connections,screenPeer_connectToPeer,screenPeer_sendToPeer] = usePeer(myState.peer2Id)

    const [users,myState] = useAppSelector((state)=>[state.usersReducer,state.myStateReducer])
    const {CuesList,jobDescription,interviewGuide,jobTitle}=useAppSelector((state)=>state.cuesReducer)


    const handleStreamError = (streamName: string) => (err: any) => {
    console.log(`Error init ${streamName} Stream`, err);
    return null;
    };

    // initialise to myState 
   useEffect(() => {
        async function initMedia() {
        let tempUser = { ...UserTypeInitialLoadState };
        tempUser.id = uuidv4();
        tempUser.audioPeerId = uuidv4();
        tempUser.peer2Id = uuidv4();

        try {
        const [videoStream, audioStream,screenStream] = await Promise.all([
            gettingVideoStream()
            .then((stream) => {
                console.log("Video Stream Properly Coming");
                return stream;
            })
            .catch(handleStreamError("Video")),

            gettingAudioStream()
            .then((stream) => {
                console.log("Audio Stream Properly Coming");
                return stream;
            })
            .catch(handleStreamError("Audio")),
            
            gettingScreenStream()
            .then((stream) => {
                console.log("Screen Stream Properly Coming");
                return stream;
            })
            .catch(handleStreamError("screen"))
        ]);
         if(videoStream){
            tempUser.videoStream=videoStream;
            tempUser.stream=videoStream;
            tempUser.isCameraAvailable=true;
            console.log(`Video Stream Init for user ${tempUser.id}`);
         }else{
            tempUser.isCameraAvailable=false;
         }

         if(audioStream){
            tempUser.audioStream=audioStream;
            tempUser.isMicrophoneAvailable=true;
            const audioTrack=audioStream.getAudioTracks();
            if(audioTrack.length>0){
                audioTrack[0].enabled=true;
                tempUser.microphoneStatus=true;   
            }
            console.log(`Audio Stream Init for user ${tempUser.id}`);
          }else{
            tempUser.isMicrophoneAvailable=false;
            }
           
            if(screenStream){
                tempUser.isScreenSharingEnabled=true;
                tempUser.containsScreenStream=true;
            }else{
                tempUser.isScreenSharingEnabled=false;
                tempUser.isScreenSharingEnabled=false;
            }

            console.log("[Debug] Streams intitlailized  properly");

            console.log("[Debug] the value of tempUser ",tempUser ,"  the val of UserTypeInitialLoadState ",UserTypeInitialLoadState);
            
            dispatch(updateMyState(tempUser));

        } catch (error) {
        console.log("Error in Init of Either Stream", error);
        }
    }
  initMedia();
}, []);
 //this all is made in a sense that it will be stored in myState so dispatched to reducers meant in myState.

    let values =  {
        users,
        myState,
    }

    return (
        //@ts-ignore
        <TestWrapperContext.Provider value={values}>
            {children}
        </TestWrapperContext.Provider>
    )
}