import React,{useEffect, useState} from 'react'
//import { useData } from './context/DataWrapper'
import Msg from './Msg'
import {v4 as uuidV4} from 'uuid';

export function RadioForm({e,val,setVal}:{e:any,val:string,setVal:any}){
    
    return (
        <div className='option-box'>
            {e.radio.map((val:string,i:number)=>{
                let tempId = uuidV4()
                return  <div className='option' key={i}> 
                            <input type="radio" id={tempId} name={e.id} onChange={()=>setVal(val)}/>
                            <label htmlFor={tempId}>{val}</label>
                        </div>
            })}
        </div>
    )
}

export function InputForm({e,val,setVal}:{e:any,val:string,setVal:any}){


    return (
        <div className='option-box'>
            <div className='input'> 
                <input 
                    type="text" 
                    placeholder={e.value} 
                    value={val} 
                    onChange={(ev)=>setVal(ev.target.value)}
                />
            </div>
        </div>
    )
}

export default function AddForm({e,Component}:{e:any,Component:React.ReactNode}) {
    //@ts-ignore
   // const {data,setData} = useData()
    const [val,setVal] = useState('');

   function sendFormToServer(e:any){
       fetch('https://f6p70odi12.execute-api.ap-south-1.amazonaws.com',{
                method:'POST',
                headers:{
                   'Accept':'application.json',
                   'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    query:val,
                    sessionid:null,
                    isform:true,
                    cass:true,
                    label:e.label
                }),
                cache:'default',}).then(res=>{
                   // console.log("res from audio server",res)
                })
    }
    //removing form
   function removeForm(id:string){    
    // let newData= data.filter((e:any)=>{
    //     return e.id !=id
    // })
    
    // setData(newData)
   } 
  useEffect(()=>{
    console.log(val)
  },[val])

  return (
    <div className='second form' style={{borderColor:e.color}}>
        <div className='content'>
            <div className='label-box'>
                <p>{e.label}</p>
            </div>
            {/* @ts-ignore */}
            <Component e={e} val={val} setVal={setVal}/>
              
        </div> 
        <button onClick={()=>{sendFormToServer(e);removeForm(e.id)}}>
            <i className="fa-regular fa-paper-plane"></i>
        </button>
    </div>
  )
}
