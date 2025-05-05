import React, { useEffect,useRef } from 'react'

export default function AudioComp({e,muted}:{e:any,muted:boolean}) {
    let audioRef = useRef<any>(null)
    
    useEffect(()=>{

      try{
        //audioRef.current.srcObject = e.stream
        //audioRef.current.addEventListener('loadedmetadata',()=>audioRef.current.play() )
        console.log("audio comp",e.stream)
        let audio = new Audio();
        audio.srcObject = e.stream;
        console.log(muted)
        muted===true ? null:audio.play()
      }
      catch(err){
        console.log("error audioRef.current",audioRef.current,e,err)
      }

    },[])
  
    return (
    <>
        <div>
            <p>AN</p>
        </div>
    </>
  )
}
