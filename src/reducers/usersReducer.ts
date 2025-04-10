import { createSlice, PayloadAction,current } from "@reduxjs/toolkit";
import {addFirstUser,addNewUser,removeUser,updateUser,toggleCamera,setUserAudioStream,setUserStream,setUserVideoStream,toggleScreenSharing,toggleMicrophone, setUserLoading, updateUserAvailability, setAllUser, clearAllUsers} from '../functions/users'

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

  type UsersType = UserType[]

  const Users:UsersType = []

  const usersSlice = createSlice({
    name: "usersReducer",
    initialState: Users,
    reducers: {
      addNewUser,
      removeUser,
      updateUser,
      toggleCamera,
      setUserAudioStream,
      setUserStream,
      setUserVideoStream,
      toggleScreenSharing,
      toggleMicrophone,
      setUserLoading,
      updateUserAvailability,
      setAllUser,clearAllUsers
    },
  });

  export type {UserType,UsersType}
  
  export const { 
    addNewUser: addNewUserAction,
    removeUser: removeUserAction,
    updateUser: updateUserAction,
    toggleCamera: toggleCameraAction,
    setUserAudioStream: setUserAudioStreamAction,
    setUserStream: setUserStreamAction,
    setUserVideoStream: setUserVideoStreamAction,
    toggleScreenSharing: toggleScreenSharingAction,
    toggleMicrophone: toggleMicrophoneAction,
    setUserLoading: setUserLoadingAction,
    updateUserAvailability: updateUserAvailabilityAction,
    setAllUser:setAllUserActions,
    clearAllUsers:clearAllUsersActions
  } = usersSlice.actions;

  export default {
    usersReducer: usersSlice.reducer,
  };
