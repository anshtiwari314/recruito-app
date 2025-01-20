import React, { useEffect, useState } from 'react'
import { useData } from './context/DataWrapper'
import {useParams,useSearchParams,useNavigate} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import Video from './Video'
import Audio from './components/Audio'
import DisplayComp from './components/DisplayComp';
import DisplayComp2 from './components/DisplayComp2';

export default function Page1() {
    //@ts-ignore
   const {setRoomId,users,myStream,setMob,roomId,setIsHost,setMyId,isHostRef} = useData()
   const {link} = useParams()
   const [searchParams,setSearchParams] = useSearchParams()
   const navigate = useNavigate()
   const [toggleVideo,setToggleVideo] = useState(true)
   const [toggleAudio,setToggleAudio] = useState(true)
   
   function diff_minutes(time2:number, time1:number) {

    var diff =(time2-time1) / 1000;
    let diff_in_min = diff/ 60;
    //let diff_in_hours = diff_in_min / 60;
    return Math.abs(Math.round(diff_in_min));
}

   useEffect(()=>{
     if(!link)
     navigate('/#')

     let params = new URLSearchParams(link)
    
    //cust id 
    //room id 
    //mob 
    if(!params.get('room_id') || !params.get('cust_id') || !params.get('mob')){
      navigate(`/#`)
    }
    else{
      console.log(link)
      
      console.log(link,params.get('room_id'),params.get('cust_id'),params.get('mob') )
      setRoomId(params.get('room_id'))
      setMob(params.get('mob'))
    }
    
   },[link])

   useEffect(()=>{
    if(!link || roomId ==='')
    return ;

    let params = new URLSearchParams(link)
//params.get('cust_id')
    let tempId =params.get('cust_id');
    let tempIsHost = false 
    
    if(!localStorage.getItem('created_by_admin')){
      console.log('u r a general user')
      // setMyId()
      //setIsHost(false)
      // tempId = params.get('cust_id')
      // tempIsHost = false
    }else{
      try{
          let storedArr = localStorage.getItem('created_by_admin')
          //@ts-ignore
          let arr = JSON.parse(storedArr)

          let d = new Date()

          arr=arr.filter((e:any,index:number)=>{
          
              if(e.id === roomId){
                //setMyId(uuidv4())
                //setIsHost(false)
                console.log('admin u r admin')
                tempId = uuidv4()
                tempIsHost = true
              }
                    

              if(diff_minutes(d.getTime() ,e.time)<480)
                  return true ;
              return false;
            })
        localStorage.setItem('created_by_admin',JSON.stringify(arr))
    }
    catch(e){
      console.log('error in try block',e)
      //localStorage.removeItem('created_by_admin')
     //setTimeout(()=>window.location.href='/',3000)
      }
    }
    console.log(tempId,tempIsHost)

    isHostRef.current = tempIsHost
    setIsHost(tempIsHost)
    setMyId(tempId)
   
   },[link,roomId])

   useEffect(()=>{
     

   },[])

   useEffect(()=>{
    console.log(users)
   },[users])

  //  useEffect(()=>{
  //    if(myStream ===null)
  //    return;
  //    if(toggleVideo===true)
  //     myStream.getVideoTracks()[0].enabled = true
  //     else myStream.getVideoTracks()[0].enabled = false
    
  //  },[myStream,toggleVideo])

  //  useEffect(()=>{
  //   if(myStream ===null)
  //   return;
  //   if(toggleAudio===true)
  //    myStream.getAudioTracks()[0].enabled = true
  //    else myStream.getAudioTracks()[0].enabled = false
   
  // },[myStream,toggleAudio])

  useEffect(()=>{

  },[])

  return (
    <>
    <div className="video-wrapper">
    {users.map((e:any,i:number)=>{
      
        // if(e.isAudioStream===true && i===0){
         
        //   return<span key={i}>
        //           <Audio e={e} muted={true} />
        //         </span>
        // }
        // else if(e.isAudioStream===true){
          
        //   return<span key={i}>
        //             <Audio e={e} muted={false} />
        //         </span>
        // }
        // else if(e.isAudioStream ===false && i===0){
        //   return<span key={i}>
        //             <Video e={e} muted={true} />
        //         </span>
        // }else if(e.isAudioStream === false ){
        //   return  <span key={i}>
        //             <Video e={e} muted={false} />
        //           </span>
        // }

        //if()
        if(e.remove===true){
          return null
        }
        if(i==0){
          return <span key={i}>
            {/* <DisplayComp e={e} muted={true} /> */}
          </span>
        }else{
          return <span key={i}>
            {/* <DisplayComp e={e} muted={false} /> */}
          </span>
        }
        // return <span key={i}> 
        // {
        //   i===0 ? 
        //   <DisplayComp2 e={e} muted={true} /> : 
        //   <DisplayComp2 e={e} muted={false}/> 
        // }
        //</span>
    })}
    
    </div>
    <button onClick={()=>setToggleVideo(prev=>!prev)}>toggle video</button>
    <button onClick={()=>setToggleAudio(prev=>!prev)}>toggle audio</button>

    {/* <ReactInternetSpeedMeter  
            txtSubHeading="Internet is too slow"
            outputType="alert"
            customClassName={null}
            txtMainHeading="Opps..." 
            pingInterval={5000} // milliseconds 
            thresholdUnit='kilobyte' // "byte" , "kilobyte", "megabyte" 
            threshold={500}
            imageUrl="https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=600"
            downloadSize="19293"  //bytes
            callbackFunctionOnNetworkDown={(speed)=>console.log(`Internet speed is down ${speed}`)}
            callbackFunctionOnNetworkTest={(speed)=>console.log(speed)}
          /> */}
    </>
  )
}
