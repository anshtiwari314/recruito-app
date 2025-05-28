import { PostReq } from "./requests"

import { utils } from "@ricky0123/vad-react"
import WavToMp3 from './wavToMp3'

export function getTimeStamp(){

    let dateOb = new Date()

    let dateFormat= `${dateOb.getDate()}.${dateOb.getMonth()+1}.${dateOb.getUTCFullYear()}` 
    let timeFormat = `${dateOb.getHours()}.${dateOb.getMinutes()}.${dateOb.getSeconds()}.${dateOb.getMilliseconds()}`

    return `${dateFormat}-${timeFormat}`
}

export function getOldTimeStamp(){

    let dateOb = new Date()

    let dateFormat= `${dateOb.getDate()}/${dateOb.getMonth()+1}/${dateOb.getUTCFullYear()}` 
    let timeFormat = `${dateOb.getHours()}:${dateOb.getMinutes()}:${dateOb.getSeconds()}:${dateOb.getMilliseconds()}`

    return `${dateFormat} ${timeFormat}`
}

export function generateBase64(blob){
    return new Promise((resolve,reject)=>{

        let reader = new FileReader()
        reader.onloadend = ()=>{
            resolve(reader.result)
        }
    reader.readAsDataURL(blob)
    })
}

export async function processAudioToBase64(audio,url,data){
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


      let resp = await PostReq(url,data)
      console.log('resp',resp)
      return resp
}