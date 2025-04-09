import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = {
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

  const UserTypeInitialLoadState = {
    id: '',
    peer2Id: '',
    audioPeerId: '',
    stream: null,
    videoStream: null,
    audioStream: null,
    isCameraAvailable: false,
    isMicrophoneAvailable: false,
    cameraStatus: false,
    microphoneStatus: false,
  
    isAdmin: false,
    isAudioStream: false,
    isLoading: false,
    roomId: '',
    custEmailId: '',
    agentId: '',
    remove: false,
    name: '',
    isScreenSharingEnabled: false,
    containsScreenStream: false,
  }
  const myState:UserType = {...UserTypeInitialLoadState}

  const myStateSlice = createSlice({
    name: "usersReducer",
    initialState: myState,
    reducers: {
        updateMyState:()=>{

        },
         setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
    //   toggleCamera,
    //   setUserAudioStream,
    //   setUserStream,
    //   setUserVideoStream,
    //   toggleScreenSharing,
    //   toggleMicrophone,
    //   setUserLoading,
    //   updateUserAvailability,
    //   setAllUser
    },
  });

  export const { updateMyState,setId } = myStateSlice.actions;

  export default {myStateReducer : myStateSlice.reducer } 