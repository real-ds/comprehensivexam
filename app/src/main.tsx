import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { QueryProvider } from './context/QueryContext'
import { ProgressProvider } from './context/ProgressContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
)