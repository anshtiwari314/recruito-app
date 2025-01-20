import React,{useState,useEffect,useRef} from 'react'

export function TextPlaceHolder({e,large}:{e:any,large:boolean}){
    let styling ={
      textWrapper:{
        width:"7rem",
        height:"7rem",
        margin:"4rem auto",
        // border:"0.1rem solid blue",
        //backgroundColor:"white",
        // padding:"2rem"
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        // margin:"0 auto",
        borderRadius:"3.5rem",
        backgroundColor:"violet",
        zIndex:"2"
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
      <div style={styling.textWrapper} >
            <p style={styling.text}>{e?.name?.substring(0,2).toUpperCase()}</p>  
      </div>
    )
}

export function AudioVideo({e,muted,large=null,num,isMobile}:{e:any,muted:boolean,large:any,num:number,isMobile:boolean}){
    let vid = useRef<any>(null)
    let isRenderFirstTime = useRef<boolean>(true)
    const [vi,setVi] = useState(e.stream)
    const videoId = e.id

    let styling:any ={
      
      scaledView:{
        flex2Video:{
          height:"15rem",
          width:isMobile===false?"100%":"20rem",
          objectFit:"cover",
          zIndex:"2"
        }
      }
  }
    useEffect(()=>{
      if(e.isLoading === true || e.isAudioStream===false)
      return ;
        let audio:any =null
        audio = new Audio();
        audio.srcObject = e.audioStream;
        console.log(muted)
        muted===true ? null:audio.play()
    
    //cleanup function
    return ()=>{
      //console.log('audio return triggered')
      if(audio!==null){
        // audio.pause()
        // audio = null
      }}

    })

    useEffect(()=>{
     // console.log("rendering",e)
      // only video stream  
     
      if(e.isLoading===true ||e.isAudioStream===true || vid.current===null || e.cameraStatus===false)
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
        function onPause(){
            console.log('pause')
        }
        function onPlaying(){
          console.log('pause')
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
              ref.addEventListener('pause',onPause)
              ref.addEventListener('playing',onPlaying)

              //ref.muted = muted
              ref.muted = muted
              //console.log("contains video stream",e.stream,e.stream.getTracks())
              
              ref.srcObject = e.videoStream 
                
              }
              catch(err){
               // console.log("vid.current",vid.current,e)
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
         // console.log('audio-video return triggers')
          ref.removeEventListener('ended',ended)
          ref.removeEventListener('error',error)
          ref.removeEventListener('emptied',emptied)
          ref.removeEventListener('abort',abort)
          ref.removeEventListener('waiting',waiting)
          ref.removeEventListener('stalled',stalled)
          ref.removeEventListener('suspend',suspend)
          ref.removeEventListener('loadedmetadata',onLoaded)
          ref.removeEventListener('pause',onPause)
          ref.removeEventListener('playing',onPlaying)
         // ref.pause()
        }
    })

    // useEffect(()=>{
    //   console.log('rendering')
    // },[])
    let tempKey =Math.random()
    //console.log("audio video console",e.isLoading===false,e.isAudioStream === false, e.cameraStatus===true,videoId,num)
    if(e.isLoading===false && e.isAudioStream === false && e.cameraStatus===true){
        return <video ref={vid} id={videoId} key={num*3133} style={styling.scaledView.flex2Video} />
    }
    else {
      return <TextPlaceHolder large={false} e={e}/>
    }
    
}

export default function DisplaySmallerComp({e,muted,large,setSelectedNumber=null,num,isMobile}:{e:any,muted:boolean,large:boolean,setSelectedNumber:any,num:number,isMobile:boolean}) {
 
    useEffect(()=>{
     // console.log('smaller display-component triggers')
    },[])
    function displayOnLargeScreen(){
        
        if(setSelectedNumber===null|| large===true)
        return ;

        setSelectedNumber(num)
      }
      
      //
      //height:"15rem",
     // width:isMobile===false?"100%":"20rem",
  return (
    <div onClick={displayOnLargeScreen} 
        style={{
            height:isMobile===false?"100%":"15rem",
            width:isMobile===false?"100%":"20rem",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
            }}>
        {/* @ts-ignore */}
        <AudioVideo e={e} muted={muted} num={num} isMobile={isMobile}/>
        {/* <TextPlaceHolder large={large} setLargeVideo={setLargeVideo}/> */}
    </div>
  )
}