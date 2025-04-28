import type { UserType, UsersType } from '../reducers/usersReducer'
import type { PayloadAction } from '@reduxjs/toolkit'

export function addNewUser(state: UsersType, action: PayloadAction<UserType>) {
   // Plan: First check if user is in state or not. If already present, do nothing; otherwise, add.
   const userExist = state.find((user) => user.id === action.payload.id);

   if (!userExist) {
     state.push(action.payload);
     console.log("[DEBUGGER] USER ADDED", action.payload);
   } else {
     console.log("[DEBUGGER] USER ALREADY EXISTS", action.payload);
   }
}

export function removeUser(state: UsersType, action: PayloadAction<{id:string}>) {
    //with the extracted id provided to me i will match and exclude it from the state of UserType array
    // console.log("User is about to get removed",state.filter((user) => user.id !== action.payload.id));
    console.log("[DEBUG-DELETE]I am Deleting The User ");
    
     return state.filter((user) => user.id !== action.payload.id);
}

export function updateUser(state: UsersType, action: PayloadAction<UserType>) {
    //i will find the index which id has been given for update and if index is found update by spreading 
  const uIndex = state.findIndex((user) => user.id === action.payload.id); 

  if (uIndex !== -1) {
    console.log(":user:will:be:updated");
    
    state[uIndex] = { ...state[uIndex], ...action.payload };
  }
}


//changed  both toggles->>>>working now..

export function toggleCamera(
  state: UsersType,
  action: PayloadAction<{ id: string }>
) {
  console.log("TOGGLE ACTION CAME");
  
  const uIndex = state.findIndex((user) => user.id === action.payload.id);
  if (uIndex !== -1) {
    const user = state[uIndex];
    if (user.videoStream instanceof MediaStream) {
      const videoTracks = user.videoStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const track = videoTracks[0];
        track.enabled = !track.enabled;
        user.cameraStatus = track.enabled;
        console.log(`[DEBUG-TOGGLE] Video is now ${track.enabled ? "ON" : "OFF"} and ${user.cameraStatus}`);
      }
    }
    console.log("VTOGGLE ACTION ACIVATED");
  }
}
//[1300-1330 responsible for camera toggling]

export function toggleMicrophone(
  state:UsersType,
  action:PayloadAction<{id:string}>
)
{
  const uIndex = state.findIndex((user) => user.id === action.payload.id);
  if (uIndex !== -1) {
    const user = state[uIndex];
    if (user.audioStream instanceof MediaStream) {
      const audioTracks = user.audioStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const track = audioTracks[0];
        track.enabled = !track.enabled;
        user.microphoneStatus = track.enabled;
        console.log(`[DEBUG-TOGGLE] Audio is now ${track.enabled ? "ON" : "OFF"}`);
      }
    }
    console.log("MTOGGLE ACTION ACIVATED");
  }
}

//[1350 responsible for audio toglging](need to write sockets on it )

export function setUserStream(state:UsersType,action:PayloadAction<{id:string;stream:MediaStream | null | boolean}>){
  const userIndex=state.findIndex((user)=>user.id===action.payload.id)
  if (userIndex !== -1) {
    //if user get found return MediaStream (if user) null (if not avilable) or (some toggle things )
    state[userIndex].stream=action.payload.stream
  }
}//[2115]

export function setUserVideoStream(state: UsersType, action: PayloadAction<{ id: string; videoStream: MediaStream | null }>) {
  console.log("[DEBUG-video-setter] Setting user video stream");

  const userIndex = state.findIndex((user) => user.id === action.payload.id);
  if (userIndex !== -1) {
    const prevCamStatus = state[userIndex].cameraStatus;

    state[userIndex].videoStream = action.payload.videoStream ? action.payload.videoStream : null;
    state[userIndex].isCameraAvailable = !!action.payload.videoStream;

    if (action.payload.videoStream instanceof MediaStream) {
      const videoTracks = action.payload.videoStream.getVideoTracks();
      if (videoTracks.length > 0) {
        console.log("Setting video track enabled:", prevCamStatus);
        videoTracks[0].enabled = prevCamStatus;
      }
    }
  }
}

export function setUserAudioStream(state: UsersType, action: PayloadAction<{ id: string; audioStream: MediaStream | null }>) {
  console.log('[DEBUGGER-OF_AUDIO-Setter] Setting user audio stream');

  const userIndex = state.findIndex((user) => user.id === action.payload.id);
  if (userIndex !== -1) {
    const prevMicStatus = state[userIndex].microphoneStatus;

    state[userIndex].audioStream = action.payload.audioStream ? action.payload.audioStream : null;
    state[userIndex].isMicrophoneAvailable = !!action.payload.audioStream;

    if (action.payload.audioStream instanceof MediaStream) {
      const audioTracks = action.payload.audioStream.getAudioTracks();
      if (audioTracks.length > 0) {
        console.log("Setting audio track enabled:", prevMicStatus);
        audioTracks[0].enabled = prevMicStatus;
      }
    }
  }
}
//[1244]

export function toggleScreenSharing(state:UsersType, action: PayloadAction<{ id: string; enabled: boolean; screenStream?: MediaStream }>){
  const userIndex = state.findIndex((user) => user.id === action.payload.id);
  if(userIndex!=-1){
    state[userIndex].isScreenSharingEnabled=action.payload.enabled
    if(action.payload.enabled && action.payload.screenStream){
      //create a new instance fr user to screen share
      //a hook is already created to manage the inti of screen
      const screenUser:UserType={
        id:action.payload.id,
        peer2Id:state[userIndex].peer2Id,
        audioPeerId:'',
        stream:action.payload.screenStream,
        videoStream:action.payload.screenStream,
        audioStream:null,
        isCameraAvailable:true,
        isMicrophoneAvailable:false,
        cameraStatus:true,
        microphoneStatus:false,
        isAdmin:false,
        isAudioStream:false,
        isLoading:false,
        roomId:state[userIndex].roomId,
        custEmailId:state[userIndex].custEmailId,
        agentId:state[userIndex].agentId,
        remove:false,
        name:state[userIndex].name,
        isScreenSharingEnabled:false,
        containsScreenStream:true
      }
      state.push(screenUser)
    }else if(!action.payload.enabled){
      //remove any screen share state(UsersType[]) associated with the curr user
      state=state.filter((user)=>!(user.containsScreenStream && user.peer2Id===state[userIndex].peer2Id))
    }
  }
  return state;
}//[1417]

export function setUserLoading(state:UsersType,action:PayloadAction<{id:string;isLoading:boolean}>){
  const userIndex=state.findIndex((user)=>user.id===action.payload.id);
  if (userIndex !== -1) {
    state[userIndex].isLoading=action.payload.isLoading
  }
}///used too many times during getting MediaStreams dusring initialisation before rtc while answering peer set by another peer 

export function setAllUser(state:UsersType, action: PayloadAction<UsersType>):UsersType {
  console.log("update has been done in the users array");    
  return action.payload;
}

export function updateUserAvailability(state:UsersType,action:PayloadAction<{id:string;isCameraAvailable?:boolean;isMicroPhoneAvailable?:boolean}>){
  const userIndex=state.findIndex((user)=>user.id===action.payload.id);
  if (userIndex !== -1) {
    if(action.payload.isCameraAvailable!==undefined){
      state[userIndex].isCameraAvailable=action.payload.isCameraAvailable
    }
    if(action.payload.isMicroPhoneAvailable!==undefined){
      state[userIndex].isMicrophoneAvailable=action.payload.isMicroPhoneAvailable
    }
  }
}//during screen sharing/getting video/audio stream can be useful when we want to check wheater camera and microphone aviable for call of peer2(applicant) or maybe peer1(interviwer)


//there is a use state / use ref largeVideo but it is not used anywhere maybe it was intended to know which user has larger Screen  

//at last the clean up functionality when usersArray is returned to its initial state when the audio and Video Stream track are turned off when components mount .

export function clearAllUsers(state:UsersType){
  state.forEach((user)=>{
    if(user.stream instanceof MediaStream){
      user.stream.getTracks().forEach((track)=>track.stop());
    }
    if(user.videoStream  instanceof MediaStream){
      user.videoStream.getTracks().forEach((track)=>track.stop());
    }
    if(user.audioStream  instanceof MediaStream){
      user.audioStream.getTracks().forEach((track)=>track.stop());
    }
  })
  state=[]
  return state;
}//in the useEffect of 1200 and in 1282 for the cleaning up it will be mainly used when call is closing  
