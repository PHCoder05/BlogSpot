import React, { useState } from 'react';
import NewsletterService from '../utils/newsletterService';
import { EmailService } from '../utils/emailService';
import toast from 'react-hot-toast';

const NewsletterTest = () => {
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const handleTestSMTP = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      console.log('🧪 Testing SMTP connection...');
      
      // Check if server is reachable first
      const healthCheck = await fetch(`${EmailService.API_BASE_URL}/health`);
      if (!healthCheck.ok) {
        throw new Error(`Server not responding: ${healthCheck.status} ${healthCheck.statusText}`);
      }
      
      const response = await fetch(`${EmailService.API_BASE_URL}/email/test-smtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      setTestResults({
        type: 'SMTP Test',
        success: result.success,
        message: result.message,
        error: result.error
      });
      
      if (result.success) {
        toast.success('SMTP connection test passed!');
      } else {
        toast.error('SMTP connection test failed!');
      }
      
    } catch (error) {
      console.error('❌ SMTP test error:', error);
      
      let errorMessage = 'SMTP test failed';
      let errorDetails = {};
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to email server. Is the backend running?';
        errorDetails = {
          code: 'SERVER_UNREACHABLE',
          message: 'Backend server is not running or not accessible',
          suggestion: 'Run "npm run server" to start the backend server',
          details: error.message
        };
      } else if (error.message.includes('Server not responding')) {
        errorMessage = 'Email server is not responding';
        errorDetails = {
          code: 'SERVER_ERROR',
          message: error.message,
          suggestion: 'Check if the backend server is running on port 3000',
          details: error.message
        };
      } else {
        errorDetails = {
          code: 'UNKNOWN_ERROR',
          message: error.message,
          details: error.message
        };
      }
      
      setTestResults({
        type: 'SMTP Test',
        success: false,
        message: errorMessage,
        error: errorDetails
      });
      toast.error('SMTP test failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNewsletterSystem = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      console.log('🧪 Testing newsletter system...');
      const result = await NewsletterService.testNewsletterSystem();
      
      setTestResults({
        type: 'Newsletter System Test',
        success: result.success,
        message: result.message,
        error: result.error
      });
      
      if (result.success) {
        toast.success('Newsletter system test passed!');
      } else {
        toast.error('Newsletter system test failed!');
      }
      
    } catch (error) {
      setTestResults({
        type: 'Newsletter System Test',
        success: false,
        message: 'Newsletter system test failed with error',
        error: error
      });
      toast.error('Newsletter system test failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }
    
    setLoading(true);
    setTestResults(null);
    
    try {
      console.log('🧪 Testing email sending...');
      const response = await fetch(`${EmailService.API_BASE_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testEmail,
          subject: '🧪 Newsletter System Test Email',
          html: `
            <h1>Newsletter System Test</h1>
            <p>This is a test email to verify that your newsletter system is working correctly.</p>
            <p>If you receive this email, congratulations! Your newsletter system is working.</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
          `
        })
      });
      
      const result = await response.json();
      
      setTestResults({
        type: 'Email Test',
        success: result.success,
        message: result.message,
        error: result.error
      });
      
      if (result.success) {
        toast.success('Test email sent successfully!');
      } else {
        toast.error('Test email failed to send!');
      }
      
    } catch (error) {
      setTestResults({
        type: 'Email Test',
        success: false,
        message: 'Email test failed with error',
        error: error
      });
      toast.error('Email test failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleTestSubscription = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }
    
    setLoading(true);
    setTestResults(null);
    
    try {
      console.log('🧪 Testing newsletter subscription...');
      const result = await NewsletterService.subscribeToNewsletter(testEmail);
      
      setTestResults({
        type: 'Subscription Test',
        success: result.success,
        message: result.message,
        error: null
      });
      
      if (result.success) {
        toast.success('Test subscription successful!');
      } else {
        toast.error('Test subscription failed!');
      }
      
    } catch (error) {
      setTestResults({
        type: 'Subscription Test',
        success: false,
        message: 'Subscription test failed with error',
        error: error
      });
      toast.error('Subscription test failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleTestUnsubscription = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }
    
    setLoading(true);
    setTestResults(null);
    
    try {
      console.log('🧪 Testing newsletter unsubscription...');
      const result = await NewsletterService.unsubscribeFromNewsletter(testEmail);
      
      setTestResults({
        type: 'Unsubscription Test',
        success: result.success,
        message: result.message,
        error: null
      });
      
      if (result.success) {
        toast.success('Test unsubscription successful!');
      } else {
        toast.error('Test unsubscription failed!');
      }
      
    } catch (error) {
      setTestResults({
        type: 'Unsubscription Test',
        success: false,
        message: 'Unsubscription test failed with error',
        error: error
      });
      toast.error('Unsubscription test failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🧪 Newsletter System Test Panel
      </h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Email Address
        </label>
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="Enter email for testing"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleTestSMTP}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : '🔌 Test SMTP Connection'}
        </button>
        
        <button
          onClick={handleTestNewsletterSystem}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : '📧 Test Newsletter System'}
        </button>
        
        <button
          onClick={handleTestEmail}
          disabled={loading || !testEmail}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : '📨 Test Email Sending'}
        </button>
        
        <button
          onClick={handleTestSubscription}
          disabled={loading || !testEmail}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : '✅ Test Subscription'}
        </button>
        
        <button
          onClick={handleTestUnsubscription}
          disabled={loading || !testEmail}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : '❌ Test Unsubscription'}
        </button>
      </div>

      {testResults && (
        <div className="mt-6 p-4 rounded-md border">
          <h3 className="font-semibold mb-2">
            {testResults.type} Results
          </h3>
          
          <div className={`p-3 rounded-md ${
            testResults.success 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <p className="font-medium">
              {testResults.success ? '✅ Success' : '❌ Failed'}
            </p>
            <p className="mt-1">{testResults.message}</p>
            
            {testResults.error && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium">
                  ▼ View Error Details
                </summary>
                <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                  {testResults.error.code && (
                    <div className="mb-2">
                      <strong>Error Code:</strong> {testResults.error.code}
                    </div>
                  )}
                  {testResults.error.message && (
                    <div className="mb-2">
                      <strong>Message:</strong> {testResults.error.message}
                    </div>
                  )}
                  {testResults.error.suggestion && (
                    <div className="mb-2 text-blue-600">
                      <strong>💡 Suggestion:</strong> {testResults.error.suggestion}
                    </div>
                  )}
                  {testResults.error.details && (
                    <div className="mb-2">
                      <strong>Details:</strong> {testResults.error.details}
                    </div>
                  )}
                  <pre className="mt-2 text-xs bg-gray-200 p-2 rounded overflow-x-auto">
                    {JSON.stringify(testResults.error, null, 2)}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold mb-2 text-gray-800">📋 Test Instructions</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>First, test the SMTP connection to ensure your email service is configured correctly</li>
          <li>Test the newsletter system to verify database connectivity</li>
          <li>Enter a test email address and test email sending</li>
          <li>Test subscription and unsubscription functionality</li>
          <li>Check the console for detailed logs</li>
        </ol>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold mb-2 text-blue-800">💡 Troubleshooting Tips</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
          <li>Ensure your .env file has the correct SMTP credentials</li>
          <li>Check that Gmail 2FA is enabled and app password is generated</li>
          <li>Verify your Firebase configuration is correct</li>
          <li>Check the browser console for detailed error messages</li>
          <li>Ensure nodemailer is properly installed</li>
        </ul>
      </div>
    </div>
  );
};

export default NewsletterTest;
