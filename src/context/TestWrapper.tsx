// this file will be used for testing & Replacement for DataWrapper in future 

import { useSelector } from "react-redux";
import useSocket from "../hooks/useSocket";
import React,{ createContext, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const TestWrapperContext = React.createContext('testWrapper')

export function useTestWrapper(){
    return useContext(TestWrapperContext)
}

export default function TestWrapper({children}){

    const socket1Url = ''
    const socket2Url = ''


    const [isSocket1_Connected,socket1_emitEvent,socket1_onEvent] = useSocket(socket1Url)
    const [isSocket2_Connected,socket2_emitEvent,socket2_onEvent] = useSocket(socket2Url)
    const [users,myState] = useSelector((state)=>[state.usersReducer,state.myState])
    

    // initialise to myState 
    useEffect(()=>{
    
        // initialising id

        //initialise videoStream 

        //initialise audioStream 

        
    },[])

    //define socket1 & socket2 onEvents here 
    useEffect(()=>{
        function myFunc(){
            return null
        }

        socket1_onEvent('',myFunc)
        socket2_onEvent('',myFunc)
    },[])
    

    
    

    let values =  {

    }

    return (
        //@ts-ignore
        <TestWrapperContext.Provider value={values}>
            {children}
        </TestWrapperContext.Provider>
    )
}