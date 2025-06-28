import { createSlice,current } from "@reduxjs/toolkit";
import {addNewUser,removeUser,updateUser} from '../functions/users'
import { v4 as uuidv4 } from "uuid";

type NotificationType = {
    id: string,
    //name:string,
    //type:'incoming'|'outgoing',
    type:'toast',
    color:'red'|'green'|'blue'
    header:string,
    desc:string,
    subHeading:string,
    timeOut:Number,
    x:Number|string,
    y:Number|string 
    timeStamp:string
  };

type logType = {
    log:string,
    timeStamp:string
}
type Notifications = {
    notifications : Array<NotificationType>
    logs:Array<logType>
} 

export const initialNotificationState = {
    id: '',
    //name:string,
    //type:'incoming'|'outgoing',
    type:'',
    color:'',
    header:'',
    desc:'',
    subHeading:'',
    timeOut:0,
    x:'',
    y:'' ,
    timeStamp:''
  };

const initialNotificationsState:Notifications = {
    logs : [],
    notifications:[]
}

const initialNotificationsLoadState:Notifications = {
    logs : [{log:'hello mr robot',timeStamp:''}],
    notifications:[{id:uuidv4(),type:'toast',color:'red',header:'something went wrong',timeOut:5,x:'5rem',y:'10rem'}]
}


  const notificationSlice = createSlice({
    name: "usersReducer",
    initialState: {...initialNotificationsLoadState},
    reducers: {
      addNotification:(state,action)=>{
        console.log('add notification triggers',action.payload)
        return state 
      },
      printLog:(state,action)=>{
        console.log('print log',action)
        return state 
      },
      printAllLogs:(state)=>{
        
        // [ '', data,]
        for(let i=0;i<state.logs.length;i++){
            console.log('print logs',state.logs[i])
        }
        return state 
      }
      
    },
  });

  //export type {}
  export const { addNotification } = notificationSlice.actions;

  export default {
    notificationReducer: notificationSlice.reducer,
  };