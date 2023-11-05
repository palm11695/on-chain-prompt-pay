import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@rainbow-me/rainbowkit/styles.css'
import 'react-loading-skeleton/dist/skeleton.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
