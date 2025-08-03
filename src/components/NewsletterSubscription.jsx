import React, { useState, useContext } from 'react';
import { FaEnvelope, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import NewsletterService from '../utils/newsletterService';
import myContext from '../context/data/myContext';

const NewsletterSubscription = ({ 
  title = "Never Miss a Post!", 
  description = "Subscribe to our newsletter and get the latest blog posts delivered straight to your inbox.",
  className = "" 
}) => {
  const { mode } = useContext(myContext);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showMessage('Please enter your email address.', 'error');
      return;
    }

    if (!NewsletterService.isValidEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await NewsletterService.subscribeToNewsletter(email);
      
      if (result.success) {
        showMessage(result.message, 'success');
        setEmail(''); // Clear the input on success
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  return (
    <div className={`${className}`}>
      <div className={`p-12 text-center rounded-xl shadow-lg ${
        mode === 'dark' 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-teal-50 to-blue-50 border-gray-200'
      } border`}>
        
        {/* Icon */}
        <div className="mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            mode === 'dark' ? 'bg-teal-500/20' : 'bg-teal-100'
          }`}>
            <FaEnvelope className={`w-8 h-8 ${mode === 'dark' ? 'text-teal-400' : 'text-teal-500'}`} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
          {title}
        </h2>

        {/* Description */}
        <p className="text-lg mb-8" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}>
          {description}
        </p>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-center gap-3 ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }`}>
            {messageType === 'success' ? (
              <FaCheck className="w-5 h-5" />
            ) : (
              <FaTimes className="w-5 h-5" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <div className="relative flex-1">
            <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/20 ${
                mode === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-white font-semibold flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="w-5 h-5 animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </form>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 mt-6">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className={`flex items-center justify-center gap-2 ${
            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span>Instant notifications</span>
          </div>
          <div className={`flex items-center justify-center gap-2 ${
            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Weekly digest</span>
          </div>
          <div className={`flex items-center justify-center gap-2 ${
            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Exclusive content</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscription; 