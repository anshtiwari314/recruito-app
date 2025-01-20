import React from 'react'
import {Routes,HashRouter,Route} from 'react-router-dom'

import Page1 from './Page1'
import HomePage from './pages/HomePage'

import Leave from './pages/Leave'
import MainPageWrapper from './pages/MainPageWrapper'
import AuthWrapper from './context/AuthWrapper'
import LeavePageWrapper from './pages/LeavePageWrapper'
import HomePageWrapper from './pages/HomePageWrapper'

export default function App() {
  return (
    <AuthWrapper>
    <HashRouter>
        <Routes>
            {/* <Route path ="/" element={<MainPage/>}/> */}
            
            <Route path='/' element={<HomePageWrapper/>}/>
            <Route path='/meeting' element={<MainPageWrapper/>}/>
            <Route path='/meeting/:link' element={<MainPageWrapper/>}/>
            <Route path='/leave' element={<LeavePageWrapper/>}/>
            <Route path='/leave/:link' element={<LeavePageWrapper/>}/>

            {/* <Route path='' element={<></>}/> */}
        </Routes>
    </HashRouter>
    </AuthWrapper>
    
  )
}
