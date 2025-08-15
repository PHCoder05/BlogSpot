import React, { useState, useContext } from 'react';
import {
  FaDatabase, FaShieldAlt, FaEnvelope, FaCog, FaGlobe, FaTachometerAlt,
  FaBell, FaDownload, FaUpload,
  FaExclamationTriangle, FaCheckCircle, FaSave,
  FaEdit, FaTrash, FaPlus, FaSpinner, FaToggleOn, FaToggleOff
} from 'react-icons/fa';
import myContext from '../../context/data/myContext';
import toast from 'react-hot-toast';

const SystemSettings = () => {
  const { mode } = useContext(myContext);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'PHcoder Blog',
    siteDescription: 'A modern blog platform for developers',
    siteUrl: 'https://phcoder.blog',
    adminEmail: 'admin@phcoder.blog',
    timezone: 'UTC',
    language: 'en',
    
    // Security Settings
    enableTwoFactor: true,
    loginAttempts: 5,
    sessionTimeout: 30,
    secureHeaders: true,
    enableCORS: true,
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'phcoder.blog@gmail.com',
    smtpSecure: false,
    
    // Performance Settings
    enableCaching: true,
    cacheTimeout: 3600,
    enableCompression: true,
    maxFileSize: 10,
    
    // Feature Toggles
    enableComments: true,
    enableNewsletter: true,
    enableAnalytics: true,
    enableDarkMode: true,
    enableRegistration: true
  });

  const tabs = [
    { id: 'general', title: 'General', icon: FaCog },
    { id: 'security', title: 'Security', icon: FaShieldAlt },
    { id: 'email', title: 'Email', icon: FaEnvelope },
    { id: 'performance', title: 'Performance', icon: FaTachometerAlt },
    { id: 'features', title: 'Features', icon: FaToggleOn },
    { id: 'backup', title: 'Backup', icon: FaDownload },
    { id: 'system', title: 'System Info', icon: FaDatabase }
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully!');
    }, 1500);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleSettingChange('siteName', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Site URL</label>
          <input
            type="url"
            value={settings.siteUrl}
            onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Site Description</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Admin Email</label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Enable 2FA for admin accounts</p>
          </div>
          <button
            onClick={() => handleSettingChange('enableTwoFactor', !settings.enableTwoFactor)}
            className={`p-1 rounded-full transition-colors ${
              settings.enableTwoFactor ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {settings.enableTwoFactor ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Secure Headers</h4>
            <p className="text-sm text-gray-600">Enable security headers</p>
          </div>
          <button
            onClick={() => handleSettingChange('secureHeaders', !settings.secureHeaders)}
            className={`p-1 rounded-full transition-colors ${
              settings.secureHeaders ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {settings.secureHeaders ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.loginAttempts}
            onChange={(e) => handleSettingChange('loginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            min="1"
            max="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            min="5"
            max="1440"
          />
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">SMTP Host</label>
          <input
            type="text"
            value={settings.smtpHost}
            onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SMTP Port</label>
          <input
            type="number"
            value={settings.smtpPort}
            onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SMTP Username</label>
          <input
            type="text"
            value={settings.smtpUser}
            onChange={(e) => handleSettingChange('smtpUser', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">SMTP Secure</h4>
            <p className="text-sm text-gray-600">Use SSL/TLS encryption</p>
          </div>
          <button
            onClick={() => handleSettingChange('smtpSecure', !settings.smtpSecure)}
            className={`p-1 rounded-full transition-colors ${
              settings.smtpSecure ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {settings.smtpSecure ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
          </button>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FaBell className="text-blue-600" />
          <h4 className="font-medium text-blue-800 dark:text-blue-300">Email Test</h4>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
          Send a test email to verify your SMTP configuration is working.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Send Test Email
        </button>
      </div>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Enable Caching</h4>
            <p className="text-sm text-gray-600">Cache content for faster loading</p>
          </div>
          <button
            onClick={() => handleSettingChange('enableCaching', !settings.enableCaching)}
            className={`p-1 rounded-full transition-colors ${
              settings.enableCaching ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {settings.enableCaching ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Enable Compression</h4>
            <p className="text-sm text-gray-600">Compress files for faster delivery</p>
          </div>
          <button
            onClick={() => handleSettingChange('enableCompression', !settings.enableCompression)}
            className={`p-1 rounded-full transition-colors ${
              settings.enableCompression ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {settings.enableCompression ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cache Timeout (seconds)</label>
          <input
            type="number"
            value={settings.cacheTimeout}
            onChange={(e) => handleSettingChange('cacheTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            min="60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max File Size (MB)</label>
          <input
            type="number"
            value={settings.maxFileSize}
            onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            min="1"
            max="100"
          />
        </div>
      </div>
    </div>
  );

  const renderFeatureSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'enableComments', title: 'Comments', description: 'Allow users to comment on posts' },
          { key: 'enableNewsletter', title: 'Newsletter', description: 'Enable newsletter subscriptions' },
          { key: 'enableAnalytics', title: 'Analytics', description: 'Track site analytics' },
          { key: 'enableDarkMode', title: 'Dark Mode', description: 'Allow users to toggle dark mode' },
          { key: 'enableRegistration', title: 'User Registration', description: 'Allow new user signups' }
        ].map((feature) => (
          <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
            <button
              onClick={() => handleSettingChange(feature.key, !settings[feature.key])}
              className={`p-1 rounded-full transition-colors ${
                settings[feature.key] ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {settings[feature.key] ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border-2 border-dashed border-green-300 bg-green-50 dark:bg-green-900/20 text-center`}>
          <FaDownload className="mx-auto text-3xl text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Export Data</h3>
          <p className="text-sm text-green-700 dark:text-green-400 mb-4">
            Download a backup of all your blog data
          </p>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Export All Data
          </button>
        </div>

        <div className={`p-6 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 dark:bg-blue-900/20 text-center`}>
          <FaUpload className="mx-auto text-3xl text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Import Data</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
            Restore data from a backup file
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Import Data
          </button>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FaExclamationTriangle className="text-yellow-600" />
          <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Backup Recommendations</h4>
        </div>
        <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
          <li>• Create backups before major updates</li>
          <li>• Store backups in a secure location</li>
          <li>• Test restore process regularly</li>
          <li>• Keep multiple backup versions</li>
        </ul>
      </div>
    </div>
  );

  const renderSystemInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h4 className="font-medium mb-3">System Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <div className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" />
                <span className="text-sm text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Service</span>
              <div className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" />
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage</span>
              <div className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" />
                <span className="text-sm text-green-600">Available</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h4 className="font-medium mb-3">System Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Version:</span>
              <span>2.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Node.js:</span>
              <span>18.17.0</span>
            </div>
            <div className="flex justify-between">
              <span>React:</span>
              <span>18.2.0</span>
            </div>
            <div className="flex justify-between">
              <span>Firebase:</span>
              <span>10.12.2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'email':
        return renderEmailSettings();
      case 'performance':
        return renderPerformanceSettings();
      case 'features':
        return renderFeatureSettings();
      case 'backup':
        return renderBackupSettings();
      case 'system':
        return renderSystemInfo();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure your blog system settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 disabled:opacity-50"
        >
          {saving ? (
            <>
              <FaSpinner className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FaSave />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-900/20'
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="text-sm" />
              <span className="hidden sm:inline">{tab.title}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
