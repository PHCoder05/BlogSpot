import React, { useState } from 'react';
import { Button, Card, CardBody, Typography } from '@material-tailwind/react';
import { FaEnvelope, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import EmailService from '../utils/emailService';
import myContext from '../context/data/myContext';
import { useContext } from 'react';

function EmailTest() {
  const { mode } = useContext(myContext);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const testWelcomeEmail = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log('🧪 Testing welcome email to pankajhadole4@gmail.com...');
      
      const result = await EmailService.sendWelcomeEmail('pankajhadole4@gmail.com');
      
      if (result) {
        setMessage('✅ Welcome email sent successfully! Check your inbox and spam folder.');
        setMessageType('success');
        console.log('✅ Welcome email sent successfully!');
        console.log('📧 Check your inbox (and spam folder) for the email');
        console.log('📧 From: phcoder.blog@gmail.com');
        console.log('📧 Subject: 🎉 Welcome to PHcoder Newsletter!');
      } else {
        setMessage('❌ Failed to send welcome email');
        setMessageType('error');
        console.log('❌ Failed to send welcome email');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('error');
      console.error('❌ Error sending welcome email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testBlogNotification = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log('🧪 Testing blog notification email...');
      
      const blogData = {
        id: 'test-blog-123',
        blogs: {
          title: 'Test Blog Post - Simple SMTP Working!',
          content: 'This is a test blog post to verify that the Simple SMTP email system is working correctly. The email system uses direct SMTP connection without any third-party dependencies.',
          readingTime: '2 min read',
          category: 'Technology'
        },
        subscriberEmail: 'pankajhadole4@gmail.com'
      };
      
      const result = await EmailService.sendBlogNotification('pankajhadole4@gmail.com', blogData);
      
      if (result) {
        setMessage('✅ Blog notification email sent successfully! Check your inbox and spam folder.');
        setMessageType('success');
        console.log('✅ Blog notification email sent successfully!');
      } else {
        setMessage('❌ Failed to send blog notification email');
        setMessageType('error');
        console.log('❌ Failed to send blog notification email');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('error');
      console.error('❌ Error sending blog notification email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center mb-4">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <Typography variant="h4" className={`font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Simple SMTP Email Test
            </Typography>
            <Typography variant="paragraph" className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Test the Simple SMTP email system by sending test emails to pankajhadole4@gmail.com
            </Typography>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === 'success' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            }`}>
              {messageType === 'success' ? (
                <FaCheck className="w-5 h-5" />
              ) : (
                <FaTimes className="w-5 h-5" />
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Test Buttons */}
          <div className="space-y-4">
            <Button
              onClick={testWelcomeEmail}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Welcome Email Test'
              )}
            </Button>

            <Button
              onClick={testBlogNotification}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Blog Notification Test'
              )}
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Typography variant="h6" className={`font-semibold mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Simple SMTP Test Instructions:
            </Typography>
            <ul className={`space-y-2 text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Click "Send Welcome Email Test" to test welcome email</li>
              <li>• Click "Send Blog Notification Test" to test blog notification</li>
              <li>• Check your inbox and spam folder for emails</li>
              <li>• Check browser console for detailed logs</li>
              <li>• Emails will be sent to: pankajhadole4@gmail.com</li>
              <li>• Uses direct SMTP connection (no third-party services)</li>
            </ul>
          </div>

          {/* SMTP Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Typography variant="h6" className={`font-semibold mb-2 ${mode === 'dark' ? 'text-white' : 'text-blue-900'}`}>
              Simple SMTP Configuration:
            </Typography>
            <ul className={`space-y-1 text-sm ${mode === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
              <li>• <strong>SMTP Server:</strong> smtp.gmail.com</li>
              <li>• <strong>Port:</strong> 587</li>
              <li>• <strong>From:</strong> phcoder.blog@gmail.com</li>
              <li>• <strong>Authentication:</strong> App Password</li>
              <li>• <strong>No third-party dependencies</strong></li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default EmailTest; 