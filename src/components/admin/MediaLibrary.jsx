import React, { useState, useContext } from 'react';
import {
  FaImage, FaVideo, FaFile, FaUpload, FaSearch, FaFilter,
  FaTrash, FaEdit, FaDownload, FaEye, FaCopy, FaFolder,
  FaSpinner, FaPlus, FaSortAmountDown, FaThLarge, FaList, FaCalendar
} from 'react-icons/fa';
import myContext from '../../context/data/myContext';
import toast from 'react-hot-toast';

const MediaLibrary = () => {
  const { mode } = useContext(myContext);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploading, setUploading] = useState(false);

  // Mock media data - in real implementation, this would come from Firebase Storage
  const mockMedia = [
    {
      id: 1,
      name: 'hero-image.jpg',
      type: 'image',
      size: '2.4 MB',
      dimensions: '1920x1080',
      url: 'https://via.placeholder.com/400x300/14b8a6/ffffff?text=Hero+Image',
      uploadDate: '2024-01-15',
      alt: 'Hero image for blog'
    },
    {
      id: 2,
      name: 'tutorial-video.mp4',
      type: 'video',
      size: '15.7 MB',
      duration: '3:45',
      url: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Video+Thumbnail',
      uploadDate: '2024-01-14',
      alt: 'Tutorial video'
    },
    {
      id: 3,
      name: 'documentation.pdf',
      type: 'document',
      size: '1.2 MB',
      pages: 24,
      url: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=PDF+Document',
      uploadDate: '2024-01-13',
      alt: 'API documentation'
    },
    {
      id: 4,
      name: 'logo-transparent.png',
      type: 'image',
      size: '456 KB',
      dimensions: '500x500',
      url: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Logo+PNG',
      uploadDate: '2024-01-12',
      alt: 'Company logo'
    },
    {
      id: 5,
      name: 'banner-design.svg',
      type: 'image',
      size: '123 KB',
      dimensions: 'Vector',
      url: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=SVG+Banner',
      uploadDate: '2024-01-11',
      alt: 'Banner design'
    }
  ];

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      toast.success('Media uploaded successfully!');
    }, 2000);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      toast.success('Media deleted successfully!');
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <FaImage className="text-green-500" />;
      case 'video':
        return <FaVideo className="text-blue-500" />;
      case 'document':
        return <FaFile className="text-red-500" />;
      default:
        return <FaFile className="text-gray-500" />;
    }
  };

  const filteredMedia = mockMedia.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.alt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your images, videos, and documents</p>
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <FaSpinner className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FaUpload />
              Upload Media
            </>
          )}
        </button>
      </div>

      {/* Controls */}
      <div className={`p-4 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search media..."
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
              <option value="all">All Media</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className={`group p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                mode === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="relative mb-4">
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity duration-300">
                    <button
                      onClick={() => handleCopyUrl(item.url)}
                      className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                      title="Copy URL"
                    >
                      <FaCopy />
                    </button>
                    <button
                      className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getFileIcon(item.type)}
                  <h3 className="font-medium text-sm truncate">{item.name}</h3>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <p>{item.size}</p>
                  {item.dimensions && <p>{item.dimensions}</p>}
                  {item.duration && <p>{item.duration}</p>}
                  {item.pages && <p>{item.pages} pages</p>}
                  <p className="flex items-center gap-1">
                    <FaCalendar />
                    {item.uploadDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className={`rounded-xl shadow-lg overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className="p-4 text-left font-semibold">File</th>
                  <th className="p-4 text-left font-semibold">Type</th>
                  <th className="p-4 text-left font-semibold">Size</th>
                  <th className="p-4 text-left font-semibold">Dimensions</th>
                  <th className="p-4 text-left font-semibold">Upload Date</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map((item) => (
                  <tr key={item.id} className={`border-t ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.url}
                          alt={item.alt}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.alt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getFileIcon(item.type)}
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </td>
                    <td className="p-4">{item.size}</td>
                    <td className="p-4">{item.dimensions || item.duration || `${item.pages} pages` || 'N/A'}</td>
                    <td className="p-4">{item.uploadDate}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyUrl(item.url)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                          title="Copy URL"
                        >
                          <FaCopy />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:text-green-800"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-2 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredMedia.length === 0 && (
        <div className={`p-12 text-center rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <FaFolder className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No media found</h3>
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first media file to get started'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={handleUpload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600"
            >
              <FaPlus />
              Upload First Media
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
