import { PostReq } from "./requests"


import WavToMp3 from './wavToMp3'

export function getTimeStamp(){

    let dateOb = new Date()

    let dateFormat= `${dateOb.getDate()}.${dateOb.getMonth()+1}.${dateOb.getUTCFullYear()}` 
    let timeFormat = `${dateOb.getHours()}.${dateOb.getMinutes()}.${dateOb.getSeconds()}.${dateOb.getMilliseconds()}`

    return `${dateFormat}-${timeFormat}`
}

export function getTimeStampInIndian() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); 
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
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