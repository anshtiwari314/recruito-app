import React from 'react'

function handleFullSize(){

}
export default function AddImageMsg({e}:{e:any}) {
  return (
    <div className='second h-center image-msg' style={{borderColor:e.color}}>
        <img src={e.imageUrl} />
    </div>
  )
}
