import { createSlice,current } from "@reduxjs/toolkit";
import {addNewUser,removeUser,updateUser} from '../functions/users'

type ChatType = {
    id: string,
    name:string,
    //type:'incoming'|'outgoing',
    isOutgoing:boolean,
    timeStamp:string,
    msg:string
  };

type Chats = Array<ChatType> 

const chats:Chats = []

const initialChatsLoadState:Chats = [
    {
        id:'abcde',
        name:'Arun',
        //type:'incoming',
        isOutgoing:true,
        timeStamp:'25 sept 2025',
        msg:'howdy'
    },
    {
      id:'abcde',
      name:'Arun',
      //type:'incoming',
      isOutgoing:false,
      timeStamp:'25 sept 2025',
      msg:'howdy'
  },
    {
      id:'abcde',
      name:'Arun',
      //type:'incoming',
      isOutgoing:true,
      timeStamp:'25 sept 2025',
      msg:'howdy'
  },
  {
    id:'abcde',
    name:'Arun',
    //type:'incoming',
    isOutgoing:false,
    timeStamp:'25 sept 2025',
    msg:'howdy'
  },
  {
    id:'abcde',
    name:'Arun',
    //type:'incoming',
    isOutgoing:true,
    timeStamp:'25 sept 2025',
    msg:'howdy'
  },
  {
  id:'abcde',
  name:'Arun',
  //type:'incoming',
  isOutgoing:false,
  timeStamp:'25 sept 2025',
  msg:'howdy'
  },
  {
    id:'abcde',
    name:'Arun',
    //type:'incoming',
    isOutgoing:true,
    timeStamp:'25 sept 2025',
    msg:'howdy'
  },
  {
  id:'abcde',
  name:'Arun',
  //type:'incoming',
  isOutgoing:false,
  timeStamp:'25 sept 2025',
  msg:'howdy'
  }
] 


  const chatSlice = createSlice({
    name: "usersReducer",
    initialState: [],
    reducers: {
      addChat:(state,action)=>{
        console.log('add chat triggers',action.payload,current(state))
        return [...state,{...action.payload}]
      }
      
    },
  });

  //export type {}
  export const { addChat } = chatSlice.actions;

  export default {
    chatReducer: chatSlice.reducer,
  };