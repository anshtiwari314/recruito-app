import React,{useState,useEffect,createContext,useContext,useRef, useCallback} from 'react'
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';
import Peer from 'peerjs';
import WavToMp3 from '../functions/wavToMp3';
import type { CuesDataType } from '@/reducers/cuesReducer';
import { setCues, addCues } from '@/reducers/cuesReducer';
import { useAppSelector } from '@/store/store';
import { useDispatch } from 'react-redux';

const Context = createContext("");

export function useData(){
    return useContext(Context);
}

type users = {
    id:string,
    peer2Id:string,
    audioPeerId:string,

    stream:MediaStream|null|boolean,
    videoStream:MediaStream|null|boolean,
    audioStream:MediaStream|null|boolean,
    isCameraAvailable:boolean,
    isMicrophoneAvailable:boolean,
    cameraStatus:boolean,
    microphoneStatus:boolean ,

    isAdmin:boolean,
    isAudioStream:boolean,
    isLoading:boolean,
    roomId:string ,
    custEmailId:string|number,
    remove:boolean,
    name:string,
    isScreenSharingEnabled:boolean,
    containsScreenStream:boolean
}

export default function DataWrapper({children}:{children:React.ReactNode}) {

    let initialUser = {
        id:'',
        peer2Id:'',
        audioPeerId:'',
        name:'',

        stream:null,
        videoStream:null,
        audioStream:null,
        isCameraAvailable:false,
        isMicrophoneAvailable:false,
        cameraStatus:true,
        microphoneStatus:true ,

        isAdmin:false,
        isAudioStream:false,
        isLoading:true,
        roomId:'',
        custEmailId:'',
        remove:false,
        
        isScreenSharingEnabled:false,
        containsScreenStream:false
    }
    let initialMsgArr = [
        {
            id:'abcd',
            name:"siar",
            msg:"hello everyone i hope u guys are fine"
        },
        {
            id:"1234",
            name:"suresh",
            msg:"is elss fund is better than other mutual funds"
        },
    ]

    const dispatch = useDispatch();
    const currentCuesState = useAppSelector((state) => state.cuesReducer.CuesList);
    const { roomId, custEmailId, isHost } = useAppSelector((state) => state.qpReducer);

    const [socket,setSocket] = useState<any>(null)
    const [socket2,setSocket2] = useState<any>(null)

    const [myId,setMyId] = useState<string>('')
    const [custId,setCustId] = useState<string>('')
    
    const [peer,setPeer] = useState<Peer|null>(null)
    const firstTimeConnectRef = useRef<boolean>(true)
    
    const [users,setUsers] = useState<users[]>([]);
    
    const [myStream,setMyStream] = useState<MediaStream|null|boolean>(null);
    const [myAudioStream,setMyAudioStream] = useState<MediaStream|null|boolean>(null);

    const peersObjRef = useRef<any>({});
    const peersArrRef = useRef<string[]>([]);

    const [peer2,setPeer2] = useState<Peer|null>(null)
    const peer2Ref = useRef<any>(null)
    const peers2ObjRef = useRef<any>({});
    const peers2ArrRef = useRef<string[]>([]);

    const [audioPeer,setAudioPeer] = useState<Peer|null>(null)
    const audioPeerRef = useRef<any>(null)
    const audioPeersObjRef = useRef<any>({});
    const audioPeersArrRef = useRef<string[]>([]);


    const globalRef= useRef({
        recordingStatus:false,    
        usersArrRefRenderCount :0,
        myVad:null,
        renderCount:0,
        socket2FirstTimeConnect:true
    })

    let usersRef = useRef<users[]>([])
    let users2Ref = useRef<users[]>([])
    let tempData = useRef<users[]>([])
    let tempData2 = useRef<users[]>([])
    let usersFlag = useRef(2)
    let usersArrRef = useRef<users[]>([])
    
    const [msg,setMsg] = useState([]);
    const [cueLoading,setCueLoading] = useState(false)
    const msgArrRef = useRef([])

    const [name,setName] = useState('')
    const [cameraToggle,setCameraToggle ] = useState(true)
    const cameraTogglerRef = useRef(true)
    const [microphoneToggle,setMicroPhoneToggle] = useState(true)
    const microphoneToggleRef = useRef(true)
    const [screenSharing,setScreenSharing] = useState(false);
    const screenStreamRef = useRef(null)
    const vadEffectRender = useRef(0)
    const vadFlag = useRef(false)
    const adminMediaRecorderStatus = useRef(false)
    const clientMediaRecorderStatus = useRef(false)
    const clientTranscriptionMediaRecorderStatus = useRef(false)
    const [validUrl,setValidUrl] = useState('')
    const globalStreamRef = useRef<any>(null)
    const [largeVideo,setLargeVideo] = useState(null)
    const largeVideoRef = useRef(null)
    const [videoRecordingState,setVideoRecordingState] = useState({file:null,uuid:null})
    const videoRecordingRef = useRef({file:null,uuid:null}) 

    const [recordingOn,setRecordingOn] = useState(false)
    //const adminUrl = `https://tso4smyf1j.execute-api.ap-south-1.amazonaws.com/test/transcription-2way-clientaudio`;
    //https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/recruiter-copilot
    const [adminUrl,setAdminUrl] = useState(`https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/recruiter-copilot`)
    //
    //https://19vnck5aw8.execute-api.ap-south-1.amazonaws.com/Prod/save-adminaudio
    const adminClientUrl = `http://localhost:5005/admin-client`
    //
    //https://19vnck5aw8.execute-api.ap-south-1.amazonaws.com/Prod/save-clientaudio
    const clientTranscriptionUrl = `https://583c-182-72-76-34.ngrok-free.app/client`
    //http://localhost:5006/client
    //https://f6p70odi12.execute-api.ap-south-1.amazonaws.com

    const [videoUploadUrl,setVideoUploadUrl] = useState('https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/postfacto-upload-test')

    
    //@ts-ignore
    function sendToServer(blob,url,data){
        //console.log("url",url,blob)
        //chunksWithMeta.splice(0,1)
        // chunks.splice(0,1)
        
        //chunksWithMeta=[]
        //chunks = []
        
        let date = new Date()
        console.log(`%c just before sending the data ${date.toLocaleTimeString()+':'+date.getMilliseconds()}`,'background-color:teal;color:white')
        let reader = new FileReader();
        reader.onloadend = ()=>{
            let base64data = reader.result;
            blob = null
           //console.log(base64data.split(',')[1])
    
            //https://f6p70odi12.execute-api.ap-south-1.amazonaws.com
            //http://localhost:5002/base64
            
            console.log('inside send to server',data);
           
            let date = new Date()
            setCueLoading(true)
            fetch(url,{
                method:'POST',
                headers:{
                   'Accept':'application.json',
                   'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    uid:data.id,
                    sessionid:data.id,
                    roomid:data.roomId,
                    isadmin:data.isAdmin, 
                    custemailid:data.custEmailId,
                    init:data.init,
                    //@ts-ignore
                    audiomessage:base64data.split(',')[1],
                    timeStamp:`${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}`
                }),
                cache:'default',}).then(res=>{
                   console.log("res from audio server",res)
                })
            
        }
        reader.readAsDataURL(blob)
    }

    function bufferToWav(abuffer:ArrayBuffer, len:number) {
        //console.log("abuffer", abuffer, len);

        //@ts-ignore
        var numOfChan = abuffer.numberOfChannels,
          length = len * numOfChan * 2 + 44,
          buffer = new ArrayBuffer(length),
          view = new DataView(buffer),
          channels = [],
          i,
          sample,
          offset = 0,
          pos = 0;
      
        // write WAVE header
    
        //console.log("pos", pos, length);
        setUint32(0x46464952); // "RIFF"
        //console.log("pos", pos, length);
        setUint32(length - 8); // file length - 8
        //console.log("pos", pos, length);
        setUint32(0x45564157); // "WAVE"
        //console.log("pos", pos, length);
        setUint32(0x20746d66); // "fmt " chunk
        //console.log("pos", pos, length);
        setUint32(16); // length = 16
        //console.log("pos", pos, length);
        setUint16(1); // PCM (uncompressed)
        //console.log("pos", pos, length);
        setUint16(numOfChan);
        //console.log("pos", pos, length);
        //@ts-ignore
        setUint32(abuffer.sampleRate);
        //console.log("pos", pos, length);
        //@ts-ignore
        setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        //console.log("pos", pos, length);
        setUint16(numOfChan * 2); // block-align
        //console.log("pos", pos, length);
        setUint16(16); // 16-bit (hardcoded in this demo)
        //console.log("pos", pos, length);
        setUint32(0x61746164); // "data" - chunk
        //console.log("pos", pos, length);
        setUint32(length - pos - 4); // chunk length
        //console.log("pos", pos, length);
    
        // write interleaved data
        //@ts-ignore
        for (i = 0; i < abuffer.numberOfChannels; i++)
            //@ts-ignore
          channels.push(abuffer.getChannelData(i));
      
        while (pos < length) {
          for (i = 0; i < numOfChan; i++) {
            // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true); // write 16-bit sample
            pos += 2;
          }
          offset++; // next source sample
        }
      
        return buffer;
        //@ts-ignore
        function setUint16(data) {
          view.setUint16(pos, data, true);
          pos += 2;
        }
        //@ts-ignore
        function setUint32(data) {
          view.setUint32(pos, data, true);
          pos += 4;
        }
    }
    
    function downsampleToWav(file:any, callback:CallableFunction) {
        //Browser compatibility
        // https://caniuse.com/?search=AudioContext

        //@ts-ignore
        const AudioContext = window.AudioContext || window.webkitAudioContext || AudioContext;
        const audioCtx = new AudioContext();
        const fileReader1 = new FileReader();
        fileReader1.onload = function (ev) {
          // Decode audio
          //@ts-ignore
          audioCtx.decodeAudioData(ev.target.result, (buffer) => {
            // this is where you down sample the audio, usually is 44100 samples per second
            const usingWebkit = !window.OfflineAudioContext;
            //console.log("usingWebkit", usingWebkit);

            //@ts-ignore
            const OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            // {
            //   numberOfChannels: 1,
            //   length: 16000 * buffer.duration,
            //   sampleRate: 16000
            // }
            var offlineAudioCtx = new OfflineAudioContext(
              1,
              16000 * buffer.duration,
              16000
            );
      
            let soundSource = offlineAudioCtx.createBufferSource();
            soundSource.buffer = buffer;
            soundSource.connect(offlineAudioCtx.destination);
      
            const reader2 = new FileReader();
            reader2.onload = function (ev) {
              const renderCompleteHandler = function (evt:any){
                //console.log("renderCompleteHandler", evt, offlineAudioCtx);
                let renderedBuffer = usingWebkit ? evt.renderedBuffer : evt;
                const buffer = bufferToWav(renderedBuffer, renderedBuffer.length);
                if (callback) {
                  callback(buffer);
                }
              };
              if (usingWebkit) {
                offlineAudioCtx.addEventListener("complete", renderCompleteHandler);
                offlineAudioCtx.startRendering();
              } else {
                offlineAudioCtx
                  .startRendering()
                  .then(renderCompleteHandler)
                  .catch(function (err) {
                    console.log(err);
                  });
              }
            };
            reader2.readAsArrayBuffer(file);
      
            soundSource.start(0);
          });
        };
      
        fileReader1.readAsArrayBuffer(file);
    }
    
    function encodeMp3(arrayBuffer:any) {
    
        //@ts-ignore
        const wav = lamejs.WavHeader.readHeader(new DataView(arrayBuffer));
        console.log("i am wav", wav);
        const dataView = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);
        //@ts-ignore
        const mp3Encoder = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 128);
        const maxSamples = 1152;
      
        console.log("wav", wav);
      
        const samplesLeft =
          wav.channels === 1
            ? dataView
            : new Int16Array(wav.dataLen / (2 * wav.channels));
      
        const samplesRight =
          wav.channels === 2
            ? new Int16Array(wav.dataLen / (2 * wav.channels))
            : undefined;
      
        if (wav.channels > 1) {
            //@ts-ignore
          for (var j = 0; j < samplesLeft.length; i++) {
            samplesLeft[j] = dataView[j * 2];
            //@ts-ignore
            samplesRight[j] = dataView[j * 2 + 1];
          }
        }
      
        let dataBuffer = [];
        let remaining = samplesLeft.length;
        for (var i = 0; remaining >= maxSamples; i += maxSamples) {
          var left = samplesLeft.subarray(i, i + maxSamples);
          var right;
          if (samplesRight) {
            right = samplesRight.subarray(i, i + maxSamples);
          }
          var mp3buf = mp3Encoder.encodeBuffer(left, right);
          dataBuffer.push(new Int8Array(mp3buf));
          remaining -= maxSamples;
        }
      
        const mp3Lastbuf = mp3Encoder.flush();
        dataBuffer.push(new Int8Array(mp3Lastbuf));
        return dataBuffer;
    }
    function sendStreamToServer(stream:MediaStream,data:any,recordingTime:number,url:string){
        let mediaStream =new MediaStream()
        mediaStream.addTrack(stream.getAudioTracks()[0])
        try{
        let arrayofChunks:Blob[] = []
        let mediaRecorder = new MediaRecorder(mediaStream,{
            audioBitsPerSecond:32000
        })
        mediaRecorder.ondataavailable = (e)=>{
            
            arrayofChunks.push(e.data)
        }
        mediaRecorder.onstop=()=>{
            downsampleToWav(new Blob(arrayofChunks,{type:"audio/ogg"}),(buffer:ArrayBuffer)=>{
            const mp3Buffer = encodeMp3(buffer)
            let blob = new Blob(mp3Buffer,{type:"audio/mp3"});
            
            sendToServer(blob,url,data)
            arrayofChunks=[]
            //@ts-ignore
            blob = null
            })
        }
        setTimeout(()=>mediaRecorder.stop(),recordingTime)
        
        mediaRecorder.start()
        }catch(e){
            console.log(e)
            return;
        }
    }

    async function gettingVideoStream(){
        return navigator.mediaDevices.getUserMedia({
            video:{
                frameRate:{
                    ideal:60,
                    min:10
                }
            },
            audio:false
        })
    }
    function gettingAudioStream(){
        return navigator.mediaDevices.getUserMedia({
                    audio:true
                })
    }    
    function gettingScreenStream(){
        return navigator.mediaDevices.getDisplayMedia({
            video: {
                //@ts-ignore
                cursor: "always"
            },
            audio:false
            
        })
    }
    
    function handleData(data:CuesDataType = {} as CuesDataType) {
        let date = new Date()
        console.log(`%c inside handle Data ${date.toLocaleTimeString()+':'+date.getMilliseconds()}`,'background-color:teal;color:white')

        setCueLoading(false)
        //@ts-ignore
        let arr:CuesDataType[] =[]
        //@ts-ignore
        let obj:CuesDataType = {}
// "sessionid": <str>, "audiofiletimestamp": <str>
        

        if(data?.loading){
            return ;
        }

        if(data?.imageUrl && data?.imageUrl !== ""){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["common_id"] = data?.common_id
            obj["type"]="ImageMsg"
            obj["imageUrl"] = data?.imageUrl;
            obj["iconName"] = 'fa-solid fa-forward-fast'
            obj["similarity_query"] = data?.similarity_query;
            obj["color"]= data?.color;
            obj["iconColor"] = data?.iconColor 
            obj["sessionid"] = data?.sessionid;
            obj["audiofiletimestamp"]=data?.audiofiletimestamp
            
            //arr.push(obj)
            arr = [...arr, obj]
            //@ts-ignore
            obj = {}
        }
        if(data?.value && data?.value !== ""){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["common_id"] = data?.common_id
            obj["type"]="InputForm"
            obj["iconName"] = "fa-regular fa-pen-to-square"
            obj["value"] = data?.value 
            obj["label"] = data?.label 
            obj["color"] = data?.color 
            obj["iconColor"] = data?.iconColor 
            obj["similarity_query"] = data?.similarity_query;
            obj["sessionid"] = data?.sessionid
            obj["audiofiletimestamp"]=data?.audiofiletimestamp
            
            //arr.push(obj)
            arr = [...arr, obj]
            //@ts-ignore
            obj = {}
        }
        if(data?.radio && data?.radio !== ""){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["common_id"] = data?.common_id
            obj["type"]="RadioForm"
            obj["iconName"] = 'fa-regular fa-pen-to-square'
            obj["label"] = data?.label 
            obj["radio"] = data?.radio
            obj["color"] = data?.color
            obj["iconColor"] = data?.iconColor 
            obj["similarity_query"] = data?.similarity_query;
            obj["sessionid"] = data?.sessionid
            obj["audiofiletimestamp"]=data?.audiofiletimestamp
           
            //arr.push(obj)
            arr = [...arr, obj]
            //@ts-ignore
            obj={}
        }

        if(data?.content || data?.similarity_query){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["common_id"] = data?.common_id
            obj["type"]="TextMsg"
            obj["content"] = data.content
            obj["iconName"] = 'fa-solid fa-circle-question'
            obj["color"]= data?.color 
            obj["iconColor"] = data?.iconColor
            obj["similarity_query"] = data?.similarity_query;
            obj["sessionid"] = data?.sessionid
            obj["audiofiletimestamp"]=data?.audiofiletimestamp

            //arr.push(obj)
            arr = [...arr, obj]
            //@ts-ignore
            obj={}  
        }
        if(data?.replies && data?.replies?.length > 0){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["common_id"] = data?.common_id
            obj["type"] = "SuggestiveMsg"
            obj["replies"] = data?.replies
            obj["color"] = data?.color
            obj["iconColor"] = data?.iconColor 
            obj["similarity_query"] = data?.similarity_query;
            obj["iconName"] = 'fa-solid fa-forward-fast'
            obj["sessionid"] = data?.sessionid
            obj["audiofiletimestamp"]=data?.audiofiletimestamp

            //arr.push(obj)
            arr = [...arr, obj]
            //@ts-ignore
            obj={}
           
        } 
       //@ts-ignore
       dispatch(addCues({CuesList:arr}));
       
    }

    function updateCues(data:CuesDataType = {} as CuesDataType) {
        let date = new Date()
        console.log(`%c inside update cues ${date.toLocaleTimeString()+':'+date.getMilliseconds()}`,'background-color:teal;color:white')
    
        let filteredCues = currentCuesState?.map(e => {
            if (e.common_id === data?.common_id) {
                return { 
                    ...e, 
                    content: e.content + ' ' + (data.content ?? '') 
                };
            }
            return e;
        });

        if (!filteredCues) {return;}
        
        dispatch(setCues({CuesList:filteredCues}));
    }

    function uploadFile(uploadFileparam:Blob) {
        let uid = uuidv4()
        const chunkSize = 1 * 1024 * 1024;
        let filesUploaded = 0;
        let totalFiles = 1;
        const totalChunks = Math.ceil(uploadFileparam.size / chunkSize);
        let currentChunk = 0;
        let uploadUrl = videoUploadUrl
        // Chunk uploading function
    
        function uploadChunk(chunkStart:Number) {
            const chunk = uploadFileparam.slice(chunkStart, chunkStart + chunkSize);
            
            let date = new Date()
            let datelocale = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
            let timelocale = `${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}.${date.getMilliseconds()}`
  
            // filename = `${currentUser.sessionid}-${datelocale}-${timelocale}-${currentUser.sessionuid}`
           
            const chunkFormData = new FormData();
            chunkFormData.append('original_file_name', uploadFileparam.name);
            chunkFormData.append('file', chunk);
            // with .ext
            chunkFormData.append('filename', `${uid}.${ uploadFileparam.name.split('.')[1]}`);
            //chunkFormData.append('filename', `${filename}.${ uploadFileparam.name.split('.')[1]}`);
            // without .ext
            chunkFormData.append('fileid', `${uid}`);
            chunkFormData.append('chunk', currentChunk);
            //chunkFormData.append('sessionuid',currentUser.sessionuid);
            //chunkFormData.append('agent_username',currentUser.sessionid);
            chunkFormData.append('totalChunks', totalChunks);
            chunkFormData.append('date',datelocale)
            chunkFormData.append('time',timelocale)
    
            const xhr = new XMLHttpRequest();
    
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = ((currentChunk * chunkSize + event.loaded) / uploadFileparam.size) * 100;
                    
                    let num=Math.round(percentComplete)
                    if(num<100){
  
                    }
                    //setProgress({uploaded:num,hidden:false})
                    else {
                      //setProgress({uploaded:100,hidden:false})
                      // setTimeout(()=>{
                      //   setProgress({uploaded:0,hidden:true})
                      // },2000)
                    }
                    //progressBarFill.style.width = percentComplete + '%';
                    //progressBarFill.textContent = Math.round(percentComplete) + '%';
                }
            };
    
            xhr.onload = () => {
                if (xhr.status === 200) {
                    currentChunk++;
                    if (currentChunk < totalChunks) {
                        uploadChunk(currentChunk * chunkSize);
                    } else {
                        filesUploaded++;
                        if (filesUploaded === totalFiles) { 
    
                          let ob = {
                            original_file_name:uploadFileparam.name,
                            filename:`${uid}.${uploadFileparam.name.split('.')[1]}`,
                            fileid:uid
                          }
                            //setUploadedFiles([ob])
                            
                            //message.textContent = 'All files successfully uploaded!';
                            //message.style.color = 'green';
                            //progressBar.classList.add('hidden');
                        }
                    }
                } else {
                  //  message.textContent = 'Error uploading files.';
                  //  message.style.color = 'red';
    
                    console.error('Error:', xhr.responseText);
                }
            };
    
            xhr.onerror = () => {
                console.log('Network error or request failed');
            };
    
            //xhr.open('POST', 'http://127.0.0.1:5000/upload');
            xhr.open('POST', `${uploadUrl}`, true);
            //xhr.open('POST', 'http://35.200.139.251/upload', true);
            xhr.send(chunkFormData);
        }
    
        uploadChunk(0);
    }

    const cachedUploadFile = useCallback(uploadFile,[videoUploadUrl])

    function myLittleFunc(arg,url){
        console.log("mylittlefunc",arg,url)
    }

    // useEffect(()=>{
    //     console.log("videoUploadUrl",videoUploadUrl)

    //     if(videoRecordingState.file ===null)
    //         return ;

    //     if(videoRecordingRef.current.uuid !== videoRecordingState.uuid ){
    //         uploadFile(videoRecordingState.file)
    //     }

        
    // },[videoRecordingState,videoUploadUrl])

    
    

    function handleRecordings(stream:MediaStream){
        //let url = 'https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/postfacto-upload-test'
        let url = videoUploadUrl
        let arrayofChunks:any = []
          let mediaRecorder = new MediaRecorder(stream,{
            audioBitsPerSecond:32000
            })
        
        mediaRecorder.ondataavailable = (e)=>{ 
          arrayofChunks.push(e.data)
        }
        
        mediaRecorder.onstop = async ()=>{
        // setMsgLoading(true)
        //let url = `https://asia-south1-utility-range-375005.cloudfunctions.net/save_b64_1`
        //let url = `https://0455-182-72-76-34.ngrok.io`
        console.log(`%c just before vid to blob ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
        let blob = new Blob(arrayofChunks,{type:'video/mpeg'})
        //console.log(mp3Blob)
        //console.log(`%c just after wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
        //sendToServer( mp3Blob,url)
        let myfile = new File([blob], "video.mp4", {type:"video/mpeg"});
        
        //uploadFile(myfile)
        setVideoRecordingState({file:myfile,uuid:uuidv4()})
        arrayofChunks = []
        }
   
        //setTimeout(()=>mediaRecorder.stop(),time)
    
        //if recording true stop after 30 sec
        
        // let timeOutId = setTimeout(()=>{
        //  if(mediaRecorder.state==='recording')
        //  mediaRecorder.stop()
        // },time)
  
        //chk every second 
        // let intervalId = setInterval(()=>{
        //   if(recordingStatus.current ===false){
        //     clearInterval(intervalId) 
        //      clearTimeout(timeOutId)
        //    if(mediaRecorder.state==='recording')
        //     mediaRecorder.stop()
            
        //   }
          
        // },1000)
  
        globalStreamRef.current = mediaRecorder
        mediaRecorder.start()
      }

      useEffect(()=>{
        // setTimeout(()=>{
        //    let mediaRecorder = globalStreamRef.current
        //    mediaRecorder.stop()
        //    console.log('video recording now stopped')
        // },1000*30)
      },[])

      useEffect(()=>{
        // if(myStream ===null || myStream ===false)
        //     return ;
        //console.log("recording acive status",myStream)

        // navigator.mediaDevices.getUserMedia({
        //     video:{
        //         frameRate:{
        //             ideal:60,
        //             min:10
        //         }
        //     },
        //     audio:true
        // }).then(stream=>{
        //     handleRecordings(stream)
        // })
        
       
         
        
  
      },[])

      function stopVideoRecording(){
        let mediaRecorder = globalStreamRef.current
           
            if(mediaRecorder !==null && mediaRecorder.state==='recording'){
              mediaRecorder.stop()
              console.log("after media recorder stop")
            }
      }

    /*
    let Data = {
        color: "#7D11E9",
        content: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
        iconColor: "blue",
        initquery: "what is mutual fund? what is mutual fund? is mutual fund what is mutual fund what is mutual fund",
        match_score: "0.9741857",
        matched_query: "what is a mutual fund",
        query: ['what is a mutual fund'],
        raw_modded_query: "what is mutual fund fund",
        sessionid: ['aff2b452-5014-4132-8d6d-6ccfa8d520b1'],
        similarity_query: "Definition of mutual fund"
    }
    */
    
    useEffect(()=>{
        
        console.log("users render count",++globalRef.current.usersArrRefRenderCount,users,myId)
    },[users,myId])

    useEffect( ()=>{
        if(socket2===null || myId==='' || custId==='')
        return ;

        //console.log("socket2 useEffect execution",socket2)
        function receiveData(data:any){
            let date = new Date()
            console.log(`%c just after data received ${date.toLocaleTimeString()+':'+date.getMilliseconds()}`,'background-color:teal;color:white')
                console.log(data);
                // if(tempRef.current ===data){
                //     //console.log("tempRef current",tempRef.current)
                //     return ;
                // }
                console.log(data.sessionid ===custId,data.sessionid,custId)
    
               if(data.sessionid===custId && isHost===true){

                let d = new Date()
                console.log(`%c just after filter data ${d.toLocaleTimeString()+':'+d.getMilliseconds()}`,'background-color:teal;color:white')
                console.log(data);
            
                //console.log(data)
                if(data?.type==="cues-update") { updateCues(data)  }
                else { handleData(data) }
               // handleAudio(data.speech_bytes,data.file_name)
                }
        }

        socket2.on("receive-data",receiveData)
        return ()=>{
            socket2.off("receive-data",receiveData)
        }
    },[myId,custId,socket2,isHost])

    useEffect(()=>{
        if(myId==='')
        return 
        //https://vitt-jarvis-node-production.up.railway.app/
      let tempSocket =  io('https://vitt-jarvis-node-production.up.railway.app/')
      let tempSocket2 = io('https://vitt-ai-request-broadcaster-production.up.railway.app')

      let tempPeer = new Peer(uuidv4())
      let tempAudioPeer = new Peer(uuidv4())
     // let tempId = uuidv4()

     // let peer = new Peer(myId)
      
      
      setSocket(tempSocket)
      setSocket2(tempSocket2)
      peer2Ref.current = tempPeer
      setPeer2(tempPeer)
      setAudioPeer(tempAudioPeer)
      
      //setMyId(myId)
     // console.log('going to set peer')
     // setPeer(peer)
        return ()=>{
            
            // setSocket(null)
            // setSocket2(null)
            // setPeer(null)
            // setPeer(null)
        }
    },[myId])

    // useEffect(()=>{
    //     isHostRef.current=true
    //     setIsHost(true)
    // },[])
    
    
    
    useEffect(()=>{
        let intervalId = setInterval(()=>{
            
            //after 4 minute if no one is joined refresh
            if(peersArrRef.current.length===0)
            window.location.reload()
            else clearInterval(intervalId)
            
        },1000*60*4)

        let id = setInterval(()=>{

            if(usersFlag.current>0){
            console.log(usersArrRef.current,peersArrRef,peersObjRef)
            setUsers(prev=>[...usersArrRef.current])
            //setUsers(usersArrRef.current)
            usersFlag.current--;
            }

            //removing black screen objects 
            //usersArrRef.current=[...usersArrRef.current.filter((e)=>e.remove ===false)] 


            // if(usersFlag.current>0){
            //     console.log(usersArrRef.current)
            //     setUsers(prev=>
            //         // [...usersArrRef.current]
            //         //increase 
            //         usersArrRef.current.map((e,i)=>{
            //             return e
            //         })
            //         //decrease 

            //     )
            //     usersFlag.current--;
            // }

        },5000)
        return ()=>{
            clearInterval(id)
            clearInterval(intervalId)
        }
    },[])

    useEffect(()=>{
        
        if(myId==='' || roomId==='' || custEmailId===''||name===''||audioPeer===null)
        return;
        
        //variables listed above change only one time 

        console.log('myId is',myId)

        let tempObj = {...initialUser }
            tempObj.id = myId 
            tempObj.isAdmin=isHost 
             
            tempObj.isLoading =false    
            tempObj.roomId = roomId 
            tempObj.custEmailId = custEmailId   
            tempObj.name = name 
            tempObj.audioPeerId = audioPeer.id  

        


        gettingVideoStream().then(videoStream=>{
            
            setMyStream(videoStream)
            
            tempObj.videoStream = videoStream
            tempObj.isCameraAvailable =true 
            
            tempObj.isAudioStream = false
            
        }) .catch(err=>{
           // let tempStream = new MediaStream()
            setMyStream(false)
            tempObj.isCameraAvailable =false
            tempObj.videoStream = false
            console.log("camera permission",err)
        })
        
        gettingAudioStream()
        .then(audioStream=>{
            setMyAudioStream(audioStream)
            tempObj.audioStream = audioStream
            tempObj.isMicrophoneAvailable =true

        })
        .catch(err=>{
           // let tempStream = new MediaStream()
            setMyAudioStream(false)
            tempObj.isMicrophoneAvailable = false 
            tempObj.audioStream = false
            console.log("microphone permission",err)
        })

        usersArrRef.current.push(tempObj)
        let d = new Date()
        console.log("after setting usersArrRef",d.toLocaleTimeString())


        setUsers([tempObj])

        // gettingVideoStream().then(stream=>{
        //     setMyStream(stream)

        //     tempObj.stream=stream
        //     tempObj.isAudioStream = false
        //     usersArrRef.current.push(tempObj)
        //     setUsers([tempObj])
        // }).catch(err=>{
        //     gettingAudioStream().then(audioStream=>{

        //         console.log(audioStream)
        //         setMyStream(audioStream)

        //         tempObj.stream =audioStream
        //         tempObj.isAudioStream = true
        //         usersArrRef.current.push(tempObj)
        //        setUsers([tempObj])
        //     })
        // })
    },[myId,roomId,isHost,custEmailId,name,audioPeer])

    useEffect(()=>{
        //this code is responsible for enable & disable videostream 
        if(socket===null || myStream ===null || myStream===false)
        return ;
        // ||cameraTogglerRef.current===cameraToggle
        //@ts-ignore
        
        //console.log("videostream can be modified")
        let d = new Date()
        console.log("before accessing usersArrRef",d.toLocaleTimeString())
        console.log("accessing video stream",usersArrRef.current[0].videoStream.getVideoTracks()[0].enabled)

        usersArrRef.current[0].videoStream.getVideoTracks()[0].enabled=cameraToggle

        usersArrRef.current[0].cameraStatus = cameraToggle;
        
        socket.emit('camera-toggle-transmitter',{cameraStatus:cameraToggle,id:usersArrRef.current[0].id})
        
        setUsers(prev=>[...usersArrRef.current])

        console.log("myData modified",usersArrRef.current,cameraToggle)
    },[socket,myStream,cameraToggle])

    useEffect(()=>{
        //this code is responsible for enable & disable audioStream 
        if(socket===null || myAudioStream===null ||myAudioStream===false)
        return ;
        //@ts-ignore
        console.log("accessing audio stream",usersArrRef.current[0].audioStream)

        //console.log("audioStream can be modified")
        usersArrRef.current[0].audioStream.getAudioTracks()[0].enabled=microphoneToggle
        
        usersArrRef.current[0].microphoneStatus = microphoneToggle;
        socket.emit('microphone-toggle-transmitter',{microphoneStatus:microphoneToggle,id:usersArrRef.current[0].id})
        setUsers(prev=>[...usersArrRef.current])

        console.log("myData modified",usersArrRef.current)
    },[socket,myAudioStream,microphoneToggle])

    
    useEffect(()=>{
        if(myStream===null||socket===null|| peer2===null || usersArrRef.current.length===0)
        return ;

        //if both have same, nothing changed 
        if(screenSharing === usersArrRef.current[0].isScreenSharingEnabled)
        return ;

        if(screenSharing===false){
            console.log("screen sharing if")
            
            //stop screen sharing
            usersArrRef.current[0].isScreenSharingEnabled=false
            screenStreamRef.current = null

            console.log("usersArrRef inside screen sharing useEffect",usersArrRef.current)
            
            let [first,second,...rest] = usersArrRef.current

            //notify others that u stopped screen share 
            socket.emit('screen-share-end-transmitter',{videoId:second.id,peerId:peer2.id})

            //stopping second track 

            //@ts-ignore
            let tracks = second.stream.getTracks()
            //@ts-ignore
            tracks.forEach(track=>track.stop())
            
            Object.keys(peers2ObjRef.current).map((id:string)=>{
                //close call from peer2ObjRef
                peers2ObjRef.current[id].call.close()
            })
            //do not reset peer2ArrRef beacuse it contains peers2 peerId 

            //reset from peer2ObjRef 
            peers2ObjRef.current={}

            //remove second from usersList 
            usersArrRef.current = [first,...rest]
            setUsers(prev=>[...usersArrRef.current])
        }
        else {
            console.log("screen sharing else")
            //start screen sharing 
            //let tempStream ={}
            gettingScreenStream().then(screenStream=>{
                //@ts-ignore
                screenStreamRef.current = screenStream
    
                //add screen sharing as new user 
                let tempUser = {...initialUser} 
                tempUser.id = uuidv4()
                tempUser.containsScreenStream =true
                tempUser.isCameraAvailable = true 
                tempUser.cameraStatus = true 
                tempUser.isLoading = false
                tempUser.name = usersArrRef.current[0].name 
                tempUser.isScreenSharingEnabled = false 
                tempUser.isMicrophoneAvailable =false
                tempUser.microphoneStatus = false
                
                tempUser.peer2Id = peer2.id
                tempUser.isAudioStream=false

                socket.emit('screen-share-transmitter',{...tempUser,isLoading:true})

                tempUser.stream = screenStream
                tempUser.videoStream = screenStream

                usersArrRef.current[0].isScreenSharingEnabled=true
                //putting this user after first position 
    
                let [first,...restData]= usersArrRef.current 
                usersArrRef.current = [first,tempUser,...restData]



                setUsers(prev=>[...usersArrRef.current])
    
                //send this tempUsr info to every joined peer
                
    
                
                //make connection to every other user 
                setTimeout(()=>{
                    peers2ArrRef.current.map((peerId)=>{
                        ShareScreenToUser(screenStream,peerId)
                    })
                },2000)
                
                
            }).catch(err=>{
                console.log("error at getting screen stream",err)
            })

            
        }
    },[myStream,socket,screenSharing,peer2])

    useEffect(()=>{
        if(peer ===null)
        return ;
        console.log('peer changed',peer)

        
    },[peer])
    
    useEffect(()=>{
        if(socket ===null || myId ==='')
        return ;

        let timeOutId=setTimeout(()=>{
        
        if(socket.connected){
            //console.log('socket connected')
        }
            let options1 ={
                host: "vitt-peerjs-server-production.up.railway.app",
                port:6404,
                path: "/myapp",
                // config :{
                //     iceServers: [
                //         //{ urls: "stun:stun.l.google.com:19302" },
                //         //{urls: "stun:127.0.0.1:5010"}	
                //        { urls: "turn:5776-182-72-76-34.ngrok-free.app", username: "anshtiwari31", credential: "jokanomy-jarvis" }
                //         //{ urls: "turn:0.peerjs.com:3478", username: "peerjs", credential: "peerjsp" }  
                //     ],
                //     sdpSemantics: "unified-plan"
                // }
            }
            
            let tempPeer = new Peer(myId)
            //console.log('my peer',tempPeer,myId)
            //tempPeer.disconnect()
            setPeer(tempPeer)  
            clearTimeout(timeOutId)
            
        },5000)

        return ()=>clearTimeout(timeOutId)
    },[socket,myId])

    function removeUserFromMainPage(userId:string){
        //get peer2 id of user just disconnected 
        console.log("remove user from mainpage triggered")
        let peer2Id:null|string=null
        let audioPeerId:null|string=null

            usersArrRef.current.map((e)=>{
                if(e.id===userId){
                peer2Id=e.peer2Id
                audioPeerId=e.audioPeerId
                }
            })
            
            //disconnect video call
            if(peersObjRef.current.hasOwnProperty(userId)){
            peersObjRef.current[userId].call.close()
            delete peersObjRef.current[userId]
            }

            //disconnect audio call
            if(audioPeersObjRef.current.hasOwnProperty(audioPeerId)){
                audioPeersObjRef.current[audioPeerId].call.close()
                delete audioPeersObjRef.current[audioPeerId]
            }

            // disconnect screen sharing if happening 
            if(peers2ObjRef.current.hasOwnProperty(peer2Id)){
                //@ts-ignore
            peers2ObjRef.current[peer2Id].call.close()
            //@ts-ignore
            delete peers2ObjRef.current[peer2Id]
            }

            //need to modify peersArrRef
            removeUserFromPeersArr(userId)
            //need to modify peers2ArrRef
            //@ts-ignore
            removeUserFromPeers2Arr(peer2Id)

            //@ts-ignore
            removeUserFromAudioPeersArr(audioPeerId)

            //modifying usersArrRef by removing screen Sharing Video
            //modifying usersArrRef by removing video  
            usersArrRef.current= usersArrRef.current.filter((e,i)=>e.peer2Id !== peer2Id)
            setUsers(prev=>[...usersArrRef.current])
            console.log("users changed due to user left",userId,peer2Id,usersArrRef)
            
    }
    useEffect(()=>{
        if(socket === null || myStream===null ||myId==='')
        return ;

        //console.log('user-connected effect')
        //this runs for first time 
       //socket.on('connect',()=>{console.log('1st connect triggered');console.log('connected')})

       function connected(){
            
            socket.emit('connected',myId)
         if(firstTimeConnectRef.current === true){
            console.log('socket 1st connect triggered');   
            
        }
         else {
         console.log('socket 2nd connect triggered');
         socket.emit('join-room',roomId,myId)
        }
         
       }

       function disconnect(){
            console.log('disconnected')
       }
       function userDisconnect(userId:string){
        
            removeUserFromMainPage(userId)   
             
       }
       socket.on('connect',connected)

        socket.on('disconnect',disconnect)
        
        socket.on('user-disconnected',userDisconnect)

        return ()=>{
            socket.off('connect',connected)
            socket.off('disconnect',disconnect)
            socket.off('user-disconnected',userDisconnect)
        }
    },[socket,myStream,myId])

    useEffect(()=>{
        if(socket2 === null || myStream===null ||myId==='')
        return ;

        //console.log('user-connected effect')
        //this runs for first time 
       //socket.on('connect',()=>{console.log('1st connect triggered');console.log('connected')})

       function connected(){
            
            socket2.emit('connected socket2',myId)
         if(globalRef.current.socket2FirstTimeConnect === true){
            console.log('socket2 1st connect triggered');   
            
        }
         else {
         console.log('socket2 2nd connect triggered');
         socket2.emit('join-room',roomId,myId)
        }
         
       }

       function disconnect(){
            console.log('socket 2 disconnected')
       }
       function userDisconnect(userId:string){
            console.log("socket 2 disconnect")
            //    
             
       }
       socket2.on('connect',connected)

        socket2.on('disconnect',disconnect)
        
        socket2.on('user-disconnected',userDisconnect)

        return ()=>{
            socket2.off('connect',connected)
            socket2.off('disconnect',disconnect)
            socket2.off('user-disconnected',userDisconnect)
        }
    },[socket2,myStream,myId])

    useEffect(()=>{
        if(myStream===null || isHost===true)
        return ;

        //sending stream for transcription 

        let intervalId:number
        //let url3 = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'
            
        // sendStreamToServer(myStream,usersArrRef.current[0],3000,clientTranscriptionUrl)
        //     // triggers after 1.5sec
        // intervalId =setInterval(()=>{
                
        //     sendStreamToServer(myStream,usersArrRef.current[0],3000,clientTranscriptionUrl)
        // },1500)
        
        return ()=>{
           if(intervalId) clearInterval(intervalId)
        }
    },[myStream,isHost])

    useEffect(()=>{
        if(myStream ===null || isHost===false)
        return ;

        //sending admin stream 
        
        let intervalId:number

        // sendStreamToServer(myStream,usersArrRef.current[0],4000,adminUrl)

        // intervalId= setInterval(()=>{ 
        // console.log(`sending admin stream`)
        
        // //let url = `https://19vnck5aw8.execute-api.ap-south-1.amazonaws.com/Prod/save-adminaudio`
        // sendStreamToServer(myStream,usersArrRef.current[0],4000,adminUrl)
        // },4000)
        
        return ()=>{
            if(intervalId) clearInterval(intervalId)
        }
    },[myStream,isHost])

    useEffect(()=>{
        if(myStream===null ||peer===null)
        return;

    },[myStream,peer])


    useEffect(()=>{
        if(peer ===null)
        return ;

        let intervalId = setTimeout(()=>{
            if(peer.disconnected===false){
               // console.log("join-room-first-time")
                firstTimeConnectRef.current = false;
                socket.emit('join-room',roomId,myId);
                clearInterval(intervalId);
                
            }
        },3000)
        return ()=>clearInterval(intervalId)
    },[peer])

    useEffect(()=>{

        if(peer===null)
        return ;

        let timeoutId:any =null 

        timeoutId= setTimeout(() => {
            // if(isHost===true){
            
            //     peer?.disconnect()
            // //@ts-ignore
            // console.log("manually disconnection triggers",peer.disconnected,peer.destroyed)
            // }
        }, 45000);


        return ()=>{
            clearTimeout(timeoutId)
        }
    },[peer,isHost])

    function isUserAvailable(userId:string){
        let flag = false ;
        for(let i=0;i<peersArrRef.current.length;i++){
            if(peersArrRef.current[i]===userId){
                flag = true; 
                break;
            }
        }
        return flag;
    }

    function removeUserFromPeersArr(userId:string){
        peersArrRef.current=peersArrRef.current.filter(id=>id !==userId)
    }
    function removeUserFromPeers2Arr(userId:string){
        peers2ArrRef.current=peers2ArrRef.current.filter(id=>id !==userId)
    }
    function removeUserFromAudioPeersArr(userId:string){
        audioPeersArrRef.current=audioPeersArrRef.current.filter(id=>id !==userId)
    }
    async function ShareScreenToUser(stream:MediaStream,newUserId:string){
        //console.log(socket,stream,usersArrRef.current)

        //socket.emit('connected-user-data',{...usersArrRef.current[0],toPeer:newUserId,isLoading:true})
            let intervalId:number

            let call = peer2?.call(newUserId,stream);
            let count = 0
            if(!call){
                console.log("while triggers inside shareScreen",++count)
                call = peer2?.call(newUserId,stream)
            }
           console.log('after-a-loop-made-in-shareScreen',call,newUserId,stream)
           
            try{
            //if call undefined 
//            if(peers2ArrRef.current.includes(call.peer) ===false)
//            peers2ArrRef.current.push(call.peer)

//@ts-ignore
            peers2ObjRef.current[call.peer] = {'call':call}
            
            call?.on('close',()=>{
                console.log('close event fired 1 inside shareScreen fn')
                //@ts-ignore
                // let tempUsers= usersArrRef.current.filter((e,i)=>e.id !== call.peer)
                // // let tempUsers= usersArrRef.current.map((e,i)=>{
                // //     if(e.id === call.peer){
                // //         e.remove = true ;
                // //         e.isLoading = true; 
                // //         return e;
                // //     }else return e

                // // })
                
                // usersArrRef.current = tempUsers
                // usersFlag.current = 2

                // //@ts-ignore
                // removeUserFromPeers2Arr(call.peer)
                // //@ts-ignore
                // delete peers2ObjRef.current[call.peer]

                // clearInterval(intervalId)

            })

            }catch(err){
                console.log(err)
            }
    }
    async function sendVideoToNewUser(stream:MediaStream,newUserId:string){
        console.log(socket,stream,usersArrRef.current)

        //socket.emit('connected-user-data',{...usersArrRef.current[0],toPeer:newUserId,isLoading:true})
            let intervalId:number

            let call = peer?.call(newUserId,stream);
            let count = 0
            if(!call){
                console.log("while triggers",++count)
                call = peer?.call(newUserId,stream)
            }
           //console.log('after-a-while-loop-made',call,newUserId,stream)
           
            try{
            //if call undefined 
            
           
            call?.on('close',()=>{
                console.log('close event fired 1')
                //@ts-ignore
                // let tempUsers= usersArrRef.current.filter((e,i)=>e.id !== call.peer)
                // // let tempUsers= usersArrRef.current.map((e,i)=>{
                // //     if(e.id === call.peer){
                // //         e.remove = true ;
                // //         e.isLoading = true; 
                // //         return e;
                // //     }else return e

                // // })
                
                // usersArrRef.current = tempUsers
                // usersFlag.current = 2

                // //@ts-ignore
                // removeUserFromPeersArr(call.peer)
                // //@ts-ignore
                // delete peersObjRef.current[call.peer]

                // clearInterval(intervalId)

            })

            }catch(err){
                console.log(err)
            }
    }
    async function sendAudioToNewUser(stream:MediaStream,newUserId:string){
        console.log("send audio to new user",socket,stream,usersArrRef.current)

        //socket.emit('connected-user-data',{...usersArrRef.current[0],toPeer:newUserId,isLoading:true})
            let intervalId:number

            let call = audioPeer?.call(newUserId,stream);
            let count = 0
            if(!call){
                console.log("while triggers",++count)
                call = audioPeer?.call(newUserId,stream)
            }
           //console.log('after-a-while-loop-made',call,newUserId,stream)
           
            try{
            //if call undefined 
            
           
            call?.on('close',()=>{
                console.log('close event fired 1')
                //@ts-ignore
                // let tempUsers= usersArrRef.current.filter((e,i)=>e.id !== call.peer)
                // // let tempUsers= usersArrRef.current.map((e,i)=>{
                // //     if(e.id === call.peer){
                // //         e.remove = true ;
                // //         e.isLoading = true; 
                // //         return e;
                // //     }else return e

                // // })
                
                // usersArrRef.current = tempUsers
                // usersFlag.current = 2

                // //@ts-ignore
                // removeUserFromPeersArr(call.peer)
                // //@ts-ignore
                // delete peersObjRef.current[call.peer]

                // clearInterval(intervalId)

            })

            }catch(err){
                console.log(err)
            }
    }

    useEffect(()=>{
        if(socket === null || myStream===null||myAudioStream===null ||peer===null || peer2===null || audioPeer===null)
        return ;
       
        function newUser(userId:string){
            console.log("new user triggered")
            if(peersArrRef.current.includes(userId)===true)
            return ;

            peersArrRef.current.push(userId)

            console.log('user-connected',userId)
            //send my stream to this user 
            
            //@ts-ignore
            console.log(users)

           //send this data to new user before making rtc connection
           //@ts-ignore
           socket.emit('connected-user-data',{...usersArrRef.current[0],stream:null,videoStream:null,audioStream:null,toPeer:userId,peer2Id:peer2.id,audioPeerId:audioPeer.id,isLoading:true,count:1})
         
           console.log('user-connected-emitted-socket',userId)
           //@ts-ignore
           // connectToNewUser(myStream,userId)
        }

        function removeUser(){}

        function userMovedToLeavePage(userId:string){
            console.log('user to leave triggered',userId)
            removeUserFromMainPage(userId)
        }
        function sendUserData(data:any){
            console.log("send user triggered",data)
            if(data.count!==0){
                //new user data 
                console.log(data,data.count!==0)
                //@ts-ignore
                socket.emit('connected-user-data',{...usersArrRef.current[0],stream:null,videoStream:null,audioStream:null,toPeer:data.id,peer2Id:peer2.id,audioPeerId:audioPeer.id,isLoading:true,count:--data.count})
                
                let timeoutId = setTimeout(()=>{
                    //@ts-ignore

                    sendVideoToNewUser(myStream,data.id)
                    console.log("before exec send audio",myAudioStream)
                    sendAudioToNewUser(myAudioStream,data.audioPeerId)
                    clearTimeout(timeoutId)
                },2500)
            }else{
                //@ts-ignore
                
                socket.emit('user-chat-transmitter',{chats:msgArrRef.current,toPeer:data.id,from:id})
                //@ts-ignore
                sendVideoToNewUser(myStream,data.id)
                console.log("before exec send audio",myAudioStream)
                sendAudioToNewUser(myAudioStream,data.audioPeerId)
                //share screen if enabled
                if(usersArrRef.current[0].isScreenSharingEnabled===true){
                    socket.emit('single-screen-share-transmitter',{...usersArrRef.current[1],toPeer:data.id,isLoading:true})
                    //@ts-ignore
                    console.log("before exec ShareScreenToUser",screenStreamRef,data.peer2Id)
                    setTimeout(()=>{
                        //@ts-ignore
                        ShareScreenToUser(screenStreamRef.current,data.peer2Id)
                    },2000)
                    
                } 
                
            }
                peers2ArrRef.current.push(data.peer2Id) 
                audioPeersArrRef.current.push(data.audioPeerId)

                if(peersArrRef.current.includes(data.id)===false)
                peersArrRef.current.push(data.id) 
                
                usersArrRef.current.push(data) 
                console.log('connected-usr-data',data) 
                
                setUsers(prev=>[...prev,data]) 
        }
        function executeBeforeTabClose(e:Event){
           
        }
        function cameraToggle(data:any){
            console.log("camera toggle",data)


            usersArrRef.current = usersArrRef.current.map((e:any,i:number)=>{
                if(e.id===data.id){
                    e.cameraStatus = data.cameraStatus
                }
                    return e
                }) 
            setUsers(prev=>[...usersArrRef.current])
            console.log('new data',usersArrRef.current)
        }
        function microphoneToggle(data:any){
            console.log("microphone toggle",data)

            usersArrRef.current = usersArrRef.current.map((e:any,i:number)=>{
                if(e.id===data.id){
                    e.microphoneStatus = data.microphoneStatus
                }
                    return e
                }) 
            
            setUsers(prev=>[...usersArrRef.current])
            console.log('new data',usersArrRef.current)
        }
        function chatsReceiver(data:any){
            //console.log("chats receiver",data)

            //@ts-ignore
            msgArrRef.current = [...data.chats,...msgArrRef.current]
            setMsg(prev=>[...msgArrRef.current])
            socket.off('user-chat-receiver',chatsReceiver)
        }
        function screenShareDataReceiver(data:any){
            console.log("screen share data receiver",data)

            //create new user in users 
            //peers2ArrRef.current.push(data.id)
            usersArrRef.current.push(data)
            setUsers(prev=>[...usersArrRef.current])
            
        }
        function stopScreenReceiving(data:any){
            //remove screen sharing user 
           // removeUserFromPeers2Arr(id)

            //remove screen from peersObj2Ref 

            if(usersArrRef.current[0].isScreenSharingEnabled===false && peers2ObjRef.current.hasOwnProperty(data.peerId)){
                // if my screen sharing is false then close the connection with other users 
            //    peers2ObjRef.current[data.peerId].call.close()
            //    delete peers2ObjRef.current[data.peerId]
            }
           
            console.log('from inside stopScreenReceiving',peers2ObjRef,peers2ArrRef)
            //modify usersArrRef 
            usersArrRef.current = usersArrRef.current.filter(e=>e.id!==data.videoId)
            //applied change immediately 
            setUsers(prev=>[...usersArrRef.current])
        }
        function singleMsgReceiver(data:any){
            console.log("msg receiver",data)
            //@ts-ignore
            msgArrRef.current = [...msgArrRef.current,data]
            setMsg(prev=>[...msgArrRef.current])
        }
        function cueLoadingReceiver(data:any){
            setCueLoading(data.toggle)
        }
        socket.on('receive-msg',singleMsgReceiver)
        socket.on('tab-close-remove-video',removeUser)
        socket.on('to-leave-page-receiver',userMovedToLeavePage)
        socket.on('receive-connected-user-data',sendUserData)
        socket.on('user-connected',newUser)
        socket.on('camera-toggle-receiver',cameraToggle)
        socket.on('microphone-toggle-receiver',microphoneToggle)
        socket.on('user-chat-receiver',chatsReceiver)
        socket.on('screen-share-end-receiver',stopScreenReceiving)
        socket.on('screen-share-receiver',screenShareDataReceiver)
        socket.on('single-screen-share-receiver',screenShareDataReceiver)
        socket.on('cue-loading-receiver',cueLoadingReceiver)
        let id= window.addEventListener('beforeunload',executeBeforeTabClose,{capture:true})

        return ()=>{
            socket.off('user-connected',newUser)
            socket.off('receive-msg',singleMsgReceiver)
            socket.off('to-leave-page-receiver',userMovedToLeavePage)
            window.removeEventListener('beforeunload',executeBeforeTabClose,{capture:true})
            socket.off('tab-close-remove-video',removeUser)
            socket.off('receive-connected-user-data',sendUserData)
            socket.off('camera-toggle-receiver',cameraToggle)
            socket.off('microphone-toggle-receiver',microphoneToggle)
            socket.off('user-chat-receiver',chatsReceiver)
            socket.off('screen-share-end-receiver',stopScreenReceiving)
            socket.off('screen-share-receiver',screenShareDataReceiver)
            socket.off('cue-loading-receiver',cueLoadingReceiver)
            socket.off('single-screen-share-receiver',screenShareDataReceiver)
        }
    },[socket,myStream,myAudioStream,peer,peer2,audioPeer])

    useEffect(()=>{
        if(peer===null ||peer2===null ||audioPeer===null ||socket === null || myId==='' || roomId==='' ||myStream===null)
        return ;
        

        console.log('triggering peer fn',peer,myStream)
        let id:number;
        
        function screenSharingReply(call:any){
            console.log("screen sharing replying trigerred")
           // socket.emit('connected-user-data',{...usersArrRef.current[0],toPeer:call.peer,isLoading:true})
            let intervalId:number 
            call.answer()
           // console.log('after-a-call-answered 2',call,myStream)

            call.on('stream',(userVideoStream:MediaStream)=>{
                //@ts-ignore
                
                console.log('2nd getting screen screen stream ',userVideoStream,call.peer)

                //peers2ObjRef.current[call.peer] = {'call':call}
                
                for(let i=0;i<usersArrRef.current.length;i++){

                    if(usersArrRef.current[i].peer2Id===call.peer && usersArrRef.current[i].containsScreenStream===true){
                    usersArrRef.current[i] = {...usersArrRef.current[i],stream:userVideoStream,videoStream:userVideoStream,isLoading:false}
                    
                    usersFlag.current = 2   
                }}

                console.log('peersArray2',isUserAvailable(call.peer),call.peer,peers2ArrRef.current,peers2ObjRef.current,call.peer) 
            })

            call.on('close',()=>{
                console.log('close event fired 2')
                
                //modifying users

                // let tempUsers= usersArrRef.current.filter((e,i)=>e.id !== call.peer)
                // usersArrRef.current = tempUsers
                // usersFlag.current = 2

                //removing from peersArrRef
                // removeUserFromPeersArr(call.peer)
                // removeUserFromPeers2Arr(call.peer)

                //removing call from peersObjRef
                // delete peersObjRef.current[call.peer]
                // delete peers2ObjRef.current[call.peer]

                
            })
        }
        function videoReply(call:any){
            console.log("video replying trigerred")
           // socket.emit('connected-user-data',{...usersArrRef.current[0],toPeer:call.peer,isLoading:true})
            let intervalId:number 
            call.answer()
           // console.log('after-a-call-answered',call,myStream)

            call.on('stream',(userVideoStream:MediaStream)=>{
                //@ts-ignore
                
                console.log('2nd getting video stream',userVideoStream,call.peer)
   
                //if data is present at peersArrRef then is normal video or audio stream
                    peersObjRef.current[call.peer] = {'call':call}
               
                //if data is present at peers2ArrRef then it is screen sharing connection 
               

                for(let i=0;i<usersArrRef.current.length;i++){

                    if(usersArrRef.current[i].id===call.peer){
                    usersArrRef.current[i] = {...usersArrRef.current[i],stream:userVideoStream,videoStream:userVideoStream,isLoading:false}
                    
                    usersFlag.current = 2   
                }}

                console.log('peersArray2',isUserAvailable(call.peer),call.peer,peersArrRef.current,peersObjRef.current,call.peer) 
            })

            call.on('close',()=>{
                console.log('close event fired 2')
                
                //modifying users
                // let tempUsers= usersArrRef.current.filter((e,i)=>e.id !== call.peer)
                // usersArrRef.current = tempUsers
                // usersFlag.current = 2

                // //removing from peersArrRef
                // removeUserFromPeersArr(call.peer)
                // removeUserFromPeers2Arr(call.peer)

                // //removing call from peersObjRef
                // delete peersObjRef.current[call.peer]
                // delete peers2ObjRef.current[call.peer]

                if(intervalId) clearInterval(intervalId)
            })

        }
        function audioReply(call:any){
            console.log("audio replying trigerred")
            let intervalId:number 
            call.answer()
           // console.log('after-a-call-answered',call,myStream)

            call.on('stream',(userAudioStream:MediaStream)=>{
                //@ts-ignore
                
                console.log('2nd getting audio stream',userAudioStream,call.peer)
   
                //if data is present at peersArrRef then is normal video or audio stream
                    audioPeersObjRef.current[call.peer] = {'call':call}
               
                //if data is present at peers2ArrRef then it is screen sharing connection 
               

                for(let i=0;i<usersArrRef.current.length;i++){

                    if(usersArrRef.current[i].audioPeerId===call.peer){
                    usersArrRef.current[i] = {...usersArrRef.current[i],audioStream:userAudioStream,isLoading:false}
                    
                    usersFlag.current = 2   
                }}

                console.log('audioPeersArrRef',isUserAvailable(call.peer),call.peer,peersArrRef.current,peersObjRef.current,call.peer) 
            })

            call.on('close',()=>{
                console.log('close event fired 2')
                
               

                if(intervalId) clearInterval(intervalId)
            })
        }
        console.log('peer open useEffect')
        function onOpen(){
            console.log('peer open triggered')
            // setTimeout(()=>{
            //     firstTimeConnectRef.current = false;
            //     socket.emit('join-room',roomId,myId);
            // },5000)
            
        }
        
        function onConnection(conn:any){
            console.log('conn opened')
        }

        peer.on('call',videoReply)
        peer2.on('call',screenSharingReply)
        audioPeer.on('call',audioReply)
        peer.on('open',onOpen)
        peer.on("connection",onConnection);
        
        // setTimeout(()=>{
            
        // },5000)
        return ()=>{
            peer.off('call',videoReply)
            peer2.off('call',screenSharingReply)
            audioPeer.off('call',audioReply)
            peer.off('open',onOpen)
            peer.off('connection',onConnection)
            
        }
    },[peer,peer2,audioPeer,socket,roomId,myId,myStream,myAudioStream])


    //vad code here 
    function sendVadStreamToServer(stream:MediaStream,data:any,url:string,time:number){
        let mediaStream =new MediaStream()
        //medRec = mediaStream
        mediaStream.addTrack(stream.getAudioTracks()[0])
        try{
        let arrayofChunks:Blob[] = []
        let mediaRecorder = new MediaRecorder(mediaStream,{
            audioBitsPerSecond:32000
        })
        mediaRecorder.ondataavailable = (e)=>{
            
            arrayofChunks.push(e.data)
        }
        mediaRecorder.onstop=()=>{
           // console.log('media recorder stop triggered')
          //  adminMediaRecorderStatus.current = false
            downsampleToWav(new Blob(arrayofChunks,{type:"audio/ogg"}),(buffer:ArrayBuffer)=>{
            const mp3Buffer = encodeMp3(buffer)
            let blob = new Blob(mp3Buffer,{type:"audio/mp3"});
            console.log('send to server',data)
            sendToServer(blob,url,data)
            arrayofChunks=[]
            //@ts-ignore 
            blob = null
            })
        }

        let timeOutId:any=null
        let intervalId:any=null

        //stop after T time 
        timeOutId =setTimeout(()=>{
           // console.log('state mediaRecorder inside timeout',mediaRecorder.state,intervalId,timeOutId)
            clearInterval(intervalId)
            clearTimeout(timeOutId)
            if(mediaRecorder.state==='recording')
            mediaRecorder.stop()
            

        },time)

        //check at specific interval & stop immediately
        intervalId = setInterval(()=>{
           if(vadFlag.current===false){
           // console.log('state mediaRecorder inside interval',mediaRecorder.state,intervalId,timeOutId)
                clearTimeout(timeOutId)
                clearInterval(intervalId)   
                if(mediaRecorder.state==='recording')
                mediaRecorder.stop()
               
               adminMediaRecorderStatus.current===false
           }
        },150)

        mediaRecorder.start()        
        console.log('state mediaRecorder',mediaRecorder.state)
        // if(mediaRecorder.state==='recording'){
            
        // }
        }catch(e){
            console.log(e)
            return;
        }

       
    }

    function startMediaRecorder(stream:MediaStream,time:number){
        //let url = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'
        let url = adminUrl
         let arrayofChunks:any = []
           let mediaRecorder = new MediaRecorder(stream,{
             audioBitsPerSecond:32000
             })
         
         mediaRecorder.ondataavailable = (e)=>{ 
           arrayofChunks.push(e.data)
         }
         
         mediaRecorder.onstop = async ()=>{
          
            setCueLoading(true)

         //let url = `https://asia-south1-utility-range-375005.cloudfunctions.net/save_b64_1`
         //let url = `https://0455-182-72-76-34.ngrok.io`
         console.log(`%c just before wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
         let mp3Blob = await WavToMp3(new Blob(arrayofChunks,{type:'audio/wav'}))
         //console.log(mp3Blob)
         console.log(`%c just after wav to mp3 ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
         sendToServer( mp3Blob,url,{...usersArrRef.current[0],init:false})
          arrayofChunks = []
         }
    
         //setTimeout(()=>mediaRecorder.stop(),time)
     
         //if recording true stop after 30 sec
         let timeOutId = setTimeout(()=>{
          if(mediaRecorder.state==='recording')
          mediaRecorder.stop()
         },time)
         //chk every second 
         let intervalId = setInterval(()=>{
           if(globalRef.current.recordingStatus===false){
             clearInterval(intervalId) 
              clearTimeout(timeOutId)
            if(mediaRecorder.state==='recording')
             mediaRecorder.stop()
             
           }
           
         },1000)
         mediaRecorder.start()
         
       }
    
       useEffect(()=>{
        //recordingStatus.current = recordingOn
    
        let id:number;
        if(recordingOn ===true && microphoneToggle===true && users.length>0 && users[0].isMicrophoneAvailable){
            console.log(`%c vad triggered ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
          //setMsg([]);
          navigator.mediaDevices.getUserMedia({
            audio:true
          }).then(stream=>{
           startMediaRecorder(stream,20000)
           //@ts-ignore
            id = setInterval(()=>{
              console.log('recording is ',recordingOn)
              startMediaRecorder(stream,20000)
            },20000)
          })
    
         // if(recordingOn ===true) 
        }
        return()=>clearInterval(id)
      },[recordingOn,microphoneToggle,users])   

    useEffect(()=>{
        
        if(myAudioStream===null ||users.length===0 || socket===null )
        return ;
        // if(vadEffectRender.current>0)
        // return ;
        vadEffectRender.current++
        //@ts-ignore
        let myVad=null;
        async function VAD(cb1:CallableFunction,cb2:CallableFunction){
            // return new Promise(async (resolve,reject)=>{
            //     //@ts-ignore
            //     const myvad = await vad.MicVAD.new({
            //       onSpeechStart: cb1,
            //       onSpeechEnd: cb2
            //     })
            //     resolve(myvad)
            //     reject(myvad)
            // })

            //@ts-ignore

            //send this only once 
            
            sendToServer(new Blob([]),adminUrl,{...usersArrRef.current[0],init:true})

            const myvad = await vad.MicVAD.new({
                onSpeechStart: cb1,
                onSpeechEnd: cb2
              })
             // myvad.start()
            globalRef.current.myVad =myvad;
          }


      let stop
      let medRec =null
      let flag=false ;
    let start2IntervalId 
    let stop2TimeoutId 
      function getWavBytes(buffer:any, options:any) {
        const type = options.isFloat ? Float32Array : Uint16Array
        const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT
      
        const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }))
        const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);
      
        // prepend header, then add pcmBytes
        wavBytes.set(headerBytes, 0)
        wavBytes.set(new Uint8Array(buffer), headerBytes.length)
      
        return wavBytes
      }
      

      function getWavHeader(options:any) {
        const numFrames =      options.numFrames
        const numChannels =    options.numChannels || 2
        const sampleRate =     options.sampleRate || 44100
        const bytesPerSample = options.isFloat? 4 : 2
        const format =         options.isFloat? 3 : 1
      
        const blockAlign = numChannels * bytesPerSample
        const byteRate = sampleRate * blockAlign
        const dataSize = numFrames * blockAlign
      
        const buffer = new ArrayBuffer(44)
        const dv = new DataView(buffer)
      
        let p = 0
      
        function writeString(s:string) {
          for (let i = 0; i < s.length; i++) {
            dv.setUint8(p + i, s.charCodeAt(i))
          }
          p += s.length
        }
      
        function writeUint32(d:any) {
          dv.setUint32(p, d, true)
          p += 4
        }
      
        function writeUint16(d:any) {
          dv.setUint16(p, d, true)
          p += 2
        }
      
        writeString('RIFF')              // ChunkID
        writeUint32(dataSize + 36)       // ChunkSize
        writeString('WAVE')              // Format
        writeString('fmt ')              // Subchunk1ID
        writeUint32(16)                  // Subchunk1Size
        writeUint16(format)              // AudioFormat https://i.stack.imgur.com/BuSmb.png
        writeUint16(numChannels)         // NumChannels
        writeUint32(sampleRate)          // SampleRate
        writeUint32(byteRate)            // ByteRate
        writeUint16(blockAlign)          // BlockAlign
        writeUint16(bytesPerSample * 8)  // BitsPerSample
        writeString('data')              // Subchunk2ID
        writeUint32(dataSize)            // Subchunk2Size
      
        return new Uint8Array(buffer)
      }

      function start(){
        let date = new Date()
        console.log(`%c vad started ${date.toLocaleTimeString()+':'+date.getMilliseconds()}`,'background-color:teal;color:white')

        if(adminMediaRecorderStatus.current===false){
            console.log("caling the function")
           // sendVadStreamToServer(myStream,usersArrRef.current[0],adminUrl,4000)
        }
        vadFlag.current=true
      }
      function stop1(audio:any){
        let date = new Date()
        console.log(`%c vad stopped ${date.toLocaleTimeString()+':'+date.getMilliseconds()}`,'background-color:teal;color:white')
        let date2 = new Date()
        console.log(`%c  internal processing start ${date2.toLocaleTimeString()+':'+date2.getMilliseconds()}`,'background-color:teal;color:white')
        //@ts-ignore
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createBufferSource();

        const myArrayBuffer = audioCtx.createBuffer(
            1,
            audio.length,
            16000,
          );

        let nowBuffering;
        for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
            // This gives us the actual array that contains the data
            nowBuffering = myArrayBuffer.getChannelData(channel);
          //  console.log('array buffer length',myArrayBuffer.length)
            for (let i = 0; i < myArrayBuffer.length; i++) {
              // Math.random() is in [0; 1.0]
              // audio needs to be in [-1.0; 1.0]
              nowBuffering[i] = audio[i]*2;
            }
          }

        // set the buffer in the AudioBufferSourceNode
        //source.buffer = myArrayBuffer;
        
        // connect the AudioBufferSourceNode to the
        // destination so we can hear the sound
        //source.connect(audioCtx.destination);

        //start the source playing
        //console.log("ctx stream source",)
        
        //source.start();

        //let stream= audioCtx.createMediaStreamDestination()
        // stream
        
        const ch1Data = myArrayBuffer.getChannelData(0)
        const floatArr = new Float32Array(ch1Data.length)
        
        console.log("duration",myArrayBuffer.duration)
        const wavBytes = getWavBytes(nowBuffering?.buffer, {
                isFloat: true,       // floating point or 16-bit integer
                numChannels: 1,
                sampleRate: 16000,
            })
        const wavBlob = new Blob([wavBytes], { type: 'audio/ogg' })
        
        

        downsampleToWav(wavBlob,(buffer:ArrayBuffer)=>{
            let date = new Date()
            console.log(`%c processing complete ${date.toLocaleTimeString()+':'+date.getMilliseconds()}`,'background-color:teal;color:white')

            const mp3Buffer = encodeMp3(buffer)
            let blob = new Blob(mp3Buffer,{type:"audio/mp3"});
            
            // cue logo will appear at admin end
            if(peersArrRef.current.length>0)
            socket.emit('cue-loading-transmitter',{toPeer:peersArrRef.current[0],toggle:true})

            
            sendToServer(blob,adminUrl,{...usersArrRef.current[0],init:false})
        })

        

        // console.log('myArray buffer',myArrayBuffer,myArrayBuffer.length)

        // let fA = new Float32Array(audio)
        // console.log('bufff',audio.buffer)
        // let arrBuf = new ArrayBuffer(audio)
        // console.log('arrBuf',arrBuf)
        // let blob = new Blob([fA.buffer],{type:'audio/wav'})
        // console.log('blob',URL.createObjectURL(blob))
        
        
        //let stream= audioCtx.createMediaStreamDestination()
        //console.log('context stream',stream.stream.getAudioTracks()[0])

        // let mediaRec = new MediaRecorder(audioCtx.createMediaStreamDestination())
        // medRec.

        // sendToServer(blob,adminUrl,usersArrRef.current[0])
       // vadFlag.current=false
      }

      function start2(){

        // if(globalRef.current.recordingStatus===true )
        // return ;

        //console.log(`%c vad triggered ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
        globalRef.current.recordingStatus=true 
        setRecordingOn(true)
        // navigator.mediaDevices.getUserMedia({
        //     audio:true
        //   }).then(stream=>{
        //    startMediaRecorder(stream,10000)
        //    //@ts-ignore
        //     start2IntervalId = setInterval(()=>{
        //       console.log('start2 is interval triggered')
        //       startMediaRecorder(stream,10000)
        //     },10000)
        //   })
      }
      function stop2(){
            
        stop2TimeoutId=setTimeout(()=>{
            console.log(`%c audio stopped ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
            start2IntervalId ? clearInterval(start2IntervalId):null
            globalRef.current.recordingStatus=false
            setRecordingOn(false)
        },100)
        
      }
     
      //add isHost === false for client specific use-cases
      if(users[0].isMicrophoneAvailable && microphoneToggle){
        //console.log("myvad if",globalRef.current.myVad,globalRef.current.myVad?.listening,microphoneToggle)
        

        if(globalRef.current.myVad ===null){
            VAD(start2,stop2)
        }else{
            globalRef.current.myVad?.start()
        }
        
      }else{
        // myVad=null
        
        globalRef.current.myVad?.pause()
        // after pausing vad stop2 is not firing
        stop2()
       // console.log("myvad else",globalRef.current.myVad,globalRef.current.myVad?.listening,microphoneToggle)
      }

      return ()=>{
        start2IntervalId? clearInterval(start2IntervalId):null
        stop2TimeoutId? clearTimeout(stop2TimeoutId):null
        
      }
    },[isHost,myAudioStream,users,socket,adminUrl])

    let values = {
        validUrl,setValidUrl,
        myId,setMyId,
        socket,setSocket,
        socket2,setSocket2,
        peersObjRef,peers2ObjRef,
        peersArrRef,peers2ArrRef,
        peer,setPeer,
        peer2,setPeer2,
        usersArrRef,
        users,setUsers,
        myStream,setMyStream,
        name,setName,
        cameraToggle,setCameraToggle,
        microphoneToggle,setMicroPhoneToggle,
        msg,setMsg,
        cueLoading,setCueLoading,
        msgArrRef,
        screenSharing,setScreenSharing,
        largeVideoRef,
        largeVideo,setLargeVideo,
        custId,setCustId,
        adminUrl,setAdminUrl,
        videoUploadUrl,setVideoUploadUrl,stopVideoRecording,
    }   

    return (
        //@ts-ignore
    <Context.Provider value={values}>
        {children}
    </Context.Provider>
  )
}
