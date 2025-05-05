import React from 'react'

export default function AddOnlySuggestiveMsg({e}:{e:any}) {

  return (
    <div className='second h-center suggestive-msg' style={{borderColor:e.color}}>
        {e.replies.map((btnValue:string,i:number)=>{
            return <button key={i}>{btnValue}</button>
        })}
    </div>
  )
}
