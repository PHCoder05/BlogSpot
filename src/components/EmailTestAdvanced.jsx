import React, { useState } from 'react';
import EmailService from '../utils/emailService';

const EmailTestAdvanced = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [testEmail] = useState('pankajhadole24@gmail.com');

  // Mock blog data for testing blog notification
  const mockBlogData = {
    id: 'test-blog-post',
    blogs: {
      title: 'Getting Started with React Hooks: A Complete Guide',
      content: `
        <h2>Introduction to React Hooks</h2>
        <p>React Hooks revolutionized the way we write React components by allowing us to use state and other React features in functional components. In this comprehensive guide, we'll explore the most commonly used hooks and learn how to implement them effectively in your React applications.</p>
        
        <h3>What Are React Hooks?</h3>
        <p>Hooks are special functions that let you "hook into" React features. They allow you to use state and other React features without writing a class component. Hooks were introduced in React 16.8 and have since become the preferred way to write React components.</p>
        
        <h3>useState Hook</h3>
        <p>The useState hook is the most fundamental hook in React. It allows you to add state to functional components...</p>
        
        <p>This tutorial covers everything you need to know about React Hooks, including practical examples and best practices.</p>
      `,
      category: 'Programming',
      tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'Tutorial'],
      time: new Date()
    }
  };

  const sendWelcomeTest = async () => {
    setLoading(true);
    setMessage('🔄 Sending welcome test email...');

    try {
      const result = await EmailService.sendWelcomeEmail(testEmail);
      
      if (result) {
        setMessage(`✅ Welcome email sent successfully to ${testEmail}! Check your inbox (and spam folder).`);
      } else {
        setMessage('❌ Failed to send welcome email. Check console for details.');
      }
    } catch (error) {
      console.error('❌ Error sending welcome test email:', error);
      setMessage('❌ Error sending welcome email. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const sendBlogNotificationTest = async () => {
    setLoading(true);
    setMessage('🔄 Sending blog notification test email...');

    try {
      const result = await EmailService.sendBlogNotification(testEmail, mockBlogData);
      
      if (result) {
        setMessage(`✅ Blog notification email sent successfully to ${testEmail}! Check your inbox (and spam folder).`);
      } else {
        setMessage('❌ Failed to send blog notification email. Check console for details.');
      }
    } catch (error) {
      console.error('❌ Error sending blog notification test email:', error);
      setMessage('❌ Error sending blog notification email. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const sendUnsubscribeTest = async () => {
    setLoading(true);
    setMessage('🔄 Sending unsubscribe test email...');

    try {
      const result = await EmailService.sendUnsubscribeEmail(testEmail);
      
      if (result) {
        setMessage(`✅ Unsubscribe email sent successfully to ${testEmail}! Check your inbox (and spam folder).`);
      } else {
        setMessage('❌ Failed to send unsubscribe email. Check console for details.');
      }
    } catch (error) {
      console.error('❌ Error sending unsubscribe test email:', error);
      setMessage('❌ Error sending unsubscribe email. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📧 Advanced Email Testing</h1>
        <p className="text-gray-600">
          Test the improved email templates and functionality
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            <strong>Test Email:</strong> {testEmail}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            All test emails will be sent to this address
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Welcome Email Test */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-semibold text-green-800">Welcome Email</h3>
            <p className="text-green-600 text-sm mt-2">
              Test the new subscriber welcome email with improved design and content
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-green-700 mb-4">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Professional design with brand colors
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Clear expectations and benefits
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Call-to-action button
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Social links and unsubscribe
            </div>
          </div>

          <button
            onClick={sendWelcomeTest}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? '🔄 Sending...' : '📤 Send Welcome Email'}
          </button>
        </div>

        {/* Blog Notification Test */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">📝</div>
            <h3 className="text-xl font-semibold text-blue-800">Blog Notification</h3>
            <p className="text-blue-600 text-sm mt-2">
              Test blog post notification email with rich content formatting
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-blue-700 mb-4">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Blog post metadata (date, reading time, category)
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Content excerpt with formatting
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Tags and category display
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              "Read Full Article" button
            </div>
          </div>

          <button
            onClick={sendBlogNotificationTest}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? '🔄 Sending...' : '📤 Send Blog Notification'}
          </button>
        </div>

        {/* Unsubscribe Email Test */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">👋</div>
            <h3 className="text-xl font-semibold text-orange-800">Unsubscribe Email</h3>
            <p className="text-orange-600 text-sm mt-2">
              Test unsubscribe confirmation email with feedback options
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-orange-700 mb-4">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Friendly goodbye message
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Common unsubscribe reasons
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Resubscribe information
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Feedback request
            </div>
          </div>

          <button
            onClick={sendUnsubscribeTest}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? '🔄 Sending...' : '📤 Send Unsubscribe Email'}
          </button>
        </div>
      </div>

      {/* Mock Blog Data Display */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📄 Mock Blog Data for Testing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-gray-700">Title:</strong>
            <p className="text-gray-600 mt-1">{mockBlogData.blogs.title}</p>
          </div>
          <div>
            <strong className="text-gray-700">Category:</strong>
            <p className="text-gray-600 mt-1">{mockBlogData.blogs.category}</p>
          </div>
          <div>
            <strong className="text-gray-700">Tags:</strong>
            <p className="text-gray-600 mt-1">{mockBlogData.blogs.tags.join(', ')}</p>
          </div>
          <div>
            <strong className="text-gray-700">Content Length:</strong>
            <p className="text-gray-600 mt-1">
              ~{Math.ceil(mockBlogData.blogs.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read
            </p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-lg border text-center font-medium ${
          message.includes('✅') 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : message.includes('❌')
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {message}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">📋 Testing Instructions</h3>
        <div className="space-y-2 text-sm text-yellow-700">
          <p>• <strong>Check Inbox:</strong> Look for emails in {testEmail}</p>
          <p>• <strong>Check Spam:</strong> Gmail might initially place emails in spam folder</p>
          <p>• <strong>Whitelist Sender:</strong> Add your sender email to contacts for better delivery</p>
          <p>• <strong>Check Console:</strong> Look at browser console for detailed logs</p>
          <p>• <strong>Mobile View:</strong> Test emails on mobile devices for responsive design</p>
          <p>• <strong>Email Clients:</strong> Test in different email clients (Gmail, Outlook, Apple Mail)</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTestAdvanced;
