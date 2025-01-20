import React, { useEffect } from 'react'
import DataWrapper from '../context/DataWrapper'
import MainPage from '../pages/MainPage'
import { useAuth } from '../context/AuthWrapper'

export default function MainPageWrapper() {
    //@ts-ignore
    const {renderMainPage,setRenderMainPage}= useAuth()

    useEffect(()=>{
      setRenderMainPage(true)
    },[])
  
  if(renderMainPage===true)
    return <DataWrapper><MainPage/></DataWrapper>
  else 
    return null;
}
