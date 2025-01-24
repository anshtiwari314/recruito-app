import React from "react"
import DataWrapper from "./context/DataWrapper"
import BibhutiUiPage from './pages/BibhutiUiPage'
import ReduxProvider from "@/store/Providers";
import MainPage from "./pages/MainPage";

export default function App(){
    return (
        <ReduxProvider>
        <DataWrapper>
          <BibhutiUiPage/>
        </DataWrapper>
        </ReduxProvider>
    )
}