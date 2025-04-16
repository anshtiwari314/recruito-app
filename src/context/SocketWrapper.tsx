import React, { useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useAppSelector } from "../store/store";
import useSocket from "../hooks/useSocket";
import { addNewUserAction, removeUserAction, toggleCameraAction, toggleMicrophoneAction } from "../reducers/usersReducer";
import { removeUser } from "../functions/users";
import { addTranscription, initialTranscriptionObj, TranscriptionDataType, TranscriptionState } from "../reducers/transcriptionReducer";
import { addCues, CuesDataType, initialCuesObj, setCues, updateCues } from "../reducers/cuesReducer";
import queryparamReducer from "../reducers/queryparamReducer";



const SocketWrapperContext = React.createContext('socketWrapper')

export function useSocketWrapper(){
    return useContext(SocketWrapperContext)
}

export default function SocketWrapper({children}){
    const dispatch=useDispatch();

    const socket1Url='wss://recruitonodesocket.vitti.insure';
    const socket1Url2 = 'https://vitt-jarvis-node-production.up.railway.app/'
    const socket1Url3 = 'http://localhost:3002'

    const socket2Url='wss://recruito.vitti.insure';
    const socket2Url2 = null
    
    const options = {
        reconnection: false,
        reconnectionAttempts: 5, // Number of retries before giving up
        reconnectionDelay: 1000, // Time between retries (in ms)
      };

    const [isSocket1_Connected,socket1_emitEvent,socket1_onEvent,socket1_offEvent] = useSocket(socket1Url3,options,socketConnectedFirstTime)
    //const [isSocket2_Connected,socket2_emitEvent,socket2_onEvent,socket2_offEvent] = useSocket(socket2Url2)

    //note***->need to do something memoization of it since it was giving error of rerendering.
    const [users,myState] = useAppSelector((state)=>[state.usersReducer,state.myStateReducer])
    const {CuesList,jobDescription,interviewGuide,jobTitle}=useAppSelector((state)=>state.cuesReducer)

   function socketConnectedFirstTime() {
    console.log('socketConnectedFirstTime');
    const roomId = myState?.roomId || "default-room";
    const userId = myState?.id;

    socket1_emitEvent("join-room", { roomId, userId });
    console.log(users);
    if (!users || users.length === 0) {
        console.log("users---->",users);
        return;
    }

    users.forEach((userObj) => {
    const peerId = userObj.id;
    if (!peerId) {
        console.log("[Debuuger-for-Invalid]");
        return;
    }
    const data = {
        toPeer: peerId,
        userData: {
            ...myState,
            id: myState.id,
            stream: null,
            videoStream: null,
            audioStream: null,
            toPeer: peerId,
            peer2Id: myState?.peer2Id,
            audioPeerId: myState?.audioPeerId,
            isLoading: false,
            count: 1,
        }
    };
    console.log("[DEBUUGERR-CONNECTED_USER]", data);
    socket1_emitEvent("connected-user-data", data);
   });
    socket1_onEvent('receive-connected-user-data', (data) => 
    {
        console.log('receive-connected-user-data', data);
        dispatch(addNewUserAction(data.userData));
    });
    console.log("user after this->",users)
    console.log("[DEBUG-Line]Is it reaching here??");
}


    function socket2_onEvent(){

    }

    useEffect(()=>{
        console.log('socket1',isSocket1_Connected)
    },[isSocket1_Connected])

    useEffect(()=>{
            //socket 1 event handler 
        function handleUserConnected(userId:string){
                console.log(`user connected ${userId}`)
                if(myState.id){
                    socket1_emitEvent('connected-user-data',{
                        ...myState,
                        toPeer:userId,
                        isLoading:true,
                    })
                }
            }

        function handleUserDisconected(userId){
            console.log(`user disconnected ${userId}`)

            if(users.length){
                const index = users.findIndex(user => user.id === userId)
                    if(index !== -1){
                     dispatch(removeUserAction({id:userId}))
                   }
                }
          }

        function handleCameraToggle(data) {
            console.log('camera toggle event', data);
                if (users.length > 0) {
                    dispatch(
                    toggleCameraAction({
                        id: data.id,
                        enabled: data.cameraStatus,
                    })
                    );
                }
            }


        function handleMicroPhoneToggle(data){
              console.log('microphone toggle event',data)
               if (users.length > 0) {
                dispatch(
                    toggleMicrophoneAction({
                        id: data.id,
                        enabled: data.microphoneStatus,
                }))
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
            console.log('tab close event remove video');
        }

        function handleToLeavePageReciver(userId){
            console.log('leave page event',userId);
            dispatch(removeUserAction({id:userId}));
        }
        
        function handleScreenShareReciver(data){
            console.log('screen share event',data);
            dispatch(addNewUserAction(data));
        }

        function handleScreenShareEndReciver(data)
        {
            console.log('screen share end event',data);
            dispatch(removeUserAction({id:data.videoId}));
        }
        

        function handleSingleScreenShareReceiver(data){
            console.log('single screen share event',data);
            dispatch(addNewUserAction(data));
        }

        function handleUserChatReciver(data){
            console.log('user chat event',data);
           // dispatch(setChatHistory(data.chats));//unsure where to send this data in dataWrapper it was managed by useState and ref
        }

        function handleReciveMsg(data){
            console.log('recive msg event',data);
           // dispatch(addChatHistory(data));//unsure where to send this data
        }

        function handleCueLoadingReciver(data){
            console.log('cue loading event',data);
            dispatch(setCues(data.toggle));
        }
        
         function handleLiveTranscriptions(data) {

            console.log('live transcriptions event', data)
            const tempArr: TranscriptionDataType[] = []
            const obj = { ...initialTranscriptionObj }
            obj.transcription = data.transcription
            obj.speaker = data.speaker 
            obj.timeStamp = data?.time_stamp 
            tempArr.push(obj as TranscriptionDataType)
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
                const fileterdCues=CuesList?.map((e:any)=>{
                    if(e.common_id ===data?.common_id ){
                        return {...e, isanswered:data.isanswered,match_score:data.match_score,contet:data.content??""}
                    }
                    return e
                })
                if(!fileterdCues){
                    return
                }
                dispatch(updateCues({CuesList:fileterdCues}))
            }else{

                const tempArr:CuesDataType[] = []
                const obj = { ...initialCuesObj }
                obj.content = data.content
                obj.sessionid = data.sessionid
                obj.audiofiletimestamp = data.audiofiletimestamp
                obj.common_id = data.common_id
                obj.similarity_query = data.similarity_query
                obj.isanswered = data.isanswered
                obj.match_score = data.match_score
                tempArr.push(obj as CuesDataType)

                dispatch(addCues(tempArr))
                 }
         }

        function handleRecruiterNotesRes(data) {
            console.log("recruiter notes response event", data)
        }

        socket1_onEvent("user-connected", handleUserConnected)
        // socket1_onEvent("user-disconnected", handleUserDisconected)
        // socket1_onEvent("tab-close-remove-video", handleTabCloseRemoveVideo)
        // socket1_onEvent("to-leave-page-receiver", handleToLeavePageReciver)
        // socket1_onEvent("camera-toggle-receiver", handleCameraToggle)
        // socket1_onEvent("microphone-toggle-receiver", handleMicroPhoneToggle)
        // socket1_onEvent("receive-connected-user-data", handleUserData)
        // socket1_onEvent("screen-share-receiver", handleScreenShareReciver)
        // socket1_onEvent("screen-share-end-receiver", handleScreenShareEndReciver)
        // socket1_onEvent("single-screen-share-receiver", handleSingleScreenShareReceiver)
        // socket1_onEvent("user-chat-receiver", handleUserChatReciver)
        // socket1_onEvent("receive-msg", handleReciveMsg)
        // socket1_onEvent("cue-loading-receiver", handleCueLoadingReciver)


        // socket2_onEvent("live_transcription_res", handleLiveTranscriptions)
        // socket2_onEvent("questions_loader_res", handleJobDetails)
        // socket2_onEvent("ai_suggestion_res", handleLiveQna)
        // socket2_onEvent("recruiter_notes_res", handleRecruiterNotesRes)

        // if (isSocket1_Connected && myState.id) {
        //     socket1_emitEvent('join-room', {
        //         roomId: myState.roomId || "default-room",
        //         userId: myState.id
        //     });
        // }
        // return () =>{
        socket1_offEvent("user-connected", handleUserConnected)
        // socket1_offEvent("user-disconnected", handleUserDisconected)
        // socket1_offEvent("tab-close-remove-video", handleTabCloseRemoveVideo)
        // socket1_offEvent("to-leave-page-receiver", handleToLeavePageReciver)
        // socket1_offEvent("camera-toggle-receiver", handleCameraToggle)
        // socket1_offEvent("microphone-toggle-receiver", handleMicroPhoneToggle)
        // socket1_offEvent("receive-connected-user-data", handleUserData)
        // socket1_offEvent("screen-share-receiver", handleScreenShareReciver)
        // socket1_offEvent("screen-share-end-receiver", handleScreenShareEndReciver)
        // socket1_offEvent("single-screen-share-receiver", handleSingleScreenShareReceiver)
        // socket1_offEvent("user-chat-receiver", handleUserChatReciver)
        // socket1_offEvent("receive-msg", handleReciveMsg)
        // socket1_offEvent("cue-loading-receiver", handleCueLoadingReciver)

        // socket2_offEvent("live_transcription_res", handleLiveTranscriptions)
        // socket2_offEvent("questions_loader_res", handleJobDetails)
        // socket2_offEvent("ai_suggestion_res", handleLiveQna)
        // socket2_offEvent("recruiter_notes_res", handleRecruiterNotesRes)
        // }
    },[isSocket1_Connected,socket1_emitEvent,socket1_onEvent,socket1_offEvent]);
    
   const handleToggleCamera=()=>{
    if(myState.videoStream instanceof MediaStream){
        const vidTrack=myState.videoStream.getVideoTracks()
        if(vidTrack.length>0){
            const newValue=!myState.cameraStatus
            vidTrack[0].enabled=newValue
            dispatch(toggleCameraAction({
                id:myState.id,
                enabled:newValue
            }))
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
        dispatch(toggleMicrophoneAction({
            id: myState.id,
            enabled: newStatus
        }))
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
        // isSocket2_Connected,
        socket1_emitEvent,
        // socket2_emitEvent,
        toggleCamera:handleToggleCamera,
        toggleMicrophone:handleToggleMicrophone,
    }
     return (
        //@ts-ignore
        <SocketWrapperContext.Provider value={values}>
            {children}
        </SocketWrapperContext.Provider>
    )
}