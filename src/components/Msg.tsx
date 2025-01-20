import React,{useEffect, useState,useRef} from 'react'

import AddImageMsg from './AddImageMsg'
import AddOnlySuggestiveMsg from './AddOnlySuggestiveMsg'
import AddTextMsg from './AddTextMsg'
import AddForm,{ InputForm,RadioForm } from './AddForm'

function IconColor(identiyingColor:string){
    if(identiyingColor==='red')
    return '#D60000'
    else if(identiyingColor === 'green')
    return 'green'
    else if(identiyingColor === 'yellow')
    return 'yellow'
    else if(identiyingColor === 'blue')
    return 'white'
    else if(identiyingColor==='pink')
    return '#D60067'
}
function IconName(identiyingColor:string){
    console.log(identiyingColor)
    if(identiyingColor==='red')
        return 'fa-solid fa-clipboard-question'
    else if(identiyingColor === 'green')
        return 'fa-solid fa-exclamation';
    else if(identiyingColor === 'yellow')
        return 'fa-solid fa-forward-fast';
    else if(identiyingColor === 'blue')
        return 'fa-solid fa-circle-question';
    else if(identiyingColor==='pink' )
        return 'fa-regular fa-pen-to-square';
}
function MsgTypeSelector({e}:{e:any}){
    if(e.type ==="TextMsg")
        return <AddTextMsg e={e}/>
    else if(e.type === "SuggestiveMsg")
        return <AddOnlySuggestiveMsg e={e} />
    else if(e.type === "ImageMsg")
        return <AddImageMsg e={e} />
    else if(e.type === "InputForm")
        //@ts-ignore
        return <AddForm e={e} Component={InputForm}/>
                    
    else if(e.type === "RadioForm")
    //@ts-ignore
        return <AddForm e={e} Component={RadioForm}/>
    return <></>
                
}
function handleFeedback(e:any,url:string){
    
    fetch(url,{
        method:'POST',
        headers:{
           'Accept':'application.json',
           'Content-Type':'application/json'
        },
        body:JSON.stringify({
            sessionid: e.sessionid, 
            audiofiletimestamp: e.audiofiletimestamp ,
            istranscription:e.initquery
        }),
        cache:'default',}).then(res=>{
           console.log("res from feedback server",res)
           return res.json()
        }).then((result)=>{
          console.log(result)
        })
}

function enumIcons(color:string){
    if(color==='red')
        return '<i class="fa-solid fa-clipboard-question" style="color:#D60000;"></i>'
    else if(color === 'green')
        return '<i class="fa-solid fa-exclamation" style="color:green;"></i>';
    else if(color === 'yellow')
        return '<i class="fa-solid fa-forward-fast" style="color:yellow;"></i>';
    else if(color === 'blue')
        return '<i class="fa-solid fa-circle-question" style="color:#7D11E9;"></i>'
    else if(color==='pink')
        return '<i class="fa-regular fa-pen-to-square" style="color:#D60067;"></i>'
}

export default function Msg({e}:{e:any}) {
    //console.log(e)
    console.log(IconName(e.iconColor))
    const [checked,setChecked] = useState<boolean>(false)
    let radioRef = useRef(false)

    useEffect(()=>{
        if(radioRef.current ===false)
        return ;
        
        if(checked===true){
            let url = 'https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/fail-feedback'
            handleFeedback(e,url)
        }else{
            let url = `https://qhpv9mvz1h.execute-api.ap-south-1.amazonaws.com/prod/pass-feedback`
            handleFeedback(e,url)
        }
    },[checked])
  return (
      // https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif
     
    <div className='msg'>
            <div className='wrapper' style={{marginBottom:"0.5rem"}}>
                <div className='first v-center h-center' style={{opacity:0}}>   
                    <i 
                    className={`${IconName(e.iconColor)?.toString()}`} 
                    style={{color:IconColor(e.iconColor)?.toString()}}
                    
                    ></i>
                </div>
                <div style={{flex:"0.8"}}>
                    <h5 >{e.similarity_query}</h5> 
                </div>
                <div className='third v-center h-center' style={{opacity:0}}>
                    <input
                        className="response-radio" 
                        onClick={()=>setChecked(prev=>!prev)}
                        onChange={()=>{radioRef.current=true}}
                        checked={checked}
                        type="radio" 
                        style={{accentColor:"rgb(125, 17, 233)"}}/>
                </div>
            </div>
            <div className='wrapper'>
                <span className='first v-center h-center'>
                    <i 
                    className={`${IconName(e.iconColor)?.toString()}`} 
                    style={{color:IconColor(e.iconColor)?.toString()}}
                    
                    ></i>
                    {/* @ts-ignore */}
                    {/* {Parser(enumIcons(e.color)?.toString())} */}
                </span>
                    <MsgTypeSelector e={e}/>
                {/* <div className='second'>i am text div</div> */}
                <span className='third v-center h-center'>
                    <input
                        className="response-radio" 
                        onClick={()=>setChecked(prev=>!prev)}
                        onChange={()=>{radioRef.current=true}}
                        checked={checked}
                        type="radio" 
                        style={{accentColor:"rgb(125, 17, 233)"}}/>
                </span>
            </div>
    </div>

    

  )
}

