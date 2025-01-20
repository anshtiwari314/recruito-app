import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ModifiedApp from './ModifiedApp'
//import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ModifiedApp/>
  </React.StrictMode>,
)
