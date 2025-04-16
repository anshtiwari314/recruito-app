// this file will be used for testing & Replacement for DataWrapper in future 

import { useSelector } from "react-redux";
import useSocket from "../hooks/useSocket";
import usePeer from "../hooks/usePeer";
import React,{ createContext, useContext, useEffect, useState } from "react";
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
    
    const [users,myState] = useAppSelector((state)=>[state.usersReducer,state.myStateReducer])

//const [videoPeer,isVideoPeer_Connected,videoPeer_Connections,videoPeer_connectToPeer,peer1_sendToPeer] = usePeer(myState.id)
//const [audioPeer,isAudioPeer_Connected,audioPeer_Connections,audioPeer_connectToPeer,audioPeer_sendToPeer] = usePeer(myState.audioPeerId)
//const [screenPeer,isScreenPeer_Connected,screenPeer_Connections,screenPeer_connectToPeer,screenPeer_sendToPeer] = usePeer(myState.peer2Id)

    
    const {CuesList,jobDescription,interviewGuide,jobTitle}=useAppSelector((state)=>state.cuesReducer)


    async function init(id:string){
    let tempUser = { ...UserTypeInitialLoadState };
    tempUser.id = id
    tempUser.audioPeerId = uuidv4();
    tempUser.peer2Id = uuidv4();
    try{
        let videoStream = await gettingVideoStream()
        let audioStream = await gettingAudioStream()

        if(videoStream){
            tempUser.videoStream = videoStream
            tempUser.isCameraAvailable = true
        }else{
            tempUser.videoStream = false
            tempUser.isCameraAvailable = false
        }
        if(audioStream){
            tempUser.audioStream = audioStream 
            tempUser.isMicrophoneAvailable = true
        }else{
            tempUser.audioStream = false
            tempUser.isMicrophoneAvailable = false
        }
    }catch(err){
        console.log('err in try catch block',err,err.message)
    }finally{
        dispatch(updateMyState(tempUser))
        dispatch(addNewUserAction(tempUser))
    }   
    }
   


    // initialise to myState 
    useEffect(() => {
  const id = uuidv4();
  
  console.log("Unique ID for this tab", id); 
  init(id);
 
  return () => {
    dispatch(removeUserAction({ id }));
  };
}, []);

 //this all is made in a sense that it will be stored in myState so dispatched to reducers meant in myState.
    console.log(users);
    
    
    const [cnt,setCnt]=useState(0);
    useEffect(()=>{
        console.log('[DEBUG-USER]',users)
        if(users.length===0)
            return ;
        // let timeOutId = setTimeout(()=>{
        //     setCnt((cnt)=>cnt+1)
        //     console.log('time out runs',cnt)
        //     dispatch(removeUserAction( {id:users[0].id}))
        // },5000)
        // return ()=>clearTimeout(timeOutId)
    },[users])

    useEffect(()=>{
        console.log(myState)
    },[myState])

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