import React,{useEffect, useRef} from 'react'

export default function Video({e,muted=false}:{e:any,muted:boolean}) {
    const vid = useRef<any>(null)

    useEffect(()=>{
        if(vid.current ===null)
        return;
      try{
        vid.current.srcObject = e.stream
        vid.current.addEventListener('loadedmetadata',()=>vid.current.play() )
      }
      catch(err){
        console.log("vid.current",vid.current,e)
      }
      
        
    },[])
  return (
      //@ts-ignore
    <video ref={vid} muted={true}/>
  )
}
