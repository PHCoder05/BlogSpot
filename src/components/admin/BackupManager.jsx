import React, { useState, useContext } from 'react';
import {
  FaDownload, FaUpload, FaDatabase, FaCloudDownloadAlt, FaCloudUploadAlt,
  FaHistory, FaCalendar, FaFileArchive, FaCheck, FaTimes, FaSpinner,
  FaExclamationTriangle, FaShieldAlt, FaSync, FaTrash, FaCog
} from 'react-icons/fa';
import myContext from '../../context/data/myContext';
import toast from 'react-hot-toast';

const BackupManager = () => {
  const { mode } = useContext(myContext);
  const [activeTab, setActiveTab] = useState('backups');
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);

  // Mock backup data - in real implementation, this would come from your backend
  const mockBackups = [
    {
      id: 1,
      name: 'Full_Backup_2024_01_15',
      type: 'Full',
      size: '45.2 MB',
      date: '2024-01-15T10:30:00Z',
      status: 'completed',
      includes: ['blogs', 'users', 'comments', 'media', 'settings'],
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Blogs_Only_2024_01_14',
      type: 'Partial',
      size: '12.8 MB',
      date: '2024-01-14T15:45:00Z',
      status: 'completed',
      includes: ['blogs'],
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'Weekly_Auto_Backup_2024_01_10',
      type: 'Scheduled',
      size: '42.1 MB',
      date: '2024-01-10T02:00:00Z',
      status: 'completed',
      includes: ['blogs', 'users', 'comments', 'settings'],
      downloadUrl: '#'
    },
    {
      id: 4,
      name: 'Migration_Backup_2024_01_05',
      type: 'Migration',
      size: '38.7 MB',
      date: '2024-01-05T12:00:00Z',
      status: 'completed',
      includes: ['blogs', 'users', 'media'],
      downloadUrl: '#'
    }
  ];

  const [backups, setBackups] = useState(mockBackups);
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: 'weekly',
    retentionDays: 30,
    includeMedia: true,
    compress: true,
    encrypt: false
  });

  const handleCreateBackup = async (type = 'full') => {
    setIsCreatingBackup(true);
    
    // Simulate backup creation
    setTimeout(() => {
      const newBackup = {
        id: Date.now(),
        name: `${type.charAt(0).toUpperCase() + type.slice(1)}_Backup_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}`,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        size: `${(Math.random() * 50 + 10).toFixed(1)} MB`,
        date: new Date().toISOString(),
        status: 'completed',
        includes: type === 'full' 
          ? ['blogs', 'users', 'comments', 'media', 'settings']
          : ['blogs'],
        downloadUrl: '#'
      };
      
      setBackups(prev => [newBackup, ...prev]);
      setIsCreatingBackup(false);
      toast.success('Backup created successfully!');
    }, 3000);
  };

  const handleRestoreBackup = async (backup) => {
    if (!window.confirm(`Are you sure you want to restore from "${backup.name}"? This will overwrite current data.`)) {
      return;
    }

    setIsRestoring(true);
    setSelectedBackup(backup.id);

    // Simulate restore process
    setTimeout(() => {
      setIsRestoring(false);
      setSelectedBackup(null);
      toast.success('Backup restored successfully!');
    }, 5000);
  };

  const handleDeleteBackup = (backupId, backupName) => {
    if (window.confirm(`Are you sure you want to delete "${backupName}"?`)) {
      setBackups(prev => prev.filter(backup => backup.id !== backupId));
      toast.success('Backup deleted successfully!');
    }
  };

  const handleDownloadBackup = (backup) => {
    // In real implementation, this would download the actual backup file
    toast.success(`Downloading ${backup.name}...`);
  };

  const handleSettingsUpdate = (key, value) => {
    setBackupSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Settings updated');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'full':
        return 'text-purple-600 bg-purple-100';
      case 'partial':
        return 'text-blue-600 bg-blue-100';
      case 'scheduled':
        return 'text-green-600 bg-green-100';
      case 'migration':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Backup Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Create, manage, and restore your blog backups</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleCreateBackup('partial')}
            disabled={isCreatingBackup}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FaDatabase />
            Quick Backup
          </button>
          <button
            onClick={() => handleCreateBackup('full')}
            disabled={isCreatingBackup}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {isCreatingBackup ? <FaSpinner className="animate-spin" /> : <FaCloudDownloadAlt />}
            {isCreatingBackup ? 'Creating...' : 'Full Backup'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <FaFileArchive className="text-3xl text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{backups.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Backups</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <FaCheck className="text-3xl text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                {backups.filter(b => b.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <FaCalendar className="text-3xl text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {formatDate(Math.max(...backups.map(b => new Date(b.date)))).split(',')[0]}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Latest Backup</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <FaDatabase className="text-3xl text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {backups.reduce((total, backup) => total + parseFloat(backup.size), 0).toFixed(1)} MB
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Size</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('backups')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'backups'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-900/20'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <FaHistory />
            Backup History
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-900/20'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <FaCog />
            Settings
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'backups' ? (
            /* Backup History */
            <div className="space-y-4">
              {isCreatingBackup && (
                <div className={`p-4 border-2 border-dashed border-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg`}>
                  <div className="flex items-center gap-3">
                    <FaSpinner className="text-blue-600 animate-spin text-xl" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-300">Creating Backup...</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Please wait while we create your backup. This may take a few minutes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {backups.length === 0 ? (
                <div className="text-center py-12">
                  <FaFileArchive className="mx-auto text-6xl text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No backups found</h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6">
                    Create your first backup to protect your data
                  </p>
                  <button
                    onClick={() => handleCreateBackup('full')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600"
                  >
                    <FaCloudDownloadAlt />
                    Create First Backup
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {backups.map((backup) => (
                    <div
                      key={backup.id}
                      className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                        mode === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                      } ${selectedBackup === backup.id && isRestoring ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{backup.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(backup.type)}`}>
                              {backup.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                              {backup.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <FaCalendar />
                              {formatDate(backup.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <FaDatabase />
                              {backup.size}
                            </div>
                            <div className="flex items-center gap-1">
                              <FaShieldAlt />
                              {backup.includes.join(', ')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {selectedBackup === backup.id && isRestoring ? (
                            <div className="flex items-center gap-2 text-blue-600">
                              <FaSpinner className="animate-spin" />
                              <span className="text-sm">Restoring...</span>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleDownloadBackup(backup)}
                                className="p-2 text-green-600 hover:text-green-800 transition-colors"
                                title="Download"
                              >
                                <FaDownload />
                              </button>
                              <button
                                onClick={() => handleRestoreBackup(backup)}
                                disabled={isRestoring}
                                className="p-2 text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                                title="Restore"
                              >
                                <FaCloudUploadAlt />
                              </button>
                              <button
                                onClick={() => handleDeleteBackup(backup.id, backup.name)}
                                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Settings */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Automatic Backups */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Automatic Backups</h3>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Enable Auto Backup</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically create backups on schedule</p>
                    </div>
                    <button
                      onClick={() => handleSettingsUpdate('autoBackup', !backupSettings.autoBackup)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        backupSettings.autoBackup ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          backupSettings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                    <select
                      value={backupSettings.frequency}
                      onChange={(e) => handleSettingsUpdate('frequency', e.target.value)}
                      disabled={!backupSettings.autoBackup}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Retention Period (days)</label>
                    <input
                      type="number"
                      value={backupSettings.retentionDays}
                      onChange={(e) => handleSettingsUpdate('retentionDays', parseInt(e.target.value))}
                      min="1"
                      max="365"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Backups older than this will be deleted automatically</p>
                  </div>
                </div>

                {/* Backup Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Backup Options</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Include Media Files</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Include images and uploads in backups</p>
                      </div>
                      <button
                        onClick={() => handleSettingsUpdate('includeMedia', !backupSettings.includeMedia)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          backupSettings.includeMedia ? 'bg-teal-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            backupSettings.includeMedia ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Compress Backups</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Reduce backup file size</p>
                      </div>
                      <button
                        onClick={() => handleSettingsUpdate('compress', !backupSettings.compress)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          backupSettings.compress ? 'bg-teal-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            backupSettings.compress ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Encrypt Backups</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Password protect backup files</p>
                      </div>
                      <button
                        onClick={() => handleSettingsUpdate('encrypt', !backupSettings.encrypt)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          backupSettings.encrypt ? 'bg-teal-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            backupSettings.encrypt ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Import/Export */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Import/Export</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-6 border-2 border-dashed border-green-300 bg-green-50 dark:bg-green-900/20 rounded-lg text-center`}>
                    <FaUpload className="mx-auto text-3xl text-green-600 mb-3" />
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Import Backup</h4>
                    <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                      Restore from an external backup file
                    </p>
                    <input
                      type="file"
                      accept=".zip,.tar.gz,.json"
                      className="hidden"
                      id="backup-import"
                    />
                    <label
                      htmlFor="backup-import"
                      className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>

                  <div className={`p-6 border-2 border-dashed border-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center`}>
                    <FaDownload className="mx-auto text-3xl text-blue-600 mb-3" />
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Export Settings</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                      Download backup configuration
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Export Config
                    </button>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaExclamationTriangle className="text-yellow-600" />
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Important Notes</h4>
                </div>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  <li>• Always test restore procedures before relying on backups</li>
                  <li>• Store backups in multiple secure locations</li>
                  <li>• Regular backups are essential for data protection</li>
                  <li>• Encrypted backups require a password to restore</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackupManager;
