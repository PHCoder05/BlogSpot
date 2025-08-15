import React, { useState, useEffect, useContext } from 'react';
import {
  FaHeartbeat, FaDatabase, FaServer, FaGlobe, FaShieldAlt,
  FaRocket, FaExclamationTriangle, FaCheckCircle, FaTimes,
  FaSpinner, FaSync, FaDownload, FaCog, FaEye, FaClock,
  FaMemory, FaBolt, FaCloudDownloadAlt, FaWifi
} from 'react-icons/fa';
import myContext from '../../context/data/myContext';
import toast from 'react-hot-toast';

const SiteHealth = () => {
  const { mode } = useContext(myContext);
  const [healthData, setHealthData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(new Date());

  useEffect(() => {
    performHealthCheck();
  }, []);

  const performHealthCheck = async () => {
    setLoading(true);
    
    // Simulate health check process
    setTimeout(() => {
      const mockHealthData = {
        overall: {
          status: 'good',
          score: 87,
          issues: 2,
          warnings: 1
        },
        database: {
          status: 'good',
          responseTime: 45,
          connections: 12,
          size: '156.3 MB',
          lastBackup: '2024-01-15T10:30:00Z'
        },
        performance: {
          status: 'warning',
          loadTime: 2.8,
          firstContentfulPaint: 1.2,
          largestContentfulPaint: 2.8,
          cumulativeLayoutShift: 0.15
        },
        security: {
          status: 'good',
          httpsEnabled: true,
          certificateExpiry: '2024-12-31',
          vulnerabilities: 0,
          lastScan: '2024-01-15T08:00:00Z'
        },
        uptime: {
          status: 'excellent',
          current: 99.98,
          last24h: 100,
          last7d: 99.95,
          incidents: 0
        },
        storage: {
          status: 'good',
          used: 2.4,
          total: 10,
          media: 1.8,
          databases: 0.6
        },
        api: {
          status: 'good',
          responseTime: 120,
          requestsPerMinute: 45,
          errors: 0.02,
          rateLimit: 85
        }
      };

      setHealthData(mockHealthData);
      setLastCheck(new Date());
      setLoading(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <FaCheckCircle className="text-green-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'critical':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaSpinner className="text-gray-500" />;
    }
  };

  const formatDuration = (hours) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      healthData,
      recommendations: [
        'Consider optimizing images to improve load time',
        'Enable additional security headers',
        'Set up monitoring alerts for critical metrics'
      ]
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site_health_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Health report downloaded');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-8 h-8 animate-spin text-teal-500" />
        <span className="ml-3 text-lg">Performing health check...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Health Monitor</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your blog's performance, security, and reliability
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last check: {lastCheck.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaDownload />
            Export Report
          </button>
          <button
            onClick={performHealthCheck}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            <FaSync />
            Run Check
          </button>
        </div>
      </div>

      {/* Overall Health Score */}
      <div className={`p-8 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full">
                <FaHeartbeat className="text-white text-3xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Overall Health Score</h3>
                <p className="text-gray-600 dark:text-gray-400">Your site's health status</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-teal-600 mb-2">{healthData.overall?.score}%</div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(healthData.overall?.status)}`}>
                {healthData.overall?.status?.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{healthData.overall?.issues || 0}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{healthData.overall?.warnings || 0}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {100 - (healthData.overall?.issues || 0) - (healthData.overall?.warnings || 0)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Passed Checks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Database Health */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaDatabase className="text-2xl text-purple-500" />
              <h3 className="font-semibold">Database</h3>
            </div>
            {getStatusIcon(healthData.database?.status)}
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
              <span className="font-medium">{healthData.database?.responseTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Connections:</span>
              <span className="font-medium">{healthData.database?.connections}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Size:</span>
              <span className="font-medium">{healthData.database?.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Backup:</span>
              <span className="font-medium">
                {new Date(healthData.database?.lastBackup).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaRocket className="text-2xl text-blue-500" />
              <h3 className="font-semibold">Performance</h3>
            </div>
            {getStatusIcon(healthData.performance?.status)}
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Load Time:</span>
              <span className={`font-medium ${healthData.performance?.loadTime > 3 ? 'text-red-600' : 'text-green-600'}`}>
                {healthData.performance?.loadTime}s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">FCP:</span>
              <span className="font-medium">{healthData.performance?.firstContentfulPaint}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">LCP:</span>
              <span className="font-medium">{healthData.performance?.largestContentfulPaint}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">CLS:</span>
              <span className="font-medium">{healthData.performance?.cumulativeLayoutShift}</span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-2xl text-green-500" />
              <h3 className="font-semibold">Security</h3>
            </div>
            {getStatusIcon(healthData.security?.status)}
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">HTTPS:</span>
              <span className={`font-medium ${healthData.security?.httpsEnabled ? 'text-green-600' : 'text-red-600'}`}>
                {healthData.security?.httpsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Certificate:</span>
              <span className="font-medium">
                Valid until {new Date(healthData.security?.certificateExpiry).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Vulnerabilities:</span>
              <span className={`font-medium ${healthData.security?.vulnerabilities === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {healthData.security?.vulnerabilities}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Scan:</span>
              <span className="font-medium">
                {new Date(healthData.security?.lastScan).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaGlobe className="text-2xl text-teal-500" />
              <h3 className="font-semibold">Uptime</h3>
            </div>
            {getStatusIcon(healthData.uptime?.status)}
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Current:</span>
              <span className="font-medium text-green-600">{healthData.uptime?.current}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last 24h:</span>
              <span className="font-medium">{healthData.uptime?.last24h}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last 7 days:</span>
              <span className="font-medium">{healthData.uptime?.last7d}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Incidents:</span>
              <span className={`font-medium ${healthData.uptime?.incidents === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {healthData.uptime?.incidents}
              </span>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaMemory className="text-2xl text-orange-500" />
              <h3 className="font-semibold">Storage</h3>
            </div>
            {getStatusIcon(healthData.storage?.status)}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Used:</span>
              <span className="font-medium">{healthData.storage?.used}GB / {healthData.storage?.total}GB</span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${(healthData.storage?.used / healthData.storage?.total) * 100}%` }}
              ></div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Media files:</span>
                <span className="font-medium">{healthData.storage?.media}GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Databases:</span>
                <span className="font-medium">{healthData.storage?.databases}GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* API Health */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaWifi className="text-2xl text-indigo-500" />
              <h3 className="font-semibold">API Health</h3>
            </div>
            {getStatusIcon(healthData.api?.status)}
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
              <span className="font-medium">{healthData.api?.responseTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Requests/min:</span>
              <span className="font-medium">{healthData.api?.requestsPerMinute}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Error Rate:</span>
              <span className={`font-medium ${healthData.api?.errors > 1 ? 'text-red-600' : 'text-green-600'}`}>
                {healthData.api?.errors}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rate Limit:</span>
              <span className="font-medium">{healthData.api?.rateLimit}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaBolt className="text-yellow-500" />
          Recommendations
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <FaExclamationTriangle className="text-yellow-600 mt-1" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Performance Optimization</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Your page load time is {healthData.performance?.loadTime}s. Consider optimizing images and enabling caching to improve performance.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FaShieldAlt className="text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Security Enhancement</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Consider implementing additional security headers and enable two-factor authentication for admin accounts.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <FaCheckCircle className="text-green-600 mt-1" />
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-300">Monitoring Setup</h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Set up automated monitoring alerts to be notified of any critical issues or downtime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteHealth;
