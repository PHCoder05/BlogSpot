import React, { useState, useEffect, useContext } from 'react';
import { 
  FaUsers, FaUserPlus, FaUserMinus, FaEnvelope, FaEnvelopeOpen,
  FaBan, FaCheck, FaEye, FaSearch, FaFilter, FaDownload,
  FaSpinner, FaClock, FaGlobe, FaUserCheck, FaUserTimes,
  FaChartBar, FaCalendar, FaSignInAlt, FaMobile, FaDesktop
} from 'react-icons/fa';
import UserService from '../../utils/userService';
import NewsletterService from '../../utils/newsletterService';
import myContext from '../../context/data/myContext';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const { mode } = useContext(myContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDetails, setShowDetails] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterType]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, analyticsData] = await Promise.all([
        UserService.getUsersWithNewsletterStatus(),
        UserService.getUserAnalytics()
      ]);
      
      setUsers(usersData);
      setAnalytics(analyticsData);
      console.log('✅ User management data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    switch (filterType) {
      case 'subscribed':
        filtered = filtered.filter(user => user.newsletter?.subscribed);
        break;
      case 'unsubscribed':
        filtered = filtered.filter(user => !user.newsletter?.subscribed);
        break;
      case 'active':
        filtered = filtered.filter(user => user.isActive);
        break;
      case 'banned':
        filtered = filtered.filter(user => !user.isActive);
        break;
      case 'new':
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(user => {
          const createdAt = user.createdAt?.toDate();
          return createdAt && createdAt >= weekAgo;
        });
        break;
      default:
        break;
    }

    setFilteredUsers(filtered);
  };

  const handleNewsletterToggle = async (email, currentStatus) => {
    try {
      const result = await UserService.updateNewsletterPreference(email, !currentStatus);
      if (result.success) {
        toast.success(result.message);
        await loadData(); // Reload data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error updating newsletter preference:', error);
      toast.error('Failed to update newsletter preference');
    }
  };

  const handleUserStatusToggle = async (uid, currentStatus) => {
    try {
      const result = await UserService.updateUserStatus(uid, currentStatus);
      if (result.success) {
        toast.success(result.message);
        await loadData(); // Reload data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleBulkNewsletterUpdate = async (subscribe) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    try {
      const promises = selectedUsers.map(userId => {
        const user = users.find(u => u.uid === userId);
        return UserService.updateNewsletterPreference(user.email, subscribe);
      });

      await Promise.all(promises);
      toast.success(`${subscribe ? 'Subscribed' : 'Unsubscribed'} ${selectedUsers.length} users`);
      setSelectedUsers([]);
      await loadData();
    } catch (error) {
      console.error('Error bulk updating newsletter:', error);
      toast.error('Failed to update newsletter preferences');
    }
  };

  const handleSelectUser = (uid) => {
    setSelectedUsers(prev => 
      prev.includes(uid) 
        ? prev.filter(id => id !== uid)
        : [...prev, uid]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.uid)
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return <FaDesktop className="text-gray-400" />;
    return userAgent.includes('Mobile') 
      ? <FaMobile className="text-blue-500" />
      : <FaDesktop className="text-green-500" />;
  };

  const exportUsers = () => {
    const csvContent = [
      ['Email', 'Display Name', 'Newsletter', 'Status', 'Created', 'Last Login', 'Login Count'].join(','),
      ...filteredUsers.map(user => [
        user.email,
        user.displayName,
        user.newsletter?.subscribed ? 'Subscribed' : 'Not Subscribed',
        user.isActive ? 'Active' : 'Banned',
        formatDate(user.createdAt),
        formatDate(user.lastLogin),
        user.loginCount || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-8 h-8 animate-spin text-teal-500" />
        <span className="ml-3 text-lg">Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-teal-600">{analytics.totalUsers || 0}</p>
            </div>
            <FaUsers className="text-3xl text-teal-500" />
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Newsletter Subscribers</p>
              <p className="text-2xl font-bold text-green-600">{analytics.subscribedUsers || 0}</p>
            </div>
            <FaEnvelope className="text-3xl text-green-500" />
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Week</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.newUsersThisWeek || 0}</p>
            </div>
            <FaUserPlus className="text-3xl text-blue-500" />
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Logins</p>
              <p className="text-2xl font-bold text-purple-600">{analytics.loginsToday || 0}</p>
            </div>
            <FaSignInAlt className="text-3xl text-purple-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="subscribed">Newsletter Subscribers</option>
              <option value="unsubscribed">Not Subscribed</option>
              <option value="active">Active Users</option>
              <option value="banned">Banned Users</option>
              <option value="new">New Users (7 days)</option>
            </select>
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2 w-full lg:w-auto">
            {selectedUsers.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkNewsletterUpdate(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <FaEnvelopeOpen />
                  Subscribe ({selectedUsers.length})
                </button>
                <button
                  onClick={() => handleBulkNewsletterUpdate(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <FaEnvelope />
                  Unsubscribe ({selectedUsers.length})
                </button>
              </>
            )}
            <button
              onClick={exportUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaDownload />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="p-4 text-left font-semibold">User</th>
                <th className="p-4 text-left font-semibold">Newsletter</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Provider</th>
                <th className="p-4 text-left font-semibold">Joined</th>
                <th className="p-4 text-left font-semibold">Last Login</th>
                <th className="p-4 text-left font-semibold">Logins</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.uid} className={`border-t ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.uid)}
                      onChange={() => handleSelectUser(user.uid)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=teal&color=fff`}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.displayName || 'Anonymous'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleNewsletterToggle(user.email, user.newsletter?.subscribed)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        user.newsletter?.subscribed
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {user.newsletter?.subscribed ? (
                        <>
                          <FaEnvelopeOpen className="text-green-600" />
                          Subscribed
                        </>
                      ) : (
                        <>
                          <FaEnvelope className="text-gray-600" />
                          Not Subscribed
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleUserStatusToggle(user.uid, user.isActive)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        user.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <FaUserCheck className="text-green-600" />
                          Active
                        </>
                      ) : (
                        <>
                          <FaUserTimes className="text-red-600" />
                          Banned
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(user.userAgent)}
                      <span className="text-sm capitalize">{user.provider || 'email'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaCalendar />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FaClock />
                      {formatDate(user.lastLogin)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {user.loginCount || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setShowDetails(showDetails === user.uid ? null : user.uid)}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="mx-auto text-6xl text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No users found</p>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full mx-4 rounded-xl shadow-2xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {(() => {
              const user = users.find(u => u.uid === showDetails);
              return (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">User Details</h3>
                    <button
                      onClick={() => setShowDetails(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email)}&background=teal&color=fff`}
                        alt={user?.displayName}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h4 className="text-xl font-semibold">{user?.displayName || 'Anonymous'}</h4>
                        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User ID</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 break-all">{user?.uid}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Provider</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user?.provider || 'email'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <p className={`text-sm font-medium ${user?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {user?.isActive ? 'Active' : 'Banned'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Newsletter</label>
                        <p className={`text-sm font-medium ${user?.newsletter?.subscribed ? 'text-green-600' : 'text-gray-600'}`}>
                          {user?.newsletter?.subscribed ? 'Subscribed' : 'Not Subscribed'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joined</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(user?.createdAt)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(user?.lastLogin)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Logins</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user?.loginCount || 0}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Newsletter Subscribed</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(user?.newsletter?.subscribedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
