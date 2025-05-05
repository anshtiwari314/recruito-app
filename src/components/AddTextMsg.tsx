import React, { useEffect, useState } from 'react'
import Parser from 'html-react-parser'


export default function AddTextMsg({e}:{e:any}) {


  return (
    <div className='second text-msg' style={{borderColor:e.color}}>
        <p>
        {Parser(e.content)}
        </p>
        {/* <p>i am content</p>
        <br/>
        <br/>
        <p>howdy hello world</p> */}
    </div>
  )
}
