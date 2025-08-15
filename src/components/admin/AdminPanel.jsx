import React, { useState, useContext } from 'react';
import {
  FaChartBar, FaCog, FaUsers, FaFileAlt, FaEnvelope, FaImage,
  FaKey, FaDatabase, FaShieldAlt, FaPalette, FaGlobe, FaCode,
  FaPlug, FaBell, FaComments, FaTags, FaCalendar,
  FaTools, FaLayerGroup, FaRocket, FaHeadset, FaGift, FaArrowLeft, FaChartLine,
  FaDownload, FaHeartbeat
} from 'react-icons/fa';
import { Button } from "@material-tailwind/react";
import myContext from '../../context/data/myContext';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import NewsletterAdmin from '../NewsletterAdmin';
import MediaLibrary from './MediaLibrary';
import SystemSettings from './SystemSettings';
import CommentsManager from './CommentsManager';
import CategoriesManager from './CategoriesManager';
import Analytics from './Analytics';
import BackupManager from './BackupManager';
import SiteHealth from './SiteHealth';
import toast from 'react-hot-toast';

const AdminPanel = ({ getAllBlog, deleteBlogs }) => {
  const { mode } = useContext(myContext);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDashboardMode, setIsDashboardMode] = useState(true);

  // Admin Panel Menu Items (WordPress-like)
  const adminMenuItems = [
    {
      id: 'posts',
      title: 'Posts',
      icon: FaFileAlt,
      badge: getAllBlog?.length || 0,
      description: 'Manage blog posts and articles',
      subItems: [
        { id: 'all-posts', title: 'All Posts', count: getAllBlog?.length || 0 },
        { id: 'add-new-post', title: 'Add New' },
        { id: 'categories', title: 'Categories' },
        { id: 'tags', title: 'Tags' }
      ]
    },
    {
      id: 'media',
      title: 'Media',
      icon: FaImage,
      description: 'Upload and manage images, videos',
      subItems: [
        { id: 'library', title: 'Library' },
        { id: 'add-new-media', title: 'Add New' }
      ]
    },
    {
      id: 'comments',
      title: 'Comments',
      icon: FaComments,
      badge: '12',
      description: 'Moderate and manage comments',
      subItems: [
        { id: 'all-comments', title: 'All Comments' },
        { id: 'pending-comments', title: 'Pending', count: 3 },
        { id: 'approved-comments', title: 'Approved' },
        { id: 'spam-comments', title: 'Spam' }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: FaPalette,
      description: 'Customize your site design',
      subItems: [
        { id: 'themes', title: 'Themes' },
        { id: 'customize', title: 'Customize' },
        { id: 'widgets', title: 'Widgets' },
        { id: 'menus', title: 'Menus' }
      ]
    },
    {
      id: 'plugins',
      title: 'Plugins',
      icon: FaPlug,
      description: 'Extend functionality with plugins',
      subItems: [
        { id: 'installed-plugins', title: 'Installed Plugins' },
        { id: 'add-plugins', title: 'Add New' },
        { id: 'plugin-editor', title: 'Plugin Editor' }
      ]
    },
    {
      id: 'tools',
      title: 'Tools',
      icon: FaTools,
      description: 'Import, export, and other tools',
      subItems: [
        { id: 'import', title: 'Import' },
        { id: 'export', title: 'Export' },
        { id: 'site-health', title: 'Site Health' },
        { id: 'privacy', title: 'Export Personal Data' }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: FaCog,
      description: 'Configure your site settings',
      subItems: [
        { id: 'general', title: 'General' },
        { id: 'writing', title: 'Writing' },
        { id: 'reading', title: 'Reading' },
        { id: 'discussion', title: 'Discussion' },
        { id: 'media-settings', title: 'Media' },
        { id: 'privacy-settings', title: 'Privacy' }
      ]
    }
  ];

  // Dashboard Menu Items
  const dashboardMenuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: FaChartBar,
      description: 'Site overview and analytics'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: FaChartLine,
      description: 'Detailed analytics and insights'
    },
    {
      id: 'users',
      title: 'User Management',
      icon: FaUsers,
      badge: 'New',
      description: 'Manage users and permissions'
    },
    {
      id: 'comments',
      title: 'Comments',
      icon: FaComments,
      description: 'Moderate and manage comments'
    },
    {
      id: 'categories',
      title: 'Categories & Tags',
      icon: FaTags,
      description: 'Organize content with categories and tags'
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      icon: FaEnvelope,
      description: 'Newsletter subscribers and campaigns'
    },
    {
      id: 'media-library',
      title: 'Media Library',
      icon: FaImage,
      description: 'Manage media files'
    },
    {
      id: 'backups',
      title: 'Backup Manager',
      icon: FaDownload,
      description: 'Create and restore backups'
    },
    {
      id: 'health',
      title: 'Site Health',
      icon: FaHeartbeat,
      description: 'Monitor site performance and health'
    },
    {
      id: 'system',
      title: 'System Settings',
      icon: FaDatabase,
      description: 'System configuration and maintenance'
    }
  ];

  const handleMenuClick = (itemId) => {
    setCurrentView(itemId);
    
    // Handle special cases
    if (itemId === 'add-new-post') {
      window.location.href = '/createblog';
      return;
    }
    
    if (itemId === 'all-posts') {
      window.location.href = '/dashboard';
      return;
    }

    // Show coming soon for unimplemented features
    const unimplementedItems = [
      'categories', 'tags', 'add-new-media', 'all-comments', 'pending-comments',
      'approved-comments', 'spam-comments', 'themes', 'customize', 'widgets',
      'menus', 'installed-plugins', 'add-plugins', 'plugin-editor', 'import',
      'export', 'site-health', 'privacy', 'general', 'writing', 'reading',
      'discussion', 'media-settings', 'privacy-settings'
    ];

    if (unimplementedItems.includes(itemId)) {
      toast.success(`${itemId.replace('-', ' ')} feature coming soon!`);
    }
  };

  const renderContent = () => {
    if (isDashboardMode) {
      switch (currentView) {
        case 'dashboard':
          return <AdminDashboard getAllBlog={getAllBlog} />;
        case 'analytics':
          return <Analytics getAllBlog={getAllBlog} />;
        case 'users':
          return <UserManagement />;
        case 'comments':
          return <CommentsManager />;
        case 'categories':
          return <CategoriesManager />;
        case 'newsletter':
          return <NewsletterAdmin />;
        case 'media-library':
          return <MediaLibrary />;
        case 'backups':
          return <BackupManager />;
        case 'health':
          return <SiteHealth />;
        case 'system':
          return <SystemSettings />;
        default:
          return <AdminDashboard getAllBlog={getAllBlog} />;
      }
    } else {
      // Admin Panel mode - show WordPress-like interface
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenuItems.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                mode === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg">
                    <item.icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    {item.badge && (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {item.description}
              </p>
              
              <div className="space-y-2">
                {item.subItems?.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => handleMenuClick(subItem.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      mode === 'dark' 
                        ? 'hover:bg-gray-600 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{subItem.title}</span>
                      {subItem.count && (
                        <span className="text-xs text-gray-500">({subItem.count})</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header with Toggle */}
        <div className={`mb-8 p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl">
                {isDashboardMode ? (
                  <FaChartBar className="text-white text-2xl" />
                ) : (
                  <FaCog className="text-white text-2xl" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {isDashboardMode ? 'Admin Dashboard' : 'Admin Panel'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {isDashboardMode 
                    ? 'Analytics, user management, and system monitoring'
                    : 'WordPress-style administration interface'
                  }
                </p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                size="sm"
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center gap-2 border-gray-500 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <FaArrowLeft />
                Back to Main Dashboard
              </Button>
              <Button
                variant={isDashboardMode ? "filled" : "outlined"}
                size="sm"
                onClick={() => {
                  setIsDashboardMode(true);
                  setCurrentView('dashboard');
                }}
                className={`flex items-center gap-2 ${
                  isDashboardMode
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500'
                    : 'border-teal-500 text-teal-500 hover:bg-teal-50'
                }`}
              >
                <FaChartBar />
                Dashboard
              </Button>
              <Button
                variant={!isDashboardMode ? "filled" : "outlined"}
                size="sm"
                onClick={() => {
                  setIsDashboardMode(false);
                  setCurrentView('admin-panel');
                }}
                className={`flex items-center gap-2 ${
                  !isDashboardMode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'border-purple-500 text-purple-500 hover:bg-purple-50'
                }`}
              >
                <FaCog />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation (only in dashboard mode) */}
        {isDashboardMode && (
          <div className={`mb-6 p-4 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-wrap gap-2">
              {dashboardMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                      : mode === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <item.icon className="text-sm" />
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.badge && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="mb-6">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className={`mt-8 p-4 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>© 2024 PHcoder Blog</span>
              <span>•</span>
              <span>Version 2.0</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FaRocket className="text-teal-500" />
                Powered by React & Firebase
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 hover:text-teal-500 transition-colors">
                <FaHeadset />
                Support
              </button>
              <button className="flex items-center gap-1 hover:text-teal-500 transition-colors">
                <FaGift />
                What's New
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;