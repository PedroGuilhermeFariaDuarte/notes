import React from 'react'
import ReactDOM from 'react-dom/client'

// Main Component
import App from './App'

// Global Styles
import { Toaster } from 'sonner'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster pauseWhenPageIsHidden position="top-right" richColors/>
    <App />
  </React.StrictMode>,
)
