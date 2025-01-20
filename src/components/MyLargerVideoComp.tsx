import React,{useEffect,useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone,faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'

export function TextPlaceHolder({e}:{e:any}){
    let styling ={
      container:{
        width:'100%',
        height:'100%',
       // border:'0.1rem solid red',
        position:'absolute',
        backgroundColor:'#737272',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        zIndex:5
      } , 
        textWrapper:{
          width:"30rem",
          height:"30rem",
          // border:"0.1rem solid blue",
          //backgroundColor:"white",
          // padding:"2rem"
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          margin:"auto",
          borderRadius:"15rem",
          backgroundColor:"violet"
        },
        text:{
          fontSize:"4.5rem",
          width:"fit-content",
          color:"white"
        }
      }
   

    return (
      <div style={styling.container}>
      <div style={styling.textWrapper} >
            <p style={styling.text}>{e?.name?.substring(0,2).toUpperCase()}</p>  
      </div>
    </div>
    )
}

export function Display({e,isMobile}){

    let vidRef = useRef<any>(null)

    let videoId = e.id

    //let isMobile = false
    let muted = false
    let num = 0

    let styling:any ={
      
        scaledView:{
          flex2Video:{
            height:"100%",
            width:"99.9%",
            objectFit:"cover",
            position:isMobile===false?"":"absolute",
            zIndex:2
          }
        }
    }

    useEffect(()=>{
       // console.log("display",e.isLoading, e.isAudioStream, e.cameraStatus)
       let vid = vidRef.current
   // console.log("lerger display 1 ",e.videoStream , e.audioStream, e.isLoading, vid)
    if(e.videoStream===null || e.audioStream===null || e.isLoading===true || vid===null)
    return ;

    
   // console.log("larger display 2",e.videoStream,vid)

    if(e.isCameraAvailable===true)
    vid.srcObject = e.videoStream

    function onLoaded(){
        vid.play()
    }

    vid.addEventListener('loadedmetadata',onLoaded)

    },[e.videoStream,e.audioStream])

    // if(e.isLoading===false && e.cameraStatus===true){
    //     return <>
    //     <video ref={vidRef} id={videoId} key={num*3133} style={styling.scaledView.flex2Video} />
    //     </>
    // }
    // else {
    //   return <TextPlaceHolder large={false} e={e}/>
    // }

    return (
      <div style={{width:isMobile===false?"90%":"100vw",height:isMobile===false?'90%':"100%",position:'relative'}}>
      {e.isLoading===true || e.cameraStatus===false || e.isCameraAvailable ===false ?<TextPlaceHolder e={e}/>:null}
      {/* <TextPlaceHolder large={false} e={e}/> */}
      
      <video ref={vidRef} key={num*3133} style={styling.scaledView.flex2Video} />
      
      {e.microphoneStatus && e.isMicrophoneAvailable?<FontAwesomeIcon icon={faMicrophone} style={{fontSize:'2rem',color:'white',position:'absolute',left:'1rem',bottom:'0.5rem'}}/>:
      <FontAwesomeIcon icon={faMicrophoneSlash} style={{fontSize:'2rem',color:'white',position:'absolute',left:'1rem',bottom:'0.5rem'}}/>
      }
      
      </div>
      )
}

export default function MyLargerVideoComp({e,isMobile}){
    let ref = useRef<any>(null)
   // let muted = true
    let num = 0
   // let isMobile = false

    function openFullscreen(){

    }

    return (
        <div onDoubleClick={()=>openFullscreen()} ref={ref} style={{height:"100%",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
      {/* @ts-ignore */}
      <Display e={e} num={num} isMobile={isMobile}/>
      {/* <TextPlaceHolder large={large} setLargeVideo={setLargeVideo}/> */}
  </div>
    )
}