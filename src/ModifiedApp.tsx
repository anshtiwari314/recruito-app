import React from 'react'
import {Routes,HashRouter,Route} from 'react-router-dom'

import Page1 from './Page1'
import './App.css'
import HomePage from './pages/HomePage'
import MainPage from './pages/MainPage'
import Leave from './pages/Leave'
import MainPageWrapper from './pages/MainPageWrapper'
import AuthWrapper from './context/AuthWrapper'
import LeavePageWrapper from './pages/LeavePageWrapper'
import HomePageWrapper from './pages/HomePageWrapper'
import DataWrapper from './context/DataWrapper'

export default function App() {
  return (
    // <HomePage/>
    <DataWrapper>
        <MainPage/>
    </DataWrapper>
    //<Leave/>
  )
}
