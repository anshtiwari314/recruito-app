import React,{useEffect, useState} from 'react'
import Like from '../assets/Like.svg'
import LikeFilled from '../assets/Like-filled.svg'
import Dislike from '../assets/Dislike.svg'
import DislikeFiLLed from '../assets/Dislike-filled.svg'
import Pin from '../assets/Pin.svg'
import PinFilled from '../assets/Pin-filled.svg'
import parse from 'html-react-parser';

interface Props {}

function TokenMsg({e}:{e:any}) {
    
    const [toggleLikeBtn,setToggleLikeBtn] = useState<boolean>(false)
    const [toggleDislikeBtn,setToggleDislikeBtn] = useState<boolean>(false)
    const [togglePinBtn,setTogglePinBtn] = useState<boolean>(false)

    useEffect(()=>{
        console.log(e)
    },[])
    return (
        <div style={{
            //width:'fit-content',
            //minWidth:'60%',
            width:'85%',
            //border:'0.1rem solid tomato',
            display:'flex',
            backgroundColor:'white',
            margin:'2rem 2rem',
            padding:'2rem 1rem'
            }}>
        <div style={{width:'100%',height:'fit-content',flex:0.8,margin:'1rem 0'}}>
            <h3 style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight:700,
                padding:'1rem 2rem',
                lineHeight:'2.8rem',
                fontSize:'2rem'
                }}>
                {e.similarity_query}
            </h3>
           
            <p style={{
                fontSize:'1.6rem',
                padding:'1rem 2rem',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight:400,
                color:'#343541',
                lineHeight:'2.8rem'
                }}>{parse(e.content)}</p>
        </div>
        <div style={{
            flex:0.2,
            //border:'0.1rem solid tomato',
            display:'flex',
            flexDirection:'column',
            justifyContent:'space-between'
            }}>
            <div style={{
                display:'flex',
                justifyContent:'space-around',
               // border:'0.1rem solid violet'
               width:'80%',
               margin:'0 auto'
                }}>
                {toggleLikeBtn===false ? 
                <img src={Like} style={{fontSize:'1rem',cursor:'pointer'}}  onClick={()=>setToggleLikeBtn(p=>!p)}/>
                :
                <img src={LikeFilled} style={{fontSize:'1rem',cursor:'pointer'}}  onClick={()=>setToggleLikeBtn(p=>!p)}/>
                }
                {
                toggleDislikeBtn===false ?
                <img src={Dislike} style={{fontSize:'1rem',cursor:'pointer'}} onClick={()=>setToggleDislikeBtn(p=>!p)}/>
                :
                <img src={DislikeFiLLed} style={{fontSize:'1rem',cursor:'pointer'}} onClick={()=>setToggleDislikeBtn(p=>!p)}/>
                }
                {
                togglePinBtn===false ?
                <img src={Pin} style={{fontSize:'1rem',cursor:'pointer'}}  onClick={()=>setTogglePinBtn(p=>!p)}/>
                :
                <img src={PinFilled} style={{fontSize:'1rem',cursor:'pointer'}} onClick={()=>setTogglePinBtn(p=>!p)}/>
                }
                
            </div>
            <div style={{
                //border:'0.1rem solid violet'\
                }}>
                <p style={{
                    fontSize:'1.4rem',
                    textAlign:'center',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight:400,
                    color:'#343541'
                    }}>12:48 PM, 6 Apr</p>
            </div>
        </div>
    </div>
    )
}

export default TokenMsg
