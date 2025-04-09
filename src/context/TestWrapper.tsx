// this file will be used for testing & Replacement for DataWrapper in future 

import { useSelector } from "react-redux";
import useSocket from "../hooks/useSocket";
import React,{ createContext, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import { setId } from "../reducers/myStateReducer";
import { removeUser, toggleCamera } from "../functions/users";
import { addNewUserAction, removeUserAction, toggleCameraAction, toggleMicrophoneAction } from "../reducers/usersReducer";
import { addTranscription, initialTranscriptionObj } from "../reducers/transcriptionReducer";
import { addCues, initialCuesObj, setCues, updateCues } from "../reducers/cuesReducer";


const TestWrapperContext = React.createContext('testWrapper')

export function useTestWrapper(){
    return useContext(TestWrapperContext)
}

export default function TestWrapper({children}){
    const dispatch=useDispatch();
    //as what has been mentioned in the DataWrapper.tsx
    const socket1Url='wss://recruitonodesocket.vitti.insure';
    const socket2Url='wss://recruito.vitti.insure';
    const [isSocket1_Connected,socket1_emitEvent,socket1_onEvent] = useSocket(socket1Url)
    const [isSocket2_Connected,socket2_emitEvent,socket2_onEvent] = useSocket(socket2Url)
    const [users,myState] = useAppSelector((state)=>[state.usersReducer,state.myStateReducer])
    const {CuesList,jobDescription,interviewGuide,jobTitle}=useAppSelector((state)=>state.cuesReducer)

    // initialise to myState 
    useEffect(()=>{
        // initialising id
        const id=uuidv4()
        dispatch(setId(id));

        const peer2Id=uuidv4()
        dispatch(setPeer2Id(peer2Id))

        const audioPeerId=uuidv4()
        dispatch(setAudioPeerId(audioPeerId))
        //initialise videoStream 
        navigator.mediaDevices.getUserMedia({video:true})
        .then((videoStream)=>{
           dispatch(setVideoStream(videoStream));
           dispatch(setStream(videoStream))
           dispatch(setCameraAvialibilty(true));
           console.log(`video stream init for user ${id}`)
        })
        .catch((err)=>{
            dispatch(setCameraAvialibilty(false))
            dispatch(setVideoStream(false));
            console.log("video stream initliasized error or permision denied",err);
        })
        //initialise audioStream 
        navigator.mediaDevices.getUserMedia({audio:true})
        .then((audioStream)=>{
            dispatch(setAudioStream(audioStream));
            dispatch(setMicrophoneAvialiblity(true));
            const audioTracks = audioStream.getAudioTracks()
            if (audioTracks.length > 0) {
            audioTracks[0].enabled = true
            dispatch(toggleMicrophone(true))
            }
            console.log(`audio stream init for user ${id}`)
        })
        .catch((err)=>{
            dispatch(setMicrophoneAvialiblity(false))
            dispatch(setAudioStream(false));
            console.log("MicroPhone error occured or permision denied",err);
        })
    },[dispatch]) //this all is made in a sense that it will be stored in myState so dispatched to reducers meant in myState.

    //define socket1 & socket2 onEvents here 
    useEffect(()=>{
        //socket1 handelers
        function handleUserConnected(userId){
            console.log(`user connected ${userId}`)
            if(myState.id){
                socket1_emitEvent('connected-user-data',{
                    ...myState,
                    toPeer:userId,
                    isLoading:true,
                })//1253
            }
        }

        function handleUserDisconected(userId){
            console.log(`user disconnected ${userId}`)
            if(users.length){
                const index = users.findIndex(user => user.id === userId)
                if(index !== -1){
                    dispatch(removeUserAction(userId))
                }
            }
        }

        function handleCameraToggle(data){
            console.log('camera toggle event',data)
            if(users.length>0){
                dispatch(
                    toggleCameraAction({
                        id:data.id,
                        enabled:data.cameraStatus,
                    })
                )
            }
        }

        function handleMicroPhoneToggle(data){
            console.log('microphone toggle event',data)
             if (users.length > 0) {
             dispatch(
                 toggleMicrophoneAction({
                    id: data.id,
                    enabled: data.microphoneStatus,
            }),
            )
        }
    }
    
        function handleUserData(data){
            console.log('user data event',data)
            if(data.count!==0){
                socket1_emitEvent("connected-user-data",{
                    ...myState,
                    toPeer:data.id,
                    isLoading:false,
                    count:--data.count,
                })
            }else{
                if(myState.id){
                    socket1_emitEvent("connected-user-data",{
                        chats:[],//unclear abt it since i had no user i must have no datato display so empty array or do i need prev chat
                        toPeer:data.id,
                        from:myState.id,
                    })
                }
            }
            dispatch(addNewUserAction(data))
        }
        function handleTabCloseRemoveVideo(){
            console.log('tab close event remove video');//in data wrapper it was empty only 
        }

        function handleToLeavePageReciver(userId){
            console.log('leave page event',userId);
            dispatch(removeUser(userId));//from my own state i will be removed if i leave page
        }
        function handleScreenShareReciver(data){
            console.log('screen share event',data);
            dispatch(addNewUserAction(data));
        }
        function handleScreenShareEndReciver(data)
        {
            console.log('screen share end event',data);
            dispatch(removeUser(data.videoId));
        }

        function handleSingleScreenShareReceiver(data){
            console.log('single screen share event',data);
            dispatch(addNewUserAction(data));
        }

        function handleUserChatReciver(data){
            console.log('user chat event',data);
            dispatch(setChatHistory(data.chats));
        }

        function handleReciveMsg(data){
            console.log('recive msg event',data);
            dispatch(addChatHistory(data));
        }

        function handleCueLoadingReciver(data){
            console.log('cue loading event',data);
            dispatch(setCueLoading(data.toggle));
        }
        //socket2 

        function handleLiveTranscriptions(data){
            console.log('live transcriptions event',data)
            const tempArr=[]
            const obj={...initialTranscriptionObj}
            obj.transcription=data.transcription
            obj.speaker=data.speaker 
            obj.timeStamp=data?.time_stamp 
            tempArr.push(obj)
            dispatch(addTranscription(tempArr))
        }

        function handleJobDetails(data){
            console.log('job details event',data)
            let filteredCues=data?.preloadedQuestions || []
            if (CuesList?.length > 0) {
            filteredCues = [...CuesList, ...filteredCues]
            const seen = new Set()
            filteredCues = filteredCues.filter((item) => {
            if (item?.similarity_query) {
                if (seen.has(item?.similarity_query)) return false
                seen.add(item?.similarity_query)
            }
            return true
        })
      }

        dispatch(
            setCues({
            CuesList: filteredCues,
            jobDescription: (jobDescription === "" ? null : jobDescription) ?? data?.jobDescription,
            interviewGuide: (interviewGuide === "" ? null : interviewGuide) ?? data?.interviewGuide,
            jobTitle: (jobTitle === "" ? null : jobTitle) ?? data?.jobTitle,
            }),
        )
    }
        function handleLiveQna(data) {
            console.log("Live Q&A:", data)
            if(data?.type ==='cues-update'){
                const fileterdCues=CuesList?.map((e)=>{
                    if(e.common_id ===data?.common_id ){
                        return {...e, isanswered:data.isanswered,match_score:data.match_score,contet:data.content??""}
                    }
                    return e
                })
                if(!fileterdCues){
                    return
                }
                dispatch(updateCues(CuesList:filteredCues))
            }else{
                const tempArr = []
                const obj = { ...initialCuesObj }
                obj.content = data.content
                obj.sessionid = data.sessionid
                obj.audiofiletimestamp = data.audiofiletimestamp
                obj.common_id = data.common_id
                obj.similarity_query = data.similarity_query
                obj.isanswered = data.isanswered
                obj.match_score = data.match_score
                tempArr.push(obj)

                dispatch(addCues(tempArr))
                 }
        }

       function handleRecruiterNotesRes(data) {
          console.log("recruiter notes response event", data)
       }

    socket1_onEvent("user-connected", handleUserConnected)
    socket1_onEvent("user-disconnected", handleUserDisconected)
    socket1_onEvent("tab-close-remove-video", handleTabCloseRemoveVideo)
    socket1_onEvent("to-leave-page-receiver", handleToLeavePageReciver)
    socket1_onEvent("camera-toggle-receiver", handleCameraToggle)
    socket1_onEvent("microphone-toggle-receiver", handleMicroPhoneToggle)
    socket1_onEvent("receive-connected-user-data", handleUserData)
    socket1_onEvent("screen-share-receiver", handleScreenShareReciver)
    socket1_onEvent("screen-share-end-receiver", handleScreenShareEndReciver)
    socket1_onEvent("single-screen-share-receiver", handleSingleScreenShareReceiver)
    socket1_onEvent("user-chat-receiver", handleUserChatReciver)
    socket1_onEvent("receive-msg", handleReciveMsg)
    socket1_onEvent("cue-loading-receiver", handleCueLoadingReciver)


    socket2_onEvent("live_transcription_res", handleLiveTranscriptions)
    socket2_onEvent("questions_loader_res", handleJobDetails)
    socket2_onEvent("ai_suggestion_res", handleLiveQna)
    socket2_onEvent("recruiter_notes_res", handleRecruiterNotesRes)

        if(isSocket1_Connected && myState.id){
            socket1_emitEvent('join-room',
                myState.roomId || "default-room",myState.id
            )
        }

        return () =>{
      socket1_onEvent("user-connected", null)
      socket1_onEvent("user-disconnected", null)
      socket1_onEvent("tab-close-remove-video", null)
      socket1_onEvent("to-leave-page-receiver", null)
      socket1_onEvent("camera-toggle-receiver", null)
      socket1_onEvent("microphone-toggle-receiver", null)
      socket1_onEvent("receive-connected-user-data", null)
      socket1_onEvent("screen-share-receiver", null)
      socket1_onEvent("screen-share-end-receiver", null)
      socket1_onEvent("single-screen-share-receiver", null)
      socket1_onEvent("user-chat-receiver", null)
      socket1_onEvent("receive-msg", null)
      socket1_onEvent("cue-loading-receiver", null)

      
      socket2_onEvent("live_transcriptions_res", null)
      socket2_onEvent("questions_loader_res", null)
      socket2_onEvent("ai_suggestion_res", null)
      socket2_onEvent("recruiter_notes_res", null)
        }
    },[socket1_onEvent,socket2_onEvent,socket1_emitEvent,isSocket1_Connected])
    
   const handleToggleCamera=()=>{
    if(myState.videoStream instanceof MediaStream){
        const vidTrack=myState.videoStream.getVideoTracks()
        if(vidTrack.length>0){
            const newValue=!myState.cameraStatus
            vidTrack[0].enabled=newValue
            dispatch(toggleCamera(newValue))
            //notify other users
            if(isSocket1_Connected){
                socket1_emitEvent('camera-toggle-transmitter',{cameraStatus:newValue,id:myState.id,})
            }//700
        }
    }
   }
      const handleToggleMicrophone = () => {
    if (myState.audioStream instanceof MediaStream) {
      const audioTracks = myState.audioStream.getAudioTracks()
      if (audioTracks.length > 0) {
        const newStatus = !myState.microphoneStatus
        audioTracks[0].enabled = newStatus
        dispatch(toggleMicrophone(newStatus))

        // Notify other users
        if (isSocket1_Connected) {
          socket1_emitEvent("microphone-toggle-transmitter", {
            microphoneStatus: newStatus,
            id: myState.id,
          })
        }
      }
    }
  }
    

    let values =  {
        isSocket1_Connected,
        isSocket2_Connected,
        socket1_emitEvent,
        socket2_emitEvent,
        users,
        myState,
        toggleCamera:handleToggleCamera,
        toggleMicrophone:handleToggleMicrophone,
    }

    return (
        //@ts-ignore
        <TestWrapperContext.Provider value={values}>
            {children}
        </TestWrapperContext.Provider>
    )
}