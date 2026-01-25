import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {default as AuthProvider} from './context/AuthContext.jsx'
import { default as DarkModeProvider } from './context/DarkModeContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DarkModeProvider>
   <App />
   </DarkModeProvider>
    </AuthProvider>
  </StrictMode>,
)

  
