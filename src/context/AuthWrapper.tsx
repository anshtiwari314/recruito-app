
import React,{createContext,useContext,useState} from 'react'

const AuthContext = createContext('auth')
export function useAuth(){
    return useContext(AuthContext)
}
export default function AuthWrapper({children}:{children:React.ReactNode}) {
    const [renderMainPage,setRenderMainPage] = useState<boolean>(false)
    
    let value = {
        renderMainPage,setRenderMainPage
    }
    return (
    <AuthContext.Provider 
    //@ts-ignore
        value={value}>
        {children}
    </AuthContext.Provider>
  )
}
