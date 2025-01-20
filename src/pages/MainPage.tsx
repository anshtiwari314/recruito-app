import React,{useState,useEffect,useRef} from 'react'
import DisplayComp from '../components/DisplayComp'
import './mainpage.css'
import placeholderImg from './assets/placeholder.png'
import { useNavigate,useParams,useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataWrapper'
import {v4 as uuidv4} from 'uuid'
import DisplayLargerComp from '../components/DisplayLargerComp'
import DisplaySmallerComp from '../components/DisplaySmallerComp'
import MySmallerVideoComp from '../components/MySmallerVideoComp'
import MyLargerVideoComp from '../components/MyLargerVideoComp'
import Msg from '../components/Msg'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import NewUi from '../components/NewUi'

//@ts-ignore
export function Tray({openSideWindow,setOpenSideWindow,messagingOn,setMessagingOn,isMobile,toggleRmWindow,setToggleRmWindow,link}){
  // const [cameraToggle,setCameraToggle ] = useState(true)
  // const [microphoneToggle,setMicroPhoneToggle] = useState(true)
  //@ts-ignore
  const {users,cameraToggle,setCameraToggle ,microphoneToggle,setMicroPhoneToggle,screenSharing,setScreenSharing,isHost,stopVideoRecording} = useData()
  const [time,setTime] = useState('')
  //const navigate = useNavigate()
  // const [] = useState()
  
  function handleLeave(e:{e:any}){
    //navigate('/leave')
  }
  let styling:any = {
    tray:{
      position:"absolute",

      //border:"0.2rem solid blue",
      transform:"translate(-50%)",
      left:"50%",
      bottom:"1%",
    },
    trayWrapper:{
      width:isMobile===false?"50vw":"99vw",
      height:isMobile===false?"6rem":"8rem",
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-equally"
    },
    iconHolderDiv:{
      display:"flex",
      justifyContent:"space-around",
      alignItems:"center",
      width:"100%",
      backgroundColor:"gray",
      margin:"0 0.1rem",
      fontSize:"2.5rem",
      padding:"0.5rem 0.2rem",
     
      // justifyContent:"center",
      // alignItems:"center"
    },
    icon:{
      color:"white",
      fontSize:isMobile===false?"3rem":"3.5rem",
      margin:"0 1.2rem",
      cursor:'pointer'
    },
    iconRed:{
      color:"white",
      fontSize:"4rem"
    }
  }

  //@ts-ignore
  function timer(hour,min,sec,d){
    let date2= new Date()
    var diff = date2.getTime() - d.getTime();

    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    if(hh<=0) 
    setTime(`${mm}:${ss}`)
    else 
    setTime(`${hh}:${mm}:${ss}`)
}

  useEffect(()=>{
    let d = new Date()
    let intervalId :any;
    intervalId = setInterval(()=>{
        timer(d.getHours(),d.getMinutes(),d.getSeconds(),d)
    },1000)
    return ()=>{
      clearInterval(intervalId)
    }
  },[])

  return(
    <div style={styling.tray}>
      <div style={styling.trayWrapper}>
        <div style={styling.iconHolderDiv}>{time}</div>
        {isHost===true?
          <div style={styling.iconHolderDiv}>
            <i 
              style={{...styling.icon,display:`${toggleRmWindow===true?"":"none"}`}} 
              className="fa-solid fa-table-cells-large icons" 
              id="layoutIcon"
              onClick={()=>setToggleRmWindow(false)}
            ></i>
            <i 
              style={{...styling.icon,display:`${toggleRmWindow===false?"":"none"}`}} 
              className="fa-solid fa-comment icons"  
              id="commentIcon"  
              onClick={()=>setToggleRmWindow(true)}
            ></i>
        </div>
        :
        null
        }
        
        <div style={styling.iconHolderDiv}>
            <i 
              style={{...styling.icon,display:`${users[0]?.isCameraAvailable && cameraToggle===true?"":"none"}`}} 
              className="fa-solid fa-video icons" 
              id="vidIcon"
              onClick={()=>{setCameraToggle(false);}}
            ></i>
            <i 
              style={{...styling.icon,display:`${users[0]?.isCameraAvailable && cameraToggle===false?"":"none"}`}} 
              className="fa-solid fa-video-slash icons" 
              id="crossVidIcon" 
              onClick={()=>{setCameraToggle(true);}}
            ></i>
                  
            <i 
              style={{...styling.icon,display:`${users[0]?.isMicrophoneAvailable && microphoneToggle===true?"":"none"}`}} 
              className="fa-solid fa-microphone icons" 
              id="micIcon" 
              onClick={()=>{setMicroPhoneToggle(false);}}
              ></i>
            <i 
              style={{...styling.icon,display:`${users[0]?.isMicrophoneAvailable && microphoneToggle===false?"":"none"}`}} 
              className="fa-solid fa-microphone-slash icons" 
              id="crossMicIcon" 
              onClick={()=>{setMicroPhoneToggle(true);}}
              ></i>
        </div>
        <div style={styling.iconHolderDiv}>
          <i 
            style={{...styling.icon,display:""}} 
            className="fa-solid fa-message icons" 
            id="msgIcon"
            onClick={()=>{setMessagingOn(true);setOpenSideWindow(true);}}
          ></i>
          <i 
            style={{...styling.icon,display:""}} 
            className="fa-solid fa-users icons" 
            id="usersIcon"
            onClick={()=>{setMessagingOn(false);setOpenSideWindow(true);}}
          ></i>
        </div>
        {isMobile===false ?
        <div style={styling.iconHolderDiv}>
          <i 
            style={{...styling.icon,color:"white",display:`${screenSharing===false?"":"none"}`}} 
            className="fa-solid fa-display icons"
            id="screen-sharing"
            onClick={()=>{setScreenSharing(true)}}
          ></i>
          <i 
            style={{...styling.icon,color:"red",display:`${screenSharing===true?"":"none"}`}} 
            className="fa-brands fa-chromecast" 
            id="screen-sharing"
            onClick={()=>{setScreenSharing(false)}}
          ></i>
        </div>
        :
        null  
        }
        
        <div style={{...styling.iconHolderDiv,backgroundColor:"red"}}>
        
          <span >
              <i 
                style={{...styling.icon,...styling.iconRed,display:""}} 
                className="fa-solid fa-xmark icons" 
                id="crossIcon"
                //onClick={handleLeave}
                
               onClick={()=>{
                
                //console.log(`${window.location.protocol})
                //console.log(`${window.location.protocol}//${window.location.host}/leave.html${window.location.href.split('meeting.html')[1]}`)
                
                //stopVideoRecording();
                window.location.href=`${window.location.protocol}//${window.location.host}/leave.html${window.location.href.split('meeting.html')[1]}`

              }}
              ></i>
          </span> 
        </div>
      </div>
    </div>
  )
}
//@ts-ignore
export function SideWindow({openSideWindow,setOpenSideWindow,messagingOn,setMessagingOn,isMobile}){
  //let [messagingOn,setMessagingOn] = useState<boolean>(false);
  //@ts-ignore
  const ref= useRef<any>(null)
  //@ts-ignore
  const {msg,setMsg,myId,name,msgArrRef,users,socket,largeVideo,setLargeVideo} =  useData()
  const [message,setMessage] = useState('')
  const msgRef = useRef('')

  useEffect(()=>{
    if(ref.current===null)
    return; 
   // console.log("refffing",ref)
    function onPressEnter(e:any){
      console.log("keypressed")
      if(e.key==='Enter'){
        e.preventDefault()
        handleMessage()
      }
    }
    ref.current?.addEventListener('keypress',onPressEnter)
    return ()=> ref.current?.removeEventListener('keypress',onPressEnter)
  })

  function handleMessage(){
    if(socket===null || msgRef.current==='')
    return ;
    //console.log("handle message clicked",socket,socket.connected)
    //send this message to other users
    let tempMsgObj = {
      id:myId,
      msg:msgRef.current,
      name:name
    } 

    msgArrRef.current.push(tempMsgObj)
    //@ts-ignore
    setMsg(prev=>[...msgArrRef.current])

    msgRef.current = ''
    setMessage('')

    //send this message to other users 
    socket.emit('send-msg',msgArrRef.current[msgArrRef.current.length-1])
  }

  let styling:any ={
    sideWindow:{
      position:"absolute",
      right:isMobile===false ?(openSideWindow===true?"0":"-20vw"):(openSideWindow===true?"0":"-100vw"),
      top:"0",
      //border:"0.1rem solid blue",
      zIndex:"2",

    },
    sideWindowWrapper:{
      width:isMobile===false?"20vw":"100vw",
      height:"100vh",
      backgroundColor:"gray",
      // border:"0.2rem solid blue",

    },
    firstRow:{
      display:"flex",
      justifyContent:"flex-end",
      height:"4rem",
      // border:"0.1rem solid red"
    },
    crossButton:{
      // width:"2rem",
      // height:"1rem",
      //height:"2rem",
      marginRight:"2rem",
      padding:"2rem 2.2rem",
      fontSize:"2rem",
      display:"flex",
      justifyContent:"center",
      alignItems:"center"
    },
    secondRow:{
      
      display:"flex",
      margin:"0 1rem",
      flexWrap:"wrap",
      alignItems:"center",
      justifyContent:"space-around"
    },
    button:{
      margin:"0.5rem 0",
      padding:"1rem 1.5rem",
      fontSize:"2rem",
      borderRadius:"0.2rem",
      outline:"none",
      border:"none",
    },
    subSideWindow:{
      margin:"2rem 0",
      height:"80%",
      border:"0.5rem solid blue",
    },
    usersWindow:{
      overflowY:"scroll",
      scrollBehaviour:"smooth"
    },
    user:{
      margin:"0.8rem 1rem",
      boxSizing:"border-box",
      display:"flex",
      alignItems:"center",
      justifyContent:"space-around",
      fontSize:"1.8rem",
      width:isMobile===false?"80%":"50%",
      padding:"0rem 0",
      // border:"0.1rem solid red",
    },
    msgWindow:{
      height:"90%",
      border:"0.1rem solid violet",
      overflowY:"scroll",
      scrollBehaviour:"smooth"
    },
    inputWrapper:{
      height:"5rem",
      display:"flex",
      alignItems:"center",
      backgroundColor:"white",
      padding:"0.5rem 0"
    },
    inputBar:{
      height:"100%",
      width:"80%",
      paddingLeft:"1rem",
      outline:"none",
      border:"none"
    },
    sendBtn:{
      width:"20%",
      margin:"0",
      padding:"0",
      height:"4rem",
      // margin:"0.5rem 0",
      // padding:"1rem 1.5rem",
      fontSize:"2rem",
      borderRadius:"1rem",
      outline:"none",
      border:"none",
      backgroundColor:"blue",
      color:"white",
      
    },
    msg:{
     // border:"0.1rem solid white",
      display:"flex",
      flexDirection:"column",
      margin:"0.5rem 0"
      // alignItems:"end"
    },
    msgWrapper:{
      width:"fit-content",
     // border:"0.1rem solid red",
      padding:"0 1rem"
    },
    incomingWrapper:{
      alignSelf:"start",
    },
    outgoingWrapper:{
      alignSelf:"end",
      textAlign:"right",
      
    },
    name:{

      letterSpacing:"0.1rem",
      textTransform:"capitalize",
      // border:"0.1rem solid red"

    },
    incoming:{
      padding:"1rem",
      backgroundColor:"silver",
      width:"fit-content",
      borderRadius:"0.5rem"
    },
    outgoing:{
      padding:"1rem",
      backgroundColor:"silver",
      width:"fit-content",
      borderRadius:"0.5rem"
    }
  }
  return ( 
      <div style={styling.sideWindow} className='side-window'>
        <div style={styling.sideWindowWrapper} className='side-window-wrapper'>
          <div style={styling.firstRow} className='first-row'>
              <button style={styling.crossButton} onClick={()=>setOpenSideWindow(false)}>
                    <i 
                    style={{...styling.icon,...styling.iconRed,fontSize:"3rem"}} 
                    className="fa-solid fa-xmark icons" 
                    //onClick={handleLeave}
                  ></i>
              </button>
          </div>
          <br/>
          <br/>
          <div style={styling.secondRow} className='second-row'>
              <span >users</span>
              <button onClick={()=>setMessagingOn(true)}>message</button>
              <button onClick={()=>setMessagingOn(false)}>users</button>
          </div>
          {messagingOn===false?
          <div 
            style={{...styling.usersWindow}} className='sub-side-window users-window' >

              {users.map((e:any,i:number)=>{
                return <div className='user' key={i}>
                <div className='childA'>
                  <div className='circle'>
                    <p className='text'>{e?.name?.substring(0,2).toUpperCase()}</p>
                  </div>
                </div>
                <div className='childB'>
                  <p className='name'>{e?.name}</p>
                  {e.isAdmin===true ? 
                  <p className='host'>meeting host</p>:
                  null
                  }
                  
                </div>
                <div className='childC' >
                  {e.id ===largeVideo?.id ?  
                  // <span className="material-symbols-outlined" style={{cursor:"pointer"}}>
                  // push_pin
                  // </span>
                  <PushPinIcon style={{cursor:"pointer",fontSize:"2.5rem"}}/>
                  :
                  //fa-light fa-thumbtack pin
                  // <i className="material-symbols-outlined material-symbols-filled" 
                  // onClick={()=>setLargeVideo(e)}>
                  // </i>
                  // <span className="material-symbols-rounded"  >
                  // push_pin
                  // </span>
                  <PushPinOutlinedIcon onClick={()=>setLargeVideo(e)} style={{cursor:"pointer",fontSize:"2.5rem"}}/>
                }
                  
                </div>
            </div>
              })}
            
              
          </div>
          :
          <div className='sub-side-window'>
              <div className='msgWindow'>
                  {
                  msg.map((e:any,i:number)=>{
                   // console.log("msg map",e)
                    if(e.id===myId)
                    return  <div key={i} className='chat-msg'>
                      <div className='msgWrapper outgoingWrapper'>
                        <p  className='name' 
                          style={{
                          width:"100%",
                          textAlign:"right",
                          }} >you</p>
                        <p className='outgoing'>{e.msg}</p>
                      </div>
                    </div>
                    
                    else
                    return <div key={i} className='chat-msg'> 
                            <div className='msgWrapper incomingWrapper' >
                              <p className='name' style={{width:"fit-content"}} >
                                {e.name}
                              </p>
                              <p className='incoming'>{e.msg}</p>
                            </div>
                          </div>
                  }) 
                  }
                 

                  
                  {/* <p>hi</p>
                  <p>hi</p>
                  <p>hi</p>
                  <p>hi</p> */}
              </div>
              <div className='input-wrapper'>
                <input 
                  
                  style={styling.inputBar} 
                  placeholder='write your message'
                  value={message}
                  onChange={(e)=>{msgRef.current=e.target.value;setMessage(e.target.value)}}
                  ref={ref}
                />
                <button className='send-btn' onClick={()=>handleMessage()}>
                 <i className="fa-solid fa-share"></i>
                </button>
              </div>
          </div>
        }
        </div>
      </div>
    )
}

export function VideoLayout({openSideWindow,isMobile,toggleRmWindow}
  :{openSideWindow:boolean , isMobile:boolean,toggleRmWindow:boolean}){
  
  const [selectedNumber,setSelectedNumber] = useState<number|null>(null)
  //@ts-ignore
  const {users,usersArrRef,largeVideo,setLargeVideo,largeVideoRef,} = useData()
   
  let number = 3;
  //@ts-ignore
 
  let styling:any ={
      gridView:{
        width:"49vw",
        height:number>2?"50vh":"100vh",
        // border:"0.1rem solid red"
      },
      scaledView:{
        flex1:{
          width:isMobile===false?"80%":"100%",
          // border:"0.1rem solid red",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          height:isMobile===false?"":"90%",
        },
        flex2:{
          display:"flex",
          flexDirection:isMobile===false?"column":"row",
          width:isMobile===false?"20%":"100vw",
          height:isMobile ===false?"100%":"fit-content",
         // border:"0.1rem solid green",
          overflowX:isMobile===false?"hidden":"scroll",
          overflowY:isMobile===false?'scroll':"hidden",
          background:isMobile ===false?"gray":"",
          
        },
        videoWrapper:{
          // height:"100%",
          
          // width:"100%":"25rem",
          // width:"100%",
         // border:"0.1rem solid red",
         
         
          margin:"1rem 0",
          // backgroundColor:"gray"

          // backgroundColor:"aqua",
          // width:isMobile===false?"100%":"25rem",
          // position:"absolute",

        },
        flex1Video:{
          height:"90%",
          width:"70%",
          objectFit:"cover",
          
        },
        flex2Video:{
          height:"10rem",
          width:"100%"
        }
      }
  }

  useEffect(()=>{
    //console.log("i am users length",users.length,users)
    if(users.length===0)
    return ;
    
    //  console.log("i am users length 2",users.length)
    if(users.length===1 && largeVideoRef.current !==users[0]){
     // console.log("i am users inside",users.length)
      largeVideoRef.current = users[0]
      setLargeVideo(largeVideoRef.current)
    }
    //&& largeVideoRef.current !==users[1]
    else if(users.length>1 && selectedNumber ===null ){
      largeVideoRef.current = users[users.length-1]
      setLargeVideo(largeVideoRef.current) 
    }
    else if(users.length>1 && selectedNumber !==null && selectedNumber > usersArrRef.current.length-1){
      //if user left
      largeVideoRef.current = usersArrRef.current[usersArrRef.current.length-1]
      setLargeVideo(largeVideoRef.current)
    }
    else if(users.length>1 && selectedNumber !==null && largeVideoRef.current !==users[selectedNumber]){
      largeVideoRef.current = users[selectedNumber]
      setLargeVideo(users[selectedNumber])
    }

  },[users,selectedNumber])
  
  useEffect(()=>{
   //console.log("users changed in mainPage")
  },[users])

  useEffect(()=>{
    console.log("isMobile",isMobile)
  },[isMobile])
  
  function screenSize(){
    // console.log("window size",window.screen.height,window.screen.availHeight)
    // console.log("window height",window.screen.width,window.screen.availWidth)
    // let isMobile = false ;
    // let openWindow = true 
    // console.log(isMobile?(openWindow ?"a":"b"):(openWindow?"c":"d"))

  }
  

  return (

    <> 
    <div className='left-window' style={{
      display:"flex",
      flexDirection:isMobile===false?"row":"column",
      height:"90vh",
      zIndex:0,
      width:isMobile===false ?(openSideWindow===true?"78vw":"98vw"):("100vw")

      }}>

      <div style={styling.scaledView.flex1} className='large-video-holder'>
          {/* @ts-ignore */}
          {/* {largeVideo && <DisplayComp e={largeVideo} muted={true} large={true} num={4193}/>} */}
          {/* @ts-ignore */}
          {toggleRmWindow===true ? 
            // <RmLayout/>
            <NewUi isMobile={isMobile}/>
          : 
          //@ts-ignore
          largeVideo && <MyLargerVideoComp e={largeVideo} muted={true} large={true} num={4193} isMobile={isMobile}/>
          }
          {/* {largeVideo && <DisplayLargerComp e={largeVideo} muted={true} large={true} num={4193} isMobile={isMobile}/>} */}
      </div>

      <div style={styling.scaledView.flex2} className='smaller-video-holder'> 
      {/* {users.length>0 && console.log("loggin before render",users)} */}
        { users.map((e:any,i:number)=>{ 
         // console.log('triggered',e.id)
          const randomValue = Math.random() 
          if(e.remove===true){  
            return null 
          }
          // if(i==0){
          //   return <div style={styling.scaledView.videoWrapper} key={i*randomValue}>
          //     <MySmallerVideoComp
          //     e={e} 
          //     muted={true}  
          //     num={i} 
          //     large={false} 
          //     //@ts-ignore
          //     isMobile={isMobile}
          //     setSelectedNumber={setSelectedNumber}
          //     />
          // </div>
          // }else{
          //   return <div style={styling.scaledView.videoWrapper} key={i*randomValue}>
          //     <MySmallerVideoComp
          //     e={e} 
          //     muted={e.microphoneStatus===true?false:true}  
          //     num={i} 
          //     large={false} 
          //     //@ts-ignore
          //     isMobile={isMobile}
          //     setSelectedNumber={setSelectedNumber}  
          //     />
          // </div>
         
          // }

          return <div style={styling.scaledView.videoWrapper} key={i*randomValue}>
          <MySmallerVideoComp
          e={e} 
          //muted={e.microphoneStatus===true?false:true}  
          //muted = {false}
          num={i} 
          large={false} 
          //@ts-ignore
          isMobile={isMobile}
          setSelectedNumber={setSelectedNumber}  
          />
          </div>
        })}
        
        
       
      </div>
        

    </div>
    
    </>
  )
}
export function RmLayout(){
  //@ts-ignore
  const {cues,cueLoading} = useData()
return (
  <div className='msg-box' style={{border:'0.1rem solid red'}}>
                {/* {data && data.map((e:any,i:number)=>{
                    console.log(e)
                    if(e.type ==="TextMsg")
                        return <AddTextMsg data={e} key={i}/>
                    else if(e.type === "SuggestiveMsg")
                        return <AddOnlySuggestiveMsg data={e} key={i}/>
                    else if(e.type === "ImageMsg")
                        return <AddImageMsg data={e} key={i}/>
                    else if(e.type === "InputForm")
                        return <AddInputForm data={e} key={i}/>
                    else if(e.type === "RadioForm")
                        return <AddRadioForm data={e} key={i}/>;
                })} */}
            

            { 
            cueLoading==true ?
            <div className='msg-loader-wrapper'>
                <img src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif" className='msg-loader'/>
            </div>
             :
            null
            }
            {cues && cues.map((e:any,i:number)=>{
                return <Msg e={e} key={e.id}/>
            })}
            {/* <Msg e={Data} /> */}
  </div>
)
}

export default function MainPage() {
  const [openSideWindow,setOpenSideWindow] = useState<boolean>(false);
  const [messagingOn,setMessagingOn] = useState<boolean>(true);
  
  
  //@ts-ignore
  const {setRoomId,users,myStream,setMob,roomId,setIsHost,setMyId,isHostRef,normalize,setName,setValidUrl,setCustId,adminUrl, setAdminUrl,videoUploadUrl,setVideoUploadUrl} = useData()
   const {link} = useParams()
  // const [searchParams,setSearchParams] = useSearchParams()
  // const navigate = useNavigate()
   const [toggleVideo,setToggleVideo] = useState(true)
   const [toggleAudio,setToggleAudio] = useState(true)
   const [isMobile,setIsMobile] = useState(false);
   const [toggleRmWindow,setToggleRmWindow] = useState(false);
  

   function diff_minutes(time2:number, time1:number) {

    var diff =(time2-time1) / 1000;
    let diff_in_min = diff/ 60;
    //let diff_in_hours = diff_in_min / 60;
    return Math.abs(Math.round(diff_in_min));
}

  useEffect(()=>{

    //getting name 
    let myName:string = ''
    if(sessionStorage.getItem('userName') !== null){
      setName(sessionStorage.getItem('userName'))
  }else{
     
      while(myName.length<2){
        //@ts-ignore
      myName = prompt("Please enter your name")

      if(myName.length<2)
          alert('Name must have 2 letters long')
      }
      setName(myName)
      sessionStorage.setItem('userName',myName)
  }
  },[])

  useEffect(()=>{
  function Resizing(){
    //console.log("window width",window.screen.width)
    if(window.screen.width<800)
    setIsMobile(true)
    else
    setIsMobile(false)
  }
    Resizing()
    window.onresize = Resizing
 // if(window.screen.width<600)
    
  },[])

  useEffect(()=>{
    //if(!link)
    //navigate('/#')

   // console.log('i am link',link)

   //@ts-ignore
    let params = new URL(window.location).searchParams;
   
   console.log('params',params.get('room_id')) 
  if(!params.get('room_id') || !params.get('cust_id') || !params.get('mob')){
   // navigate(`/#`)
   //window.location.href=`${window.location.href}`

   console.log('redirecting to homepage',`${window.location.host}`)
   window.location.href = `${window.location.protocol}//${window.location.host}` 
  }
  else{
    // console.log(link)
    //console.log(link,params.get('room_id'),params.get('cust_id'),params.get('mob') )
    setRoomId(params.get('room_id'))
    setMob(params.get('mob'))
  }
  
  },[])

  useEffect(()=>{
  if(roomId ==='')
  return ;
  
 //@ts-ignore
 let params = new URL(window.location).searchParams;
  //params.get('cust_id')
  let tempId =params.get('cust_id')
  let tempIsHost = false
  

  if(!localStorage.getItem('created_by_admin')){
    //console.log('u r a general user')
    // setMyId()
    //setIsHost(false)
    //@ts-ignore

    //tempId = uuidv4()
    
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
  //console.log(tempId,tempIsHost)

  isHostRef.current = tempIsHost
  setIsHost(tempIsHost)
  
  setMyId(tempId)
 // setValidUrl('namma')
  console.log("cust_id",tempId)
  setCustId(params.get('cust_id'))

  },[roomId])

  return (
  <div>
     {/* <input 
      placeholder='please enter your ngrok url' 
      onChange={(e)=>setVideoUploadUrl(e.target.value)}
      value={videoUploadUrl}
      style={{
        padding:'1rem',
        width:'80%'
        
      }}
      />  */}
      
    <div style={{
      overflow:"hidden",
      width:"100vw",
      height:"100vh",
      position:"relative",
      backgroundColor:'#636363',
      //border:"0.3rem solid tomato",

      }}>
        <div style={{margin:'0 auto',width:'fit-content'}}>
        <input type = "text" value={adminUrl} onChange={(e)=>setAdminUrl(e.target.value)} placeholder="enter an ngrok url" style={{padding:'1rem 3rem',width:'50vw',borderRadius:'0.5rem'}}/>
        </div>
    
    <VideoLayout 
      openSideWindow={openSideWindow} 
      isMobile={isMobile} 
      toggleRmWindow={toggleRmWindow} 
     
      />
    <SideWindow 
      openSideWindow={openSideWindow} 
      setOpenSideWindow={setOpenSideWindow}
      messagingOn={messagingOn}
      setMessagingOn={setMessagingOn}
      isMobile={isMobile}
      
    />
    <Tray 
    openSideWindow={openSideWindow} 
    setOpenSideWindow={setOpenSideWindow}
    messagingOn={messagingOn}
    setMessagingOn={setMessagingOn}
    isMobile={isMobile}
    toggleRmWindow={toggleRmWindow}
    setToggleRmWindow={setToggleRmWindow}
    link={link}
    />
    
    </div>
  </div>
  )
}
