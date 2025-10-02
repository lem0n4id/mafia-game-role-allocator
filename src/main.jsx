import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/mobile.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { trackWebVitals, optimizeForMobile } from './utils/performance.js';

// Initialize mobile optimizations
optimizeForMobile();

// Track performance metrics in development
if (import.meta.env.DEV) {
  trackWebVitals();
}

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent default browser behavior
  event.preventDefault();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
