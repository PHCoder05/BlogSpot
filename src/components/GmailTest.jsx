import React, { useState, useContext } from 'react';
import { FaEnvelope, FaCheck, FaTimes, FaSpinner, FaCog } from 'react-icons/fa';
import GmailService from '../utils/gmailService';
import EmailService from '../utils/emailService';
import myContext from '../context/data/myContext';

const GmailTest = () => {
  const { mode } = useContext(myContext);
  const [testEmail, setTestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);

  const testConnection = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await GmailService.testConnection();
      setConnectionStatus(result);
      showMessage(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      showMessage('Connection test failed: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail.trim()) {
      showMessage('Please enter a test email address.', 'error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Create test blog data
      const testBlogData = {
        id: 'test-blog-123',
        blogs: {
          title: 'Test Blog Post - Gmail Integration',
          content: 'This is a test email to verify that Gmail SMTP is working correctly with your newsletter system. If you receive this email, congratulations! Your Gmail setup is working perfectly.',
          readingTime: '2 min read',
          category: 'Testing'
        },
        thumbnail: 'https://via.placeholder.com/300x200',
        time: new Date(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      const result = await EmailService.sendBlogNotification(testEmail, testBlogData);
      
      if (result) {
        showMessage('Test email sent successfully! Check your inbox.', 'success');
      } else {
        showMessage('Failed to send test email. Check console for details.', 'error');
      }
    } catch (error) {
      showMessage('Error sending test email: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const getSetupInstructions = () => {
    return GmailService.getSetupInstructions();
  };

  return (
    <div className={`p-8 rounded-xl shadow-lg ${
      mode === 'dark' ? 'bg-gray-800' : 'bg-white'
    } border border-gray-200 dark:border-gray-700`}>
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-teal-500">
          <FaEnvelope className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
          Gmail SMTP Test
        </h2>
        <p className="text-lg" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}>
          Test your Gmail SMTP configuration
        </p>
      </div>

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

      {/* Connection Status */}
      {connectionStatus && (
        <div className={`mb-6 p-4 rounded-lg ${
          connectionStatus.success 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
        }`}>
          <div className="flex items-center gap-3">
            <FaCog className="w-5 h-5" />
            <div>
              <p className="font-medium">Connection Status</p>
              <p className="text-sm">{connectionStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Test Controls */}
      <div className="space-y-6">
        {/* Connection Test */}
        <div className={`p-6 rounded-lg ${
          mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
            Test Connection
          </h3>
          <p className="mb-4" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
            Verify that your Gmail credentials are properly configured.
          </p>
          <button
            onClick={testConnection}
            disabled={isLoading}
            className={`bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-white font-semibold flex items-center gap-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="w-5 h-5 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <FaCog className="w-5 h-5" />
                <span>Test Connection</span>
              </>
            )}
          </button>
        </div>

        {/* Send Test Email */}
        <div className={`p-6 rounded-lg ${
          mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
            Send Test Email
          </h3>
          <p className="mb-4" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
            Send a test email to verify the newsletter system is working.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter test email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              disabled={isLoading}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                mode === 'dark' 
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <button
              onClick={sendTestEmail}
              disabled={isLoading || !testEmail.trim()}
              className={`bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-white font-semibold flex items-center gap-2 ${
                isLoading || !testEmail.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FaEnvelope className="w-5 h-5" />
                  <span>Send Test Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className={`p-6 rounded-lg ${
          mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
            Setup Instructions
          </h3>
          <div className="bg-gray-800 text-gray-200 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{getSetupInstructions()}</pre>
          </div>
        </div>
      </div>

      {/* Environment Variables Check */}
      <div className="mt-8 p-4 rounded-lg bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
        <h4 className="font-semibold mb-2">Environment Variables Status:</h4>
        <div className="space-y-1 text-sm">
          <div>REACT_APP_GMAIL_USER: {process.env.REACT_APP_GMAIL_USER ? '✅ Set' : '❌ Not Set'}</div>
          <div>REACT_APP_GMAIL_APP_PASSWORD: {process.env.REACT_APP_GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Not Set'}</div>
        </div>
        {!process.env.REACT_APP_GMAIL_USER || !process.env.REACT_APP_GMAIL_APP_PASSWORD ? (
          <p className="mt-2 text-sm">
            Please set up your environment variables in the .env file to enable Gmail SMTP.
          </p>
        ) : (
          <p className="mt-2 text-sm">
            Environment variables are configured. You can now test the connection.
          </p>
        )}
      </div>
    </div>
  );
};

export default GmailTest; 