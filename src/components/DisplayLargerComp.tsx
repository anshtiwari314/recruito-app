import React,{useState,useEffect,useRef} from 'react'
import {v4 as uuidv4} from 'uuid'

export function TextPlaceHolder({e,large}:{e:any,large:boolean}){
    let styling ={
      textWrapper:{
        width:"30rem",
        height:"30rem",
        // border:"0.1rem solid blue",
        //backgroundColor:"white",
        // padding:"2rem"
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        margin:"0 auto",
        borderRadius:"15rem",
        backgroundColor:"violet"
      },
      text:{
        fontSize:"4.5rem",
        width:"fit-content",
        color:"white"
      }
    }
    useEffect(()=>{
     // console.log("textPlaceHolder",e,large)
    },[])

    return (
      <div style={styling.textWrapper} >
        
            <p style={styling.text}>{e?.name?.substring(0,2).toUpperCase()}</p>  
      </div>
    )
}

export function AudioVideo({e,muted,large,num,isMobile}:{e:any,muted:boolean,large:boolean,num:number,isMobile:boolean}){
    let vid = useRef<any>(null)
    let isRenderFirstTime = useRef<boolean>(true)
    const [vi,setVi] = useState(e.stream)
    const videoId = e.id

    let styling:any ={
      
      scaledView:{
        flex2Video:{
          height:"90%",
          width:isMobile===false?"90%":"100vw",
          objectFit:"cover",
          position:isMobile===false?"":"absolute",
        }
      }
  }
    useEffect(()=>{
      if(e.isLoading === true || e.isAudioStream===false)
      return ;
        let audio:any =null
        audio = new Audio();
        audio.srcObject = e.stream;
        //console.log(muted)
        muted===true ? null:audio.play()
    
    //cleanup function
    return ()=>{
     // console.log('audio return triggered')
      if(audio!==null){
        // audio.pause()
        // audio = null
      }}

    },[])

    useEffect(()=>{
     // console.log("rendering",e)
      if(e.isLoading===true ||e.isAudioStream===true || vid.current===null)
      return;
      
      const ref = vid.current 
      // if(isRenderFirstTime.current===false)
      // return ;
      
      // isRenderFirstTime.current =false 

        function ended(){
            console.log('stream ended')
        }
        function error(){
            console.log('stream error')
        }
        function emptied(){
            console.log('stream emptied')
        }
        function abort(){
            console.log('stream abort')
        }
        function waiting(){
            console.log('stream waiting')
        }
        function stalled(){
            console.log('stream stalled')
        }
        function suspend(){
                console.log('stream suspend')
                //ref.play()
        }
        function onLoaded(){
         //console.log('video available',vid,ref);
            ref.play()
           
        }
      //console.log("after exec vid.current null",vid,isRenderFirstTime.current,e)
      if(e.isAudioStream===false){  
            try{
              ref.addEventListener('ended',ended)
              ref.addEventListener('error',error)
              ref.addEventListener('emptied',emptied)
              ref.addEventListener('abort',abort)
              ref.addEventListener('waiting',waiting)
              ref.addEventListener('stalled',stalled)
              ref.addEventListener('suspend',suspend)
              
              ref.addEventListener('loadedmetadata',onLoaded)
              ref.muted = muted
              ref.srcObject = e.videoStream 
                
              }
              catch(err){
              //  console.log("vid.current",vid.current,e)
              }
        }

        // return ()=>{
          
        //   if(vid.current!==null){
        //     //vid.current.pause()
        //     console.log(vid.current)
        //     //vid.current.remove()
        //     vid.current=null
        //   }}
        return ()=>{
          console.log('audio-video return triggers')
          ref.removeEventListener('ended',ended)
          ref.removeEventListener('error',error)
          ref.removeEventListener('emptied',emptied)
          ref.removeEventListener('abort',abort)
          ref.removeEventListener('waiting',waiting)
          ref.removeEventListener('stalled',stalled)
          ref.removeEventListener('suspend',suspend)
          ref.removeEventListener('loadedmetadata',onLoaded)
          
          //ref.remove()
        }
    },[e])

    // useEffect(()=>{
    //   console.log('rendering')
    // },[])

    if(e.isLoading===false && e.isAudioStream === false){
        return <video ref={vid} id={videoId} key={num*3133} style={styling.scaledView.flex2Video} />
    }
    else {
      return <TextPlaceHolder large={false} e={e}/>
    }
    
}

export default function DisplayLargerComp({e,muted,large,setSelectedNumber=null,num,isMobile}:{e:any,muted:boolean,large:boolean,setSelectedNumber:any,num:number,isMobile:boolean}) {
 
  const ref = useRef<any>(null)

  function openFullscreen() {
    if(ref.current ===null)
    return ;


    if (ref.current.requestFullscreen) {
      ref.current.requestFullscreen();
    } else if (ref.current.webkitRequestFullscreen) { /* Safari */
      ref.current.webkitRequestFullscreen();
    } else if (ref.current.msRequestFullscreen) { /* IE11 */
      ref.current.msRequestFullscreen();
    }
  }


return (
  <div onDoubleClick={()=>openFullscreen()} ref={ref} style={{height:"100%",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
      {/* @ts-ignore */}
      <AudioVideo e={e} muted={muted} num={num} isMobile={isMobile}/>
      {/* <TextPlaceHolder large={large} setLargeVideo={setLargeVideo}/> */}
  </div>
)
}
