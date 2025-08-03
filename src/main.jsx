import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from "@material-tailwind/react";
import { suppressQuillWarnings } from './utils/quillWarningSuppression.js';

// Suppress Quill warnings
suppressQuillWarnings();

// Global error handler for Quill range errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('addRange(): The given range isn\'t in document')) {
    event.preventDefault();
    console.warn('Quill range error suppressed');
    return false;
  }
});

// Fix for DOMNodeInserted deprecation warning
// This prevents the editor from closing immediately by providing a no-op polyfill
if (typeof window !== 'undefined') {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'DOMNodeInserted') {
      // Replace with MutationObserver-compatible approach
      const target = this;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Simulate the event for added nodes
            mutation.addedNodes.forEach(node => {
              if (typeof listener === 'function') {
                const event = new Event('DOMNodeInserted');
                event.target = node;
                listener.call(target, event);
              }
            });
          }
        });
      });
      
      // Start observing with configuration
      observer.observe(this, { childList: true, subtree: true });
      
      // Store the observer to prevent memory leaks
      this._domNodeInsertedObserver = observer;
      
      // Return a no-op function to satisfy the original call
      return function() {};
    }
    
    // Call the original method for other event types
    return originalAddEventListener.call(this, type, listener, options);
  };
}

// Suppress react-helmet warnings in development
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('UNSAFE_componentWillMount')) {
      return;
    }
    originalError.apply(console, args);
  };
  
  // Check for React DevTools
  const checkReactDevTools = () => {
    if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.info('💡 Install React DevTools for a better development experience: https://reactjs.org/link/react-devtools');
    }
  };
  
  // Check after a short delay to allow for DevTools to load
  setTimeout(checkReactDevTools, 1000);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
