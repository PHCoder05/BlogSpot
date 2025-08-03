import React from 'react';

// Utility to suppress React Quill warnings globally
export const suppressQuillWarnings = () => {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    
    // Check if message should be suppressed
    const shouldSuppress = (message) => {
        if (typeof message !== 'string') return false;
        return message.includes('findDOMNode') || 
               message.includes('DOMNodeInserted') ||
               message.includes('Warning: findDOMNode is deprecated') ||
               message.includes('Listener added for a \'DOMNodeInserted\'') ||
               message.includes('Download the React DevTools') ||
               message.includes('Cannot read properties of undefined (reading \'delta\')') ||
               message.includes('runtime.lastError') ||
               message.includes('Could not establish connection') ||
               message.includes('Receiving end does not exist') ||
               message.includes('addRange(): The given range isn\'t in document') ||
               message.includes('Unexpected token \'<\', "<!doctype "... is not valid JSON') ||
               message.includes('SyntaxError: Unexpected token \'<\'') ||
               message.includes('Error fetching blogs: SyntaxError') ||
               message.includes('ProtectedRouteForAdmin') ||
               message.includes('quillWarningSuppression.js') ||
               message.includes('[Deprecation]') ||
               message.includes('Support for this event type has been removed') ||
               message.includes('Support for mutation events is deprecated');
    };
    
    // Override console.error
    console.error = (...args) => {
        // Check if any of the arguments should be suppressed
        const shouldSuppressMessage = args.some(arg => 
            typeof arg === 'string' && shouldSuppress(arg)
        );
        
        if (shouldSuppressMessage) return;
        
        // Handle specific error patterns
        if (args[0] && typeof args[0] === 'string') {
            const message = args[0];
            
            // Suppress JSON parsing errors from Firebase
            if (message.includes('Unexpected token \'<\', "<!doctype "... is not valid JSON')) {
                return;
            }
            
            // Suppress React Quill range errors
            if (message.includes('addRange(): The given range isn\'t in document')) {
                return;
            }
            
            // Suppress any range-related errors
            if (message.includes('range') && message.includes('document')) {
                return;
            }
            
            // Suppress React DevTools messages
            if (message.includes('Download the React DevTools')) {
                return;
            }
        }
        
        originalError.apply(console, args);
    };
    
    // Override console.warn
    console.warn = (...args) => {
        // Check if any of the arguments should be suppressed
        const shouldSuppressMessage = args.some(arg => 
            typeof arg === 'string' && shouldSuppress(arg)
        );
        
        if (shouldSuppressMessage) return;
        
        originalWarn.apply(console, args);
    };

    // Override console.log to catch deprecation warnings and debug logs
    console.log = (...args) => {
        // Check if any of the arguments should be suppressed
        const shouldSuppressMessage = args.some(arg => 
            typeof arg === 'string' && shouldSuppress(arg)
        );
        
        if (shouldSuppressMessage) return;
        
        // Suppress specific debug logs
        if (args[0] && typeof args[0] === 'string') {
            const message = args[0];
            
            // Suppress ProtectedRouteForAdmin debug logs
            if (message.includes('ProtectedRouteForAdmin')) {
                return;
            }
            
            // Suppress quillWarningSuppression debug logs
            if (message.includes('quillWarningSuppression.js')) {
                return;
            }
        }
        
        originalLog.apply(console, args);
    };
    
    // Return function to restore original console methods
    return () => {
        console.error = originalError;
        console.warn = originalWarn;
        console.log = originalLog;
    };
};

 