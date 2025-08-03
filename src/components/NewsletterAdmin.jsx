import React, { useState, useEffect, useContext } from 'react';
import { FaUsers, FaEnvelope, FaBell, FaTrash, FaEye, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import NewsletterService from '../utils/newsletterService';
import myContext from '../context/data/myContext';

const NewsletterAdmin = () => {
  const { mode } = useContext(myContext);
  const [subscribers, setSubscribers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, notifs] = await Promise.all([
        NewsletterService.getAllActiveSubscribers(),
        NewsletterService.getNotificationHistory()
      ]);
      setSubscribers(subs);
      setNotifications(notifs);
    } catch (error) {
      showMessage('Failed to load newsletter data.', 'error');
    } finally {
      setLoading(false);
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

  const handleUnsubscribe = async (email) => {
    try {
      const result = await NewsletterService.unsubscribeFromNewsletter(email);
      if (result.success) {
        showMessage(result.message, 'success');
        loadData(); // Reload data
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Failed to unsubscribe user.', 'error');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.toDate()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-8 h-8 animate-spin text-teal-500" />
        <span className="ml-3 text-lg">Loading newsletter data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
          Newsletter Management
        </h2>
        <p className="text-lg" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}>
          Manage subscribers and view notification history
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center justify-center gap-3 ${
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-xl shadow-lg ${
          mode === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
                {subscribers.length}
              </p>
              <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Active Subscribers
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${
          mode === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <FaEnvelope className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
                {notifications.length}
              </p>
              <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Notifications Sent
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${
          mode === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <FaBell className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
                {notifications.reduce((total, notif) => total + (notif.recipientCount || 0), 0)}
              </p>
              <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Emails Sent
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      <div className={`rounded-xl shadow-lg ${
        mode === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border border-gray-200 dark:border-gray-700 overflow-hidden`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
            Active Subscribers
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
                  Subscribed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${mode === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className={`${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaEnvelope className="w-4 h-4 mr-3 text-teal-500" />
                      <span style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
                        {subscriber.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
                    {formatDate(subscriber.subscribedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleUnsubscribe(subscriber.email)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      title="Unsubscribe"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {subscribers.length === 0 && (
            <div className="text-center py-12">
              <FaEnvelope className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className={`text-lg ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                No subscribers yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notification History */}
      <div className={`rounded-xl shadow-lg ${
        mode === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border border-gray-200 dark:border-gray-700 overflow-hidden`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
            Notification History
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
                  Blog Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
                  Sent Date
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${mode === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {notifications.map((notification) => (
                <tr key={notification.id} className={`${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaBell className="w-4 h-4 mr-3 text-blue-500" />
                      <span style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
                        {notification.blogTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
                    {notification.recipientCount} subscribers
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: mode === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)' }}>
                    {formatDate(notification.sentAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {notifications.length === 0 && (
            <div className="text-center py-12">
              <FaBell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className={`text-lg ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                No notifications sent yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterAdmin; 