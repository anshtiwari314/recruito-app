import React,{useEffect} from 'react'
import HomePage from './HomePage'
import { useAuth } from '../context/AuthWrapper'

export default function HomePageWrapper() {
    //@ts-ignore
  const {renderMainPage,setRenderMainPage}= useAuth()

  useEffect(()=>{
    setRenderMainPage(false)
  },[])

  return <HomePage/>

}
