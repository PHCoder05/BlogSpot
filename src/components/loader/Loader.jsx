import React from 'react';
import { useContext } from 'react';
import myContext from '../../context/data/myContext';

function Loader() {
  const context = useContext(myContext);
  const { mode } = context;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      mode === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'
    } backdrop-blur-sm`}>
      <div className="relative">
        {/* Main Spinner */}
        <div className="w-16 h-16 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>
        
        {/* Pulse Ring */}
        <div className="absolute inset-0 w-16 h-16 border-4 border-teal-500/20 rounded-full animate-ping"></div>
        
        {/* Loading Text */}
        <div className="mt-4 text-center">
          <p className={`text-lg font-semibold ${
            mode === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Loading...
          </p>
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;