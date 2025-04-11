
import { io } from "socket.io-client";
import { PostReq } from "./requests";
// const socket = io("wss://recruitonodesocket.vitti.insure"); 
// const socket2=io("wss://recruito.vitti.insure");
//funcationalties that are absoluetly feels redundant aahgh 

export function getTimestamp(){
     const now = new Date();

    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0"); 
    const day = String(now.getUTCDate()).padStart(2, "0");

    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");

    const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export function isUserAvailable(userId:string,peersArrRef:React.RefObject<string[]>):boolean {
    return peersArrRef.current?.some((peer) => peer === userId)??false;
}

/*
in line 576 it has been declared and has been used on lines
1227 and this was done because user media has been intialialized been called during component will be mounting to set users camera 
*/

// utils/gettingVideoStream.ts
  export function gettingVideoStream():Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      video: {
        frameRate: {
          ideal: 60,
          min: 10,
        },
      },
      audio: false,
    });
  }


/*
declared on 587 used on 1244 [same as video stream ] used in useEffect for calling when mounting in action for users microPhone
*/

export function gettingAudioStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: true,
  });
}

/*
this function will be called when user will click schreen shre it request access to users screen and will return media stream 
intialized:591 used on 1458 (for screen sharing) and on 2471 when (VAD?? has been used)
*/

export function gettingScreenStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getDisplayMedia({
    video: {
      //@ts-ignore
      cursor: "always",
    },
    audio: false,
  });
}
///////-------end of media streamings------------

/*
intialized on line 900 used in 890 and tis fxn takes the recorderd audio chunks to a blob convert it into mp3 and then upload it 
*/
export async function processRecordedAudio(
  arrayOfChunks: BlobPart[],
  uploadFile: (file: File) => void,
  setNVaudioUploadAnimation: (state: boolean) => void,
  WavToMp3: (blob: Blob) => Promise<Blob>
): Promise<void> {
  try {
    console.log(
      `%c just before vid to blob ${new Date().toLocaleTimeString()}`,
      "background-color:teal;color:white"
    );

    setNVaudioUploadAnimation(true);

    const audioBlob = new Blob(arrayOfChunks, { type: "audio/wav" });

    console.log(
      `Starting MP3 conversion at ${new Date().toLocaleTimeString()}`
    );

    const convertedBlob = await WavToMp3(audioBlob);

    console.log(
      `MP3 conversion finished at ${new Date().toLocaleTimeString()}`
    );

    const audioFile = new File([convertedBlob], "audio.mp3", {
      type: "audio/mpeg",
    });
    uploadFile(audioFile);
    setNVaudioUploadAnimation(false);
  } catch (error) {
    console.error(error, "Some error Occurred While Processing Audio ");
    setNVaudioUploadAnimation(false);
  }
}

/*
this has been intialized on line 926 and has been used on line same line this fxn seems to be intentonally stops the mediaRecorder instace when the user stops recroidng audio or vid and ensuring for mainting correct state
*/
export function stopVideoRecording(mediaRecorder:MediaRecorder  |null):Promise<void>{
    return new Promise((resolve, reject) => {
        if(!mediaRecorder || mediaRecorder.state!=="recording"){
            console.warn("MediaRecorder is already Stopeed or not intialized.")
            resolve()
            return
        }
        try {
            mediaRecorder.stop()
            console.log("Stopping Recording....")
            resolve()
        } catch (error) {
            console.error(error, "Error Occurred While Stopping Recording")
            reject(error)
        }
    })
}

/* Sending video to server this function in dta warpper is used to convert a blob to b64 and sending to server it is used ater the recording of video to transmit the data to another person *///okay something send to server needs to be attended 
export function sendVideoToServer(blob: Blob, url: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const b64 = reader.result as string;
        
        const payload = {
          ...data,
          init:data.init,
          audiomessage: b64?.split(",")[1],
          timeStamp: new Date().toISOString(),
          
        };

        const response = await PostReq(url,payload);
        console.log("video send result", response);
        resolve()
      } catch (error) {
        console.error("Error sending video:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
}

// Function to send live audio packet along with payload to backend after every VAD hit[on line 270]
export function sendToServer(blob: Blob, url: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const date = new Date();
    console.log(
      `%c just before sending the data ${date.toLocaleTimeString()}:${date.getMilliseconds()}`,
      "background-color:teal;color:white"
    );
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      const payload = {
        ...data,
        init: data.init,
        audiomessage: b64.split(",")[1],
        timeStamp: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}`
      };
      console.log("from inside send to server", payload);
      socket2.emit("ai_suggestion_req", payload);
      resolve();  
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
}

//depracted or not in using but still in file------------------------------------------------************-----------------------
//  function sendVadStreamToServer(
//     stream: MediaStream,
//     data: any,
//     url: string,
//     time: number
//   ) {
//     let mediaStream = new MediaStream();
//     //medRec = mediaStream
//     mediaStream.addTrack(stream.getAudioTracks()[0]);
//     try {
//       let arrayofChunks: Blob[] = [];
//       let mediaRecorder = new MediaRecorder(mediaStream, {
//         audioBitsPerSecond: 32000,
//       });
//       mediaRecorder.ondataavailable = (e) => {
//         arrayofChunks.push(e.data);
//       };
//       mediaRecorder.onstop = () => {
//         // console.log('media recorder stop triggered')
//         //  adminMediaRecorderStatus.current = false
//         downsampleToWav(
//           new Blob(arrayofChunks, { type: "audio/ogg" }),
//           (buffer: ArrayBuffer) => {
//             const mp3Buffer = encodeMp3(buffer);
//             let blob = new Blob(mp3Buffer, { type: "audio/mp3" });
//             console.log("send to server", data);
//             sendToServer(blob, url, data);
//             arrayofChunks = [];
//             //@ts-ignore
//             blob = null;
//           }
//         );
//       };

//       let timeOutId: any = null;
//       let intervalId: any = null;

//       //stop after T time
//       timeOutId = setTimeout(() => {
//         // console.log('state mediaRecorder inside timeout',mediaRecorder.state,intervalId,timeOutId)
//         clearInterval(intervalId);
//         clearTimeout(timeOutId);
//         if (mediaRecorder.state === "recording") mediaRecorder.stop();
//       }, time);

//       //check at specific interval & stop immediately
//       intervalId = setInterval(() => {
//         if (vadFlag.current === false) {
//           // console.log('state mediaRecorder inside interval',mediaRecorder.state,intervalId,timeOutId)
//           clearTimeout(timeOutId);
//           clearInterval(intervalId);
//           if (mediaRecorder.state === "recording") mediaRecorder.stop();

//           adminMediaRecorderStatus.current === false;
//         }
//       }, 150);

//       mediaRecorder.start();
//       console.log("state mediaRecorder", mediaRecorder.state);
//       // if(mediaRecorder.state==='recording'){

//       // }
//     } catch (e) {
//       console.log(e);
//       return;
//     }
//   }

// function handleDataOld(data: CuesDataType = {} as CuesDataType) {
//     let date = new Date();
//     console.log(
//       `%c inside handle Data ${
//         date.toLocaleTimeString() + ":" + date.getMilliseconds()
//       }`,
//       "background-color:teal;color:white"
//     );

//     setCueLoading(false);
//     //@ts-ignore
//     let arr: CuesDataType[] = [];
//     //@ts-ignore
//     let obj: CuesDataType = {};

//     if (data?.loading) {
//       return;
//     }

//     if (data?.imageUrl && data?.imageUrl !== "") {
//       //@ts-ignore
//       obj["id"] = uuidv4();
//       obj["common_id"] = data?.common_id;
//       obj["type"] = "ImageMsg";
//       obj["imageUrl"] = data?.imageUrl;
//       obj["iconName"] = "fa-solid fa-forward-fast";
//       obj["similarity_query"] = data?.similarity_query;
//       obj["color"] = data?.color;
//       obj["iconColor"] = data?.iconColor;
//       obj["sessionid"] = data?.sessionid;
//       obj["audiofiletimestamp"] = data?.audiofiletimestamp;

//       //arr.push(obj)
//       arr = [...arr, obj];
//       //@ts-ignore
//       obj = {};
//     }
//     if (data?.value && data?.value !== "") {
//       //@ts-ignore
//       obj["id"] = uuidv4();
//       obj["common_id"] = data?.common_id;
//       obj["type"] = "InputForm";
//       obj["iconName"] = "fa-regular fa-pen-to-square";
//       obj["value"] = data?.value;
//       obj["label"] = data?.label;
//       obj["color"] = data?.color;
//       obj["iconColor"] = data?.iconColor;
//       obj["similarity_query"] = data?.similarity_query;
//       obj["sessionid"] = data?.sessionid;
//       obj["audiofiletimestamp"] = data?.audiofiletimestamp;

//       //arr.push(obj)
//       arr = [...arr, obj];
//       //@ts-ignore
//       obj = {};
//     }
//     if (data?.radio && data?.radio !== "") {
//       //@ts-ignore
//       obj["id"] = uuidv4();
//       obj["common_id"] = data?.common_id;
//       obj["type"] = "RadioForm";
//       obj["iconName"] = "fa-regular fa-pen-to-square";
//       obj["label"] = data?.label;
//       obj["radio"] = data?.radio;
//       obj["color"] = data?.color;
//       obj["iconColor"] = data?.iconColor;
//       obj["similarity_query"] = data?.similarity_query;
//       obj["sessionid"] = data?.sessionid;
//       obj["audiofiletimestamp"] = data?.audiofiletimestamp;

//       //arr.push(obj)
//       arr = [...arr, obj];
//       //@ts-ignore
//       obj = {};
//     }

//     if (data?.content || data?.similarity_query) {
//       //@ts-ignore
//       obj["id"] = uuidv4();
//       obj["common_id"] = data?.common_id;
//       obj["type"] = "TextMsg";
//       obj["content"] = data.content;
//       obj["iconName"] = "fa-solid fa-circle-question";
//       obj["color"] = data?.color;
//       obj["iconColor"] = data?.iconColor;
//       obj["similarity_query"] = data?.similarity_query;
//       obj["sessionid"] = data?.sessionid;
//       obj["audiofiletimestamp"] = data?.audiofiletimestamp;

//       //arr.push(obj)
//       arr = [...arr, obj];
//       //@ts-ignore
//       obj = {};
//     }
//     if (data?.replies && data?.replies?.length > 0) {
//       //@ts-ignore
//       obj["id"] = uuidv4();
//       obj["common_id"] = data?.common_id;
//       obj["type"] = "SuggestiveMsg";
//       obj["replies"] = data?.replies;
//       obj["color"] = data?.color;
//       obj["iconColor"] = data?.iconColor;
//       obj["similarity_query"] = data?.similarity_query;
//       obj["iconName"] = "fa-solid fa-forward-fast";
//       obj["sessionid"] = data?.sessionid;
//       obj["audiofiletimestamp"] = data?.audiofiletimestamp;

//       //arr.push(obj)
//       arr = [...arr, obj];
//       //@ts-ignore
//       obj = {};
//     }
//     //@ts-ignore
//     dispatch(addCues(arr));
// }

// function updateCuesOld(data: CuesDataType = {} as CuesDataType) {
//     let date = new Date();
//     console.log(
//       `%c inside update cues ${
//         date.toLocaleTimeString() + ":" + date.getMilliseconds()
//       }`,
//       "background-color:teal;color:white"
//     );

//     let filteredCues = CuesList?.map((e) => {
//       if (e.common_id === data?.common_id) {
//         return {
//           ...e,
//           content: e.content + " " + (data.content ?? ""),
//         };
//       }
//       return e;
//     });

//     if (!filteredCues) {
//       return;
//     }

//     dispatch(
//       setCues({
//         CuesList: filteredCues,
//         jobDescription: jobDescription,
//         interviewGuide: interviewGuide,
//         jobTitle: jobTitle,
//       })
//     );
//   }



