import React,{useRef,useEffect} from "react"

export function RightPanelVideo({e,muted}){
    console.log(e)

    const vidRef = useRef<any>(null)


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

      function getMicIcon(){
        if(!e?.isMicrophoneAvailable)
          return null 
        if(e?.microphoneStatus ===false)  
        return <i className="fa-solid fa-microphone-slash bg-black/50 text-white p-1 rounded"></i>
        else 
        return <i className="fa-solid fa-microphone bg-black/50 text-white p-1 rounded"></i>
      }
      function getVideoIcon(){
        if(!e?.isCameraAvailable)
          return null 
        if(e?.cameraStatus===false){
          return <i className="fa-solid fa-video-slash bg-black/50 text-white p-1 rounded"></i>
        }else{
          return <i className="fa-solid fa-video bg-black/50 text-white p-1 rounded"></i>
        }
      }
    return (
          <>
            <div className="relative">
              <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
                <video
                  ref={vidRef}
                  
                  className="w-full h-full object-cover"
                ></video>
                <video />
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-sm bg-black/50 text-white px-2 py-1 rounded">
                  {e?.name}
                </span>
                <div className="flex space-x-1">
                  {getMicIcon()}
                  {/* <i className="fa-solid fa-microphone-slash bg-black/50 text-white p-1 rounded"></i> */}
                  {getVideoIcon()}

                </div>
              </div>
            </div>
          </>  
    )
  }