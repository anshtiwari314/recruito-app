import { sendToServer } from "./requests"
import WavToMp3 from './wavToMp3'

export function startMediaRecorder(args){
    //let url = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'

    let {stream,url,time,recordingStatus,sessionid,userid,fileid,filename,timeStamp} = args
    console.log('startMediaRecorder triggered')

    //let url = audioServerUrl
     let arrayofChunks:any = []
       let mediaRecorder = new MediaRecorder(stream,{
         audioBitsPerSecond:32000
         })
     
     mediaRecorder.ondataavailable = (e)=>{ 
       arrayofChunks.push(e.data)
     }
     
     mediaRecorder.onstop = async ()=>{
      //setMsgLoading(true)
     
      //let url = `https://asia-south1-utility-range-375005.cloudfunctions.net/save_b64_1`
     //let url = `https://0455-182-72-76-34.ngrok.io`
     console.log(`%c just before wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
     let mp3Blob = await WavToMp3(new Blob(arrayofChunks,{type:'audio/wav'}))
     //console.log(mp3Blob)
     console.log(`%c just after wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
     
     let data = {
      
      mob:'vois',
     // uid:myId,
      userid,
      sessionid,
      url:window.location.href,
      date: '13.3.2025',
      time: '11.51.0.57',
      fileid,
      filename,
      timeStamp
    }

     sendToServer( mp3Blob,url,sessionid,data)
      arrayofChunks = []
     }

     //setTimeout(()=>mediaRecorder.stop(),time)
 
     //if recording true stop after 30 sec
     let timeOutId = setTimeout(()=>{
      if(mediaRecorder.state==='recording')
      mediaRecorder.stop()
     },time)
     //chk every second 

     

     let timeOutId2 =setTimeout(()=>requestAnimationFrame(()=>{

      if(recordingStatus.current ===false){
        //clearInterval(intervalId) 
        clearTimeout(timeOutId)
        clearTimeout(timeOutId2)
       if(mediaRecorder.state==='recording')
        mediaRecorder.stop()
        
      }
     }),1000)
     

    //  let intervalId = setInterval(
       
    //  },1000)
     mediaRecorder.start()
     
   }

   export function startMediaRecorder2(args){
    //let url = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'

    const {stream,url,time,recordingStatus,sessionid,userid,fileid,filename,timeStamp} =args

    console.log('startMediaRecorder triggered')

    //let url = audioServerUrl
     let arrayofChunks:any = []
       let mediaRecorder = new MediaRecorder(stream,{
         audioBitsPerSecond:32000
         })
     
     mediaRecorder.ondataavailable = (e)=>{ 
       arrayofChunks.push(e.data)
     }
     
     mediaRecorder.onstop = async ()=>{
      //setMsgLoading(true)
     
      //let url = `https://asia-south1-utility-range-375005.cloudfunctions.net/save_b64_1`
     //let url = `https://0455-182-72-76-34.ngrok.io`
     console.log(`%c just before wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
     let mp3Blob = await WavToMp3(new Blob(arrayofChunks,{type:'audio/wav'}))
     //console.log(mp3Blob)
     console.log(`%c just after wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
     
     let data = {
      
      //mob:'vois',
     // uid:myId,
      userid,
      sessionid,
      url:window.location.href,
      date: '13.3.2025',
      time: '11.51.0.57',
      fileid,
      filename,
      timeStamp
    }

     sendToServer( mp3Blob,url,sessionid,data)
      arrayofChunks = []
     }

     //setTimeout(()=>mediaRecorder.stop(),time)
 
     //if recording true stop after 30 sec
     let timeOutId = setTimeout(()=>{
      if(mediaRecorder.state==='recording')
      mediaRecorder.stop()
     },time)
     //chk every second 

     

     let timeOutId2 =setTimeout(()=>requestAnimationFrame(()=>{

      if(recordingStatus.current ===false){
        //clearInterval(intervalId) 
        clearTimeout(timeOutId)
        clearTimeout(timeOutId2)
       if(mediaRecorder.state==='recording')
        mediaRecorder.stop()
        
      }
     }),1000)
     

    //  let intervalId = setInterval(
       
    //  },1000)
     mediaRecorder.start()
     
   }