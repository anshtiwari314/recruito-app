import React, {createContext, useContext,useEffect,useState,useRef } from 'react'
import { startMediaRecorder,startMediaRecorder2 } from '../functions/mediaRecorder';
import { getTimeStamp,getOldTimeStamp,generateBase64 } from '../functions/generalFn';
import WavToMp3 from '../functions/wavToMp3';
import { useData } from './DataWrapper';
import { useAuth } from './AuthContext';
import { useMicVAD} from "@ricky0123/vad-react"
import { PostReq } from '../functions/requests';
import { utils } from "@ricky0123/vad-react"
//import { processAudioToBase64 } from '../functions/generalFn';
//import useRequest from '../hooks/requests';

const VadContext = createContext('vadContext')

export function useVad(){
    return useContext(VadContext)
}

export function VadWrapper({children}){


    const {ngrokServerUrl,setMsgLoading,oneWayUrl,socket2,usersArrRef,name,isHost,myAudioStream} = useData()
    //const {currentUser} = useAuth()
    const [vadRecordingOn,setVadRecordingOn] = useState<boolean>(false);
    let recordingStatus = useRef(false);

    const [vadInstance,setVadInstance] = useState(null)
    const [userSpeaking,setUserSpeaking] = useState(false)
    const [vadStatus,setVadStatus] = useState(false)
    const vadRef = useRef({ oldVadrecordingStatus:false,myVad:null })
    const [manualVadStatus,setManualVadStatus] = useState(true)

    const initReqStatusRef = useRef(false)
    //const {PostReq } = useRequest()

    // ort.env.wasm.wasmPaths = {
    //     "ort-wasm-simd-threaded.wasm": `/ort-wasm-simd-threaded.wasm`,
    //     "ort-wasm-simd.wasm": `/ort-wasm-simd.wasm`,
    //     "ort-wasm.wasm": `/ort-wasm.wasm`,
    //     "ort-wasm-threaded.wasm": `/ort-wasm-threaded.wasm`,
    //   }

    async function processAudioToBase64(audio,url,data){
      console.log("vad stopped")
      const wavBuffer = utils.encodeWAV(audio)
        // const base64 = utils.arrayBufferToBase64(wavBuffer)
        // console.log("hello world",base64)
  
           // let wavBlob =processingToWav(audio)
        let wavBlob = new Blob([wavBuffer], { type: 'audio/wav' })
        let mp3Blob = await WavToMp3(wavBlob)
        
        //generate base64 of that blob 
        let base64data = await generateBase64(mp3Blob)
  
  
        data = {...data,
          audiomessage:base64data.split(',')[1],
          timeStamp:getTimeStamp()
        }
  
  
        // let resp = await PostReq(url,data)
        // console.log('resp',resp)
        //return resp
        console.log("from inside send to server", data);
        socket2.emit("ai_suggestion_req_ins", data);
  }
    
    useEffect(()=>{
      if(socket2===null)
        return;
      //init req 

      let data = {
        
        roomid: "abc-123-fgh-456",
        jobid: "1",
        agentid: "1234",
        //custemailid: custEmailId,
        isHost: isHost,
        name: name,
       

        sessionid:usersArrRef.current[0]?.id,
               audiomessage:'',
        timeStamp:getTimeStamp(),
        init:true,
        
      }

      if(initReqStatusRef.current ===false){
        initReqStatusRef.current = true

        // PostReq('https://2265-49-204-210-210.ngrok-free.app/',data).then(resp=>{
        //   console.log('init req',resp)
        //  })
        //processAudioToBase64(audio,oneWayUrl,data)
        socket2.emit("ai_suggestion_req_ins", data);
      }
       
      

    },[socket2])


    function VAD(cb1:CallableFunction,cb2:CallableFunction){
        return new Promise(async (resolve,reject)=>{
            //@ts-ignore
            const myvad = await vad.MicVAD.new({
              onSpeechStart: cb1,
              onSpeechEnd: cb2,
              positiveSpeechThreshold:0.9 ,
              negativeSpeechThreshold:0.85
          // redemptionFrames:100
            })
            resolve(myvad)
            reject(myvad)
        })
        
      }
    
    
      const VAD2 = useMicVAD({
        workletURL: `./vad.worklet.bundle.min.js`,
        //modelURL: "http://localhost:8080/silero_vad.onnx",
        //@ts-ignore
        modelURL:`./silero_vad.onnx`,
        onVADMisfire: () => {
          console.log("Vad misfire")
        },
        onSpeechStart: () => {
          console.log("Speech start")
        },
        onSpeechEnd:(audio)=>{
          console.log('getting data from vad2')
          let speechStopDate = new Date();

            let data = {
              
              roomid: "abc-123-fgh-456",
              jobid: "1",
              agentid: "1234",
              //custemailid: custEmailId,
              isHost: isHost,
              name: name, 
               sessionid:usersArrRef.current[0]?.id,
               
                speech_stop_time:`${speechStopDate.toLocaleDateString()} ${speechStopDate.toLocaleTimeString()}:${speechStopDate.getMilliseconds()}`
            }
            processAudioToBase64(audio,oneWayUrl,data)
            //setMsgLoading(true)
        }
      })
   
      
      

    function start(){
      setUserSpeaking(true)
    }
    
    async function stop(audio){
        setUserSpeaking(false)
        setVadStatus(false)
        setMsgLoading(true)
        console.log('stop automatic vad triggered')
        let data = {
            //this change is for jarvis-in-person-usecase
            //sessionid:currentUser.userid,
            

            // this change is for vitt-sales-copilot
            sessionid:usersArrRef.current[0]?.id,
            //mob: currentUser.userid,
            //userid:currentUser.userid,

        }
        processAudioToBase64(audio,oneWayUrl,data)
        
        
    }

    function getVadInstance(){
      VAD(start,stop).then((myVad)=>{
         console.log('getVad instance',myVad)
         return myVad
      })
    }
    /** automatic vad new  */

    useEffect(()=>{
      if(vadInstance!==null)
        return ;

      // let intervalId = setInterval(()=>{
      //   VAD(start,stop).then((myVad)=>{
      //     if(myVad===null)
      //       return ;
      //     vadRef.current.myVad = myVad
      //     setVadInstance(myVad)
      //     clearInterval(intervalId)
      //   })
      // },1000)

      // return ()=>{clearInterval(intervalId)}
    },[])

    useEffect(()=>{
      if(vadInstance===null)
        return ;

      if( vadStatus===true ){
        vadInstance?.start()
        console.log('if 1 called',vadInstance)
      }else{
        console.log('else 1 called',vadInstance)
        vadInstance?.pause()
      }
      

    },[vadStatus])

    // useEffect(()=>{
    //     if(vadStatus===true){
    //         // chk if initialized first time or not
    //         // initialised if null
    //         if(vadRef.current.myVad ===null){
                

    //             VAD(start,stop).then((myVad)=>{
    //               console.log('nested if 1 called',myVad)
    //                 vadRef.current.myVad = myVad
    //                 setVadInstance(myVad)
    //                 vadRef.current.myVad.start()
    //                 console.log(vadRef.current.myVad)

    //                 // vadRef.current.myVad.options.positiveSpeechThreshold=0.9 
    //                 // vadRef.current.myVad.options.negativeSpeechThreshold=0.85
                    

    //                 console.log(vadRef.current.myVad)
    //              })
                
                
    //         }else{
    //             //call vad if initialised before
    //             vadRef.current.myVad?.start()
    //             console.log('nested else 1 called',vadRef.current.myVad)
    //         }
            
    //     }else{
    //         vadRef.current.myVad?.pause()
    //         console.log('else 2 called',vadRef.current.myVad)
    //     }
    // },[vadStatus])


    /** manual vad logic  begins here ( offline logic)*/

    useEffect(()=>{
      console.log('reset vad if mic is not available',VAD2)
      //VAD2 ===null
      //VAD2?.pause()
    },[])

    useEffect(()=>{
      console.log('vad2 changed',VAD2)
    },[VAD2])

      useEffect(()=>{

        let url = ''
        let tempVad = null

        
        
        // if (typeof VAD2 !== "object" || VAD2?.vadOptions ===undefined)
        // return ;

        if (typeof VAD2 !== "object" )
        return ;

        if(manualVadStatus===true){
            console.log('vad2',VAD2)
           // VAD2.vadOptions.positiveSpeechThreshold=0.9 
           // VAD2.vadOptions.negativeSpeechThreshold=0.85
            VAD2?.start()
            //console.log('manual vad is active',VAD2)
            console.log('vad2 after changing parameteres',VAD2)
         
        }else{
          console.log('manual vad is paused',VAD2)
          VAD2?.pause()
        }
      },[manualVadStatus])
    
    

    /* (Automatic vad old ) this logic has time delay bcz of startMediaRecorder function the data only send after when 
     startMediaRecorder2 has finished execution of 10sec 
    */
    useEffect(()=>{
      
        console.log(`%c vadRecordingOn toggle ${new Date().toLocaleTimeString()} ${recordingStatus.current} ${vadRecordingOn}`,'background-color:teal;color:white')
          recordingStatus.current = vadRecordingOn
      
          let id:number;
          if(vadRecordingOn ===true){
            //setMsg([]);
            navigator.mediaDevices.getUserMedia({
              audio:true
            }).then(stream=>{
  
              let startMediaRecorderArgs = {
                stream,
                //url : 'https://tso4smyf1j.execute-api.ap-south-1.amazonaws.com/test/transcription-clientaudio',
                //url:'http://35.187.246.238/transcription-clientaudio',
                //url:'https://34.100.145.102/',
                //url:'https://wpv7kxos9g.execute-api.ap-south-1.amazonaws.com/test/sales-copilot-gcp',
                url : ngrokServerUrl,
                time:10000,
                recordingStatus:recordingStatus,
                
                userid:currentUser.userid,
                sessionid:currentUser.sessionuid,
                timeStamp:getTimeStamp()
                // mob:"anuj",
                // //roomid	"271083f6-8a51-4db0-b005-7e14923f70d2"
                // //sessionid	"demo1"
                // timeStamp:	"3/17/2025 1:52:19 PM:160",
                // uid	:"anuj"
              } 
  
             startMediaRecorder2(startMediaRecorderArgs)
             setMsgLoading(true)
             //@ts-ignore
              id = setInterval(()=>{
                console.log('recording is ',vadRecordingOn)
                startMediaRecorder2(startMediaRecorderArgs)
                setMsgLoading(true)
              },10000)
            })
      
           // if(recordingOn ===true) 
          }
          return()=>clearInterval(id)
        },[vadRecordingOn,ngrokServerUrl])
        
      useEffect(()=>{
        
          let tempVad:any
          let id:undefined|any
          let timer :undefined|any
          
          if(vadRecordingOn ===true){
            console.log(`%c vad triggered ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
            
            
            //this timeout if user is silence from starting 
            timer = setTimeout(()=>{
              tempVad && tempVad.pause() ; tempVad = undefined
              setVadRecordingOn(false)
            },5000)
      
            function start(){
              
              console.log(`%c audio started ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
              //end timer
              timer && clearTimeout(timer); 
              id && clearTimeout(id) ; id = undefined;
            }
            function stop(){
              
              console.log(`%c audio stopped ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
              //start timer
  
              // id=setTimeout(()=>{
                
              //   console.log(`%c if silence after 0.5sec then pause the vad ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
              //   console.log(tempVad)
                
              // },500)
              tempVad && tempVad.pause()
                tempVad = undefined
                setVadRecordingOn(false)
            }
            
              VAD(start,stop).then((vad:any)=>{
                tempVad = vad
                vad.start()
              })
              
            }
            return ()=>{
              // if recording On is manually disabled , pause vad 
              tempVad && tempVad.pause(); tempVad = undefined
              id && clearInterval(id);id = undefined
              timer && clearInterval(timer) ; timer = undefined
            }
          },[vadRecordingOn])

    let values = {
        vadRecordingOn,
    setVadRecordingOn,
        manualVadStatus,setManualVadStatus,
        vadStatus,setVadStatus,vadInstance,VAD2,userSpeaking
    }
    return (
        //@ts-ignore
        <VadContext.Provider value={values}>
            {children}
        </VadContext.Provider>
    )
}