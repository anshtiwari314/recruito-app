import React, { useRef, useState,useEffect } from 'react'
import { useNavigate,useParams } from 'react-router-dom';
import './leavepage.css'
import { useData } from '../context/DataWrapper';

export default function Leave() {
  
  const [count,setCount] = useState(0)
 // const {link} = useParams()
  const [isUrlValid,setIsUrlValid] = useState(false);

  let renderFlag = useRef(0)
 

  useEffect(()=>{
  
    console.log('useEffect inside leave rendered')
    

  },[])

  useEffect(()=>{
    
    //@ts-ignore
    let params =new URL(window.location).searchParams;

    if(!params.get('room_id') || !params.get('cust_id') || !params.get('mob')){
     //  
    }else{
      setIsUrlValid(true)
    } 
  },[])

  function rejoin(url:string){
    console.log('i am link',url)
    window.location.href = `${window.location.protocol}//${window.location.host}/meeting.html${url.split('leave.html')[1]}`
  }

  function returnToMainScreen(){
   // navigate('/#')
   window.location.href = `${window.location.protocol}//${window.location.host}/`
  }

  useEffect(()=>{
    if(count<30)
    return ;

    returnToMainScreen()
  },[count])

  useEffect(()=>{

    let intervalId= setInterval(()=>{
      
      setCount(prev=>prev+1)
    },1000)
    return ()=>clearInterval(intervalId)
  },[])

  return (
    <div className='leave'>
      <div className='box'>
          <p className='text'>U have Successfully Left</p>
          <div className='btn-wrapper'>
            {isUrlValid!=false?
            <button onClick={()=>rejoin(window.location.href)} className='btn'>Rejoin</button>:
            null
            }
            
            <button onClick={()=>returnToMainScreen()} className='btn'>Return to main screen {30-count}</button>
          </div>
      </div>
    </div>
  )
}
