import React,{useEffect} from 'react'
import Leave from './Leave'
import { useAuth } from '../context/AuthWrapper'

export default function LeavePageWrapper() {

    //@ts-ignore
  const {setRenderMainPage}= useAuth()

  useEffect(()=>{
    setRenderMainPage(false)
  },[])

    return <Leave/>
}
