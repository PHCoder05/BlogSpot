import React, { useState, useEffect, useContext } from 'react';
import {
  FaTags, FaFolder, FaPlus, FaEdit, FaTrash, FaSearch,
  FaSave, FaTimes, FaSpinner, FaSort, FaChartBar, FaEye
} from 'react-icons/fa';
import myContext from '../../context/data/myContext';
import toast from 'react-hot-toast';

const CategoriesManager = () => {
  const { mode } = useContext(myContext);
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', color: '#14b8a6' });
  const [loading, setLoading] = useState(true);

  // Mock data - in real implementation, this would come from Firebase
  const mockCategories = [
    {
      id: 1,
      name: 'React',
      slug: 'react',
      description: 'Articles about React framework and ecosystem',
      color: '#61dafb',
      postCount: 15,
      createdAt: '2024-01-15',
      isActive: true
    },
    {
      id: 2,
      name: 'JavaScript',
      slug: 'javascript',
      description: 'JavaScript tutorials and best practices',
      color: '#f7df1e',
      postCount: 23,
      createdAt: '2024-01-10',
      isActive: true
    },
    {
      id: 3,
      name: 'CSS',
      slug: 'css',
      description: 'Styling and layout techniques',
      color: '#1572b6',
      postCount: 8,
      createdAt: '2024-01-05',
      isActive: true
    },
    {
      id: 4,
      name: 'Node.js',
      slug: 'nodejs',
      description: 'Server-side JavaScript development',
      color: '#339933',
      postCount: 12,
      createdAt: '2024-01-01',
      isActive: false
    }
  ];

  const mockTags = [
    { id: 1, name: 'tutorial', color: '#14b8a6', postCount: 25, createdAt: '2024-01-15' },
    { id: 2, name: 'beginner', color: '#3b82f6', postCount: 18, createdAt: '2024-01-14' },
    { id: 3, name: 'advanced', color: '#8b5cf6', postCount: 10, createdAt: '2024-01-13' },
    { id: 4, name: 'tips', color: '#f59e0b', postCount: 22, createdAt: '2024-01-12' },
    { id: 5, name: 'best-practices', color: '#ef4444', postCount: 15, createdAt: '2024-01-11' },
    { id: 6, name: 'performance', color: '#10b981', postCount: 8, createdAt: '2024-01-10' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
      setTags(mockTags);
      setLoading(false);
    }, 1000);
  };

  const handleAdd = () => {
    if (!newItem.name.trim()) {
      toast.error('Name is required');
      return;
    }

    const newId = Math.max(...(activeTab === 'categories' ? categories : tags).map(item => item.id)) + 1;
    const item = {
      id: newId,
      ...newItem,
      slug: newItem.name.toLowerCase().replace(/\s+/g, '-'),
      postCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    };

    if (activeTab === 'categories') {
      setCategories(prev => [...prev, item]);
    } else {
      setTags(prev => [...prev, item]);
    }

    setNewItem({ name: '', description: '', color: '#14b8a6' });
    toast.success(`${activeTab === 'categories' ? 'Category' : 'Tag'} added successfully!`);
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleUpdate = () => {
    if (!editingItem.name.trim()) {
      toast.error('Name is required');
      return;
    }

    const updatedItem = {
      ...editingItem,
      slug: editingItem.name.toLowerCase().replace(/\s+/g, '-')
    };

    if (activeTab === 'categories') {
      setCategories(prev => prev.map(cat => cat.id === editingItem.id ? updatedItem : cat));
    } else {
      setTags(prev => prev.map(tag => tag.id === editingItem.id ? updatedItem : tag));
    }

    setEditingItem(null);
    toast.success(`${activeTab === 'categories' ? 'Category' : 'Tag'} updated successfully!`);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      if (activeTab === 'categories') {
        setCategories(prev => prev.filter(cat => cat.id !== id));
      } else {
        setTags(prev => prev.filter(tag => tag.id !== id));
      }
      toast.success(`${activeTab === 'categories' ? 'Category' : 'Tag'} deleted successfully!`);
    }
  };

  const handleToggleStatus = (id) => {
    if (activeTab === 'categories') {
      setCategories(prev => prev.map(cat => 
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
      ));
    }
    toast.success('Status updated successfully!');
  };

  const getFilteredItems = () => {
    const items = activeTab === 'categories' ? categories : tags;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const generateColorPalette = () => {
    const colors = [
      '#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
      '#10b981', '#6366f1', '#ec4899', '#f97316', '#84cc16'
    ];
    return colors;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-8 h-8 animate-spin text-teal-500" />
        <span className="ml-3 text-lg">Loading categories and tags...</span>
      </div>
    );
  }

  const filteredItems = getFilteredItems();
  const stats = {
    categories: {
      total: categories.length,
      active: categories.filter(c => c.isActive).length,
      totalPosts: categories.reduce((sum, c) => sum + c.postCount, 0)
    },
    tags: {
      total: tags.length,
      totalPosts: tags.reduce((sum, t) => sum + t.postCount, 0)
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories & Tags</h2>
          <p className="text-gray-600 dark:text-gray-400">Organize your content with categories and tags</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <FaFolder className="text-3xl text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.categories.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Categories</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <FaTags className="text-3xl text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.tags.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tags</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <FaChartBar className="text-3xl text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.categories.totalPosts}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Posts in Categories</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <FaEye className="text-3xl text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.categories.active}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'categories'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-900/20'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <FaFolder />
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'tags'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-900/20'
                : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <FaTags />
            Tags ({tags.length})
          </button>
        </div>

        <div className="p-6">
          {/* Add New Form */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-4">Add New {activeTab === 'categories' ? 'Category' : 'Tag'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={`${activeTab === 'categories' ? 'Category' : 'Tag'} name`}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              {activeTab === 'categories' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newItem.color}
                    onChange={(e) => setNewItem(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 border rounded-lg"
                  />
                  <div className="flex gap-1">
                    {generateColorPalette().slice(0, 5).map(color => (
                      <button
                        key={color}
                        onClick={() => setNewItem(prev => ({ ...prev, color }))}
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  <FaPlus />
                  Add {activeTab === 'categories' ? 'Category' : 'Tag'}
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full md:w-auto"
              />
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                mode === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
              }`}>
                {editingItem && editingItem.id === item.id ? (
                  /* Edit Mode */
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    
                    {activeTab === 'categories' && (
                      <div>
                        <input
                          type="text"
                          value={editingItem.description || ''}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingItem.color}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, color: e.target.value }))}
                        className="w-12 h-10 border rounded-lg"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <FaSave />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{item.name}</h3>
                          <span className="text-xs text-gray-500">({item.slug})</span>
                          {activeTab === 'categories' && (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>{item.postCount} posts</span>
                          <span>Created: {item.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {activeTab === 'categories' && (
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            item.isActive
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {item.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              {activeTab === 'categories' ? <FaFolder className="mx-auto text-6xl text-gray-400 mb-4" /> : <FaTags className="mx-auto text-6xl text-gray-400 mb-4" />}
              <p className="text-xl text-gray-600 dark:text-gray-400">No {activeTab} found</p>
              <p className="text-gray-500 dark:text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria' : `Create your first ${activeTab === 'categories' ? 'category' : 'tag'} to get started`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesManager;
