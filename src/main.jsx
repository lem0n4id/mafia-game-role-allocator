import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/mobile.css'
import App from './App.jsx'
import { trackWebVitals, optimizeForMobile } from './utils/performance.js'

// Initialize mobile optimizations
optimizeForMobile()

// Track performance metrics in development
if (import.meta.env.DEV) {
  trackWebVitals()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
