import React,{useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone,faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'

export function TextPlaceHolder({e,large}:{e:any,large:boolean}){
    let styling ={
      container:{
        width:'100%',
        height:'100%',
       // border:'0.1rem solid red',
        position:'absolute',
        backgroundColor:'#7a7979',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
      } , 
      textWrapper:{
        
        zIndex:'5',
        width:"7rem",
        height:"7rem",
       // margin:"4rem auto",
        // border:"0.1rem solid blue",
        //backgroundColor:"white",
        // padding:"2rem"
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        // margin:"0 auto",
        borderRadius:"3.5rem",
        backgroundColor:"violet",
      },
      text:{
        fontSize:"2rem",
        width:"fit-content",
        color:"white"
      }
    }
    useEffect(()=>{
      //console.log("textPlaceHolder",e,large)
    },[])

    return (
    <div style={styling.container}>
      <div style={styling.textWrapper} >
            <p style={styling.text}>{e?.name?.substring(0,2).toUpperCase()}</p>  
      </div>
    </div>
    )
}

export function Display({e,muted,isMobile}){

    let vidRef = useRef<any>(null)

    let videoId = e.id

    //let isMobile = false
    
    let num = 0

    let styling:any ={
      
        scaledView:{
          flex2Video:{
            //border:'0.1rem solid red',
            height:isMobile===false?"100%":"15rem",
            width:isMobile===false?"100%":"20rem",
            objectFit:"cover",
            zIndex:"2"
          }
        }
    }
   // console.log("display",e)
    useEffect(()=>{
       // console.log("display",e.isLoading, e.isAudioStream, e.cameraStatus)
       let vid = vidRef.current
   // console.log("display1 ",e.videoStream , e.audioStream, e.isLoading, vid)
    if(e.videoStream===null || e.isLoading===null || vid===null)
    return ;

    
    console.log("display 2",e.videoStream,vid)

    if(e.isCameraAvailable===true)
    vid.srcObject = e.videoStream

    function onLoaded(){
        vid.play()
    }

    vid.addEventListener('loadedmetadata',onLoaded)

      
    },[e.videoStream])

    useEffect(()=>{
    //console.log("display audio",e.audioStream,muted)
        if(!e.audioStream)
        return ;
   // console.log("display audio",e.audioStream,muted)
        let audio:any =null
        audio = new Audio();

        if(e.isMicrophoneAvailable===true)
        audio.srcObject = e.audioStream;
        
        audio.muted = muted
        audio.addEventListener("canplaythrough", (event) => {
          /* the audio is now playable; play it if permissions allow */
          audio.play()
        });
        
    },[e.audioStream,muted])

        return (
        <div style={{width:'100%',height:'100%',position:'relative'}}>
        {e.isLoading===true || e.cameraStatus===false || e.isCameraAvailable ===false ?<TextPlaceHolder large={false} e={e}/>:null}
        {/* <TextPlaceHolder large={false} e={e}/> */}
        
        <video ref={vidRef} key={num*3133} style={styling.scaledView.flex2Video} />
        
        {e.microphoneStatus && e.isMicrophoneAvailable?<FontAwesomeIcon icon={faMicrophone} style={{fontSize:'2rem',color:'white',position:'absolute',left:'1rem',bottom:'0.5rem'}}/>:
        <FontAwesomeIcon icon={faMicrophoneSlash} style={{fontSize:'2rem',color:'white',position:'absolute',left:'1rem',bottom:'0.5rem'}}/>
        }
        
        </div>
        )
    
}

export default function MySmallerVideoComp({e,num,setSelectedNumber,isMobile}){
    function displayOnLargeScreen(){
        
      if(setSelectedNumber===null)
        return ;

      setSelectedNumber(num)
    }
    
    return (
    <div onClick={displayOnLargeScreen} 
        style={{
            height:isMobile===false?"20rem":"15rem",
            width:isMobile===false?"100%":"20rem",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
           // border:'0.1rem solid red'
            }}>
                
        {/* @ts-ignore */}
        <Display e={e} muted={num===0?true:!e.microphoneStatus} num={num} isMobile={isMobile}/>
        {/* <TextPlaceHolder large={large} setLargeVideo={setLargeVideo}/> */}
    </div>
    )
}