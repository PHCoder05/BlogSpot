import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from "@material-tailwind/react";
import { suppressQuillWarnings } from './utils/quillWarningSuppression.js';
import { initializeAdBlockerHandling } from './utils/adBlockerDetection.js';

// Suppress Quill warnings
suppressQuillWarnings();

// Initialize ad blocker handling
initializeAdBlockerHandling();

// Global error handler for Quill range errors and React Helmet issues
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('addRange(): The given range isn\'t in document')) {
    event.preventDefault();
    console.warn('Quill range error suppressed');
    return false;
  }
  
  // Handle React Helmet Symbol errors
  if (event.error && event.error.message && event.error.message.includes('Cannot convert a Symbol value to a string')) {
    event.preventDefault();
    console.warn('React Helmet Symbol error suppressed');
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
    // Suppress React Helmet warnings
    if (args[0] && typeof args[0] === 'string' && (
      args[0].includes('UNSAFE_componentWillMount') ||
      args[0].includes('react-helmet') ||
      args[0].includes('HelmetWrapper') ||
      args[0].includes('Cannot convert a Symbol value to a string') ||
      args[0].includes('warnOnInvalidChildren')
    )) {
      return;
    }
    
    // Suppress ad blocker errors
    if (args[0] && typeof args[0] === 'string' && (
      args[0].includes('ERR_BLOCKED_BY_CLIENT') ||
      args[0].includes('net::ERR_BLOCKED_BY_CLIENT')
    )) {
      console.warn('Ad blocker request blocked:', args[0]);
      return;
    }
    
    originalError.apply(console, args);
  };
  
  // Suppress Material Tailwind warnings
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && (
      args[0].includes('@material-tailwind') ||
      args[0].includes('Material Tailwind') ||
      args[0].includes('react-helmet') ||
      args[0].includes('HelmetWrapper') ||
      args[0].includes('Cannot convert a Symbol value to a string')
    )) {
      return;
    }
    originalWarn.apply(console, args);
  };
  
  // Check for React DevTools
  const checkReactDevTools = () => {
    if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.info('💡 Install React DevTools for a better development experience: https://reactjs.org/link/react-devtools');
    }
  };
  
  // Check after a short delay to allow for DevTools to load
  setTimeout(checkReactDevTools, 1000);
  
  // Global error handler for Symbol conversion errors
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && event.error.message.includes('Cannot convert a Symbol value to a string')) {
      console.warn('Symbol conversion error caught globally:', event.error);
      event.preventDefault();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)

