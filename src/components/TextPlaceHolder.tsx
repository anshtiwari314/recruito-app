import React,{useEffect,useState} from 'react'

export default function TextPlaceHolder({e,large}:{e:Object,large:boolean}){
    let styling ={
      textWrapper:{
        width:large===true?"30rem":"7rem",
        height:large===true?"30rem":"7rem",
        // border:"0.1rem solid blue",
        //backgroundColor:"white",
        // padding:"2rem"
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        margin:"0 auto",
        borderRadius:large===true?"15rem":"3.5rem",
        backgroundColor:"violet"
      },
      text:{
        fontSize:large===true?"4.5rem":"2rem",
        width:"fit-content",
        color:"white"
      }
    }
    useEffect(()=>{
      console.log("textPlaceHolder",e,large)
    },[])

    return (
      <div style={styling.textWrapper} >
            <p style={styling.text}>AN</p>  
      </div>
    )
  }