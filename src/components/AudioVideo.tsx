import React,{useState,useEffect,useRef} from 'react'
import {v4 as uuidv4} from 'uuid'
import TextPlaceHolder from './TextPlaceHolder'

export default function AudioVideo({e,muted,large,num}:{e:any,muted:boolean,large:boolean,num:number}){
    let vid = useRef<any>(null)
    let isRenderFirstTime = useRef<boolean>(true)
    const [vi,setVi] = useState(e.stream)
    const videoId = e.id

    let styling:any ={
      
      scaledView:{
        flex2Video:{
          height:large===true?"90%":"15rem",
          width:large===true?"90%":"100%",
          objectFit:"cover",
          
        }
      }
  }
    useEffect(()=>{
      if(e.isLoading === true || e.isAudioStream===false)
      return ;
        let audio:any =null
        audio = new Audio();
        audio.srcObject = e.stream;
        console.log(muted)
        muted===true ? null:audio.play()
    
    //cleanup function
    return ()=>{
      console.log('audio return triggered')
      if(audio!==null){
        // audio.pause()
        // audio = null
      }}

    },[])

    useEffect(()=>{
      console.log("rendering",e)
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
         console.log('video available',vid,ref);
            ref.play()
           
        }
      console.log("after exec vid.current null",vid,isRenderFirstTime.current,e)
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
              ref.srcObject = e.stream 
                
              }
              catch(err){
                console.log("vid.current",vid.current,e)
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