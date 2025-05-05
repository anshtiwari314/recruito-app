import { createSlice } from "@reduxjs/toolkit";
import {addNewUser,removeUser,updateUser} from '../functions/users'

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

  type UsersType = Array<UserType> | []

  const Users:UsersType = []

  const cuesSlice = createSlice({
    name: "usersReducer",
    initialState: Users,
    reducers: {
      addNewUser,
      removeUser,
      updateUser,
      
    },
  });

  export type {UserType,UsersType}

  export default {
    usersReducer: cuesSlice.reducer,
  };