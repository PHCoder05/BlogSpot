import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import myContext from "../../../context/data/myContext";
import { Button, Typography, Card, CardBody, Input, Select, Option } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaPlus, FaSignOutAlt, FaSearch, FaFilter, FaEye, FaEdit, FaTrash, 
  FaChartBar, FaNewspaper, FaCalendarAlt, FaClock, FaTags, FaFolder,
  FaSort, FaSortUp, FaSortDown, FaThumbsUp, FaEyeSlash, FaDownload,
  FaCog, FaBell, FaUser, FaEnvelope, FaGlobe, FaRocket, FaFire, FaImage,
  FaKey
} from 'react-icons/fa';
import SEOComponent from '../../../components/SEOComponent';
import toast from 'react-hot-toast';

function Dashboard() {
  const context = useContext(myContext);
  const { mode, getAllBlog, deleteBlogs } = context;
  const navigate = useNavigate();
  
  // State for enhanced functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/");
    toast.success('Logged out successfully!');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get unique categories for filter
  const categories = ['all', ...new Set(getAllBlog.map(blog => blog.blogs.category))];

  // Filter and sort blogs
  const filteredAndSortedBlogs = getAllBlog
    .filter(blog => {
      const matchesSearch = blog.blogs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.blogs.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || blog.blogs.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.blogs.title.toLowerCase();
          bValue = b.blogs.title.toLowerCase();
          break;
        case 'category':
          aValue = a.blogs.category.toLowerCase();
          bValue = b.blogs.category.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Statistics
  const totalBlogs = getAllBlog.length;
  const publishedThisMonth = getAllBlog.filter(blog => {
    const blogDate = new Date(blog.date);
    const now = new Date();
    return blogDate.getMonth() === now.getMonth() && blogDate.getFullYear() === now.getFullYear();
  }).length;
  
  const totalViews = getAllBlog.reduce((sum, blog) => sum + (blog.blogs.views || 0), 0);
  const avgReadingTime = getAllBlog.length > 0 
    ? Math.round(getAllBlog.reduce((sum, blog) => sum + (parseInt(blog.blogs.readingTime) || 0), 0) / getAllBlog.length)
    : 0;

  // Handle bulk actions
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBlogs(filteredAndSortedBlogs.map(blog => blog.id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleSelectBlog = (blogId, checked) => {
    if (checked) {
      setSelectedBlogs([...selectedBlogs, blogId]);
    } else {
      setSelectedBlogs(selectedBlogs.filter(id => id !== blogId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedBlogs.length === 0) {
      toast.error('No blogs selected');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedBlogs.length} blog(s)?`)) {
      selectedBlogs.forEach(id => deleteBlogs(id));
      setSelectedBlogs([]);
      toast.success(`${selectedBlogs.length} blog(s) deleted successfully!`);
    }
  };

  const handleDeleteBlog = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBlogs(id);
      toast.success('Blog deleted successfully!');
    }
  };

  return (
    <>
      <SEOComponent 
        type="admin"
        currentUrl={window.location.href}
        pageType="dashboard"
      />

      <Layout>
        <div className={`min-h-screen ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto max-w-7xl py-6 px-4">
            
            {/* Header Section */}
            <Card className={`mb-6 overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl border-0`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 ${mode === 'dark' ? 'opacity-20' : 'opacity-30'}`}></div>
              <CardBody className="p-8 relative">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <img
                        className="relative w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                        src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                        alt="profile"
                      />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white shadow-md animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <Typography
                        variant="h3"
                        className={`font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}
                      >
                        Welcome back, Pankaj! 👋
                      </Typography>
                      <Typography
                        variant="paragraph"
                        className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg`}
                      >
                        Manage your blog content and track performance
                      </Typography>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FaNewspaper className="text-teal-500" />
                          <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {totalBlogs} Total Posts
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEye className="text-blue-500" />
                          <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                            {totalViews.toLocaleString()} Views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outlined"
                      size="sm"
                      onClick={() => setShowStats(!showStats)}
                      className="flex items-center gap-2 hover:bg-teal-50 hover:border-teal-500 transition-colors"
                    >
                      <FaChartBar className="text-teal-500" />
                      {showStats ? 'Hide Stats' : 'Show Stats'}
                    </Button>
                    <Link to="/createblog">
                      <Button
                        className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        size="sm"
                      >
                        <FaPlus />
                        New Post
                      </Button>
                    </Link>
                    <Link to="/access-codes">
                      <Button
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        size="sm"
                      >
                        <FaKey />
                        Access Codes
                      </Button>
                    </Link>
                    <Button
                      variant="outlined"
                      size="sm"
                      onClick={logout}
                      className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50 hover:border-red-600 transition-colors"
                    >
                      <FaSignOutAlt />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Statistics Cards */}
            {showStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className={`${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-xl"></div>
                  <CardBody className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Typography variant="h6" className={`${mode === 'dark' ? 'text-gray-200' : 'text-gray-600'} font-medium`}>
                          Total Posts
                        </Typography>
                        <Typography variant="h3" className="font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                          {totalBlogs}
                        </Typography>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <FaRocket className="animate-bounce" />
                          <span>Active</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full shadow-lg">
                        <FaNewspaper className="text-white text-2xl" />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className={`${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl"></div>
                  <CardBody className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Typography variant="h6" className={`${mode === 'dark' ? 'text-gray-200' : 'text-gray-600'} font-medium`}>
                          This Month
                        </Typography>
                        <Typography variant="h3" className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {publishedThisMonth}
                        </Typography>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <FaFire className="animate-pulse" />
                          <span>Trending</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg">
                        <FaCalendarAlt className="text-white text-2xl" />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className={`${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl"></div>
                  <CardBody className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Typography variant="h6" className={`${mode === 'dark' ? 'text-gray-200' : 'text-gray-600'} font-medium`}>
                          Total Views
                        </Typography>
                        <Typography variant="h3" className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {totalViews.toLocaleString()}
                        </Typography>
                        <div className="flex items-center gap-2 text-sm text-purple-600">
                          <FaEye className="animate-pulse" />
                          <span>Growing</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg">
                        <FaEye className="text-white text-2xl" />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className={`${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl"></div>
                  <CardBody className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Typography variant="h6" className={`${mode === 'dark' ? 'text-gray-200' : 'text-gray-600'} font-medium`}>
                          Avg Read Time
                        </Typography>
                        <Typography variant="h3" className="font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          {avgReadingTime}min
                        </Typography>
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <FaClock className="animate-spin" />
                          <span>Engaging</span>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg">
                        <FaClock className="text-white text-2xl" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Controls Section */}
            <Card className={`mb-6 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border-0`}>
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md group">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500 z-10" />
                      <Input
                        type="text"
                        placeholder="Search blogs by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal-500 transition-colors ${mode === 'dark' ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-900 bg-white'}`}
                        containerProps={{ className: "min-w-[250px]" }}
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Select
                        value={selectedCategory}
                        onChange={(value) => setSelectedCategory(value)}
                        className={`relative z-10 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        containerProps={{ className: "min-w-[180px]" }}
                        label="Category"
                        labelProps={{ className: "text-teal-500 font-medium" }}
                      >
                        {categories.map((category) => (
                          <Option key={category} value={category}>
                            {category === 'all' ? '🌐 All Categories' : `📁 ${category}`}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    {/* Sort */}
                    <div className="flex gap-2">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Select
                          value={sortBy}
                          onChange={(value) => setSortBy(value)}
                          className={`relative z-10 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}
                          containerProps={{ className: "min-w-[140px]" }}
                          label="Sort By"
                          labelProps={{ className: "text-purple-500 font-medium" }}
                        >
                          <Option value="date">📅 Date</Option>
                          <Option value="title">📝 Title</Option>
                          <Option value="category">📁 Category</Option>
                        </Select>
                      </div>
                      <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="flex items-center gap-2 px-4 py-2 border-2 hover:border-teal-500 hover:bg-teal-50 transition-all duration-300"
                      >
                        {sortOrder === 'asc' ? <FaSortUp className="text-teal-500" /> : <FaSortDown className="text-teal-500" />}
                        <span className="font-medium">{sortOrder.toUpperCase()}</span>
                      </Button>
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <Button
                      variant={viewMode === 'table' ? 'filled' : 'outlined'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                      className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                        viewMode === 'table' 
                          ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg' 
                          : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FaEye />
                      Table
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'filled' : 'outlined'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                        viewMode === 'grid' 
                          ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg' 
                          : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FaThumbsUp />
                      Grid
                    </Button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedBlogs.length > 0 && (
                  <div className="mt-4 p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border-2 border-red-200/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full">
                          <FaTrash className="text-red-600 text-lg" />
                        </div>
                        <div>
                          <Typography variant="h6" className="text-red-700 font-semibold">
                            {selectedBlogs.length} blog(s) selected
                          </Typography>
                          <Typography variant="small" className="text-red-600">
                            Choose an action to perform on selected items
                          </Typography>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outlined"
                          size="sm"
                          onClick={() => setSelectedBlogs([])}
                          className="border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          <FaEyeSlash className="mr-2" />
                          Clear Selection
                        </Button>
                        <Button
                          variant="filled"
                          size="sm"
                          onClick={handleBulkDelete}
                          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <FaTrash className="mr-2" />
                          Delete Selected
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Content Section */}
            {viewMode === 'table' ? (
              /* Table View */
              <Card className={`${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl border-0 overflow-hidden`}>
                <CardBody className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`${mode === 'dark' ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                        <tr>
                          <th className="p-6 text-left">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedBlogs.length === filteredAndSortedBlogs.length && filteredAndSortedBlogs.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="rounded border-gray-300 focus:ring-teal-500 focus:ring-2"
                              />
                              <span className="text-xs text-gray-500">Select All</span>
                            </div>
                          </th>
                          <th className="p-6 text-left font-semibold text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <FaImage className="text-teal-500" />
                              Thumbnail
                            </div>
                          </th>
                          <th className="p-6 text-left font-semibold text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <FaNewspaper className="text-blue-500" />
                              Title
                            </div>
                          </th>
                          <th className="p-6 text-left font-semibold text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <FaFolder className="text-purple-500" />
                              Category
                            </div>
                          </th>
                          <th className="p-6 text-left font-semibold text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-orange-500" />
                              Date
                            </div>
                          </th>
                          <th className="p-6 text-left font-semibold text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <FaChartBar className="text-green-500" />
                              Stats
                            </div>
                          </th>
                          <th className="p-6 text-left font-semibold text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                              <FaCog className="text-gray-500" />
                              Actions
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedBlogs.length > 0 ? (
                          filteredAndSortedBlogs.map((item, index) => (
                            <tr
                              key={item.id}
                              className={`border-b transition-all duration-300 hover:shadow-md ${
                                mode === 'dark' 
                                  ? 'border-gray-700 hover:bg-gray-700/50' 
                                  : 'border-gray-200 hover:bg-gray-50'
                              } ${selectedBlogs.includes(item.id) ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                            >
                              <td className="p-6">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedBlogs.includes(item.id)}
                                    onChange={(e) => handleSelectBlog(item.id, e.target.checked)}
                                    className="rounded border-gray-300 focus:ring-teal-500 focus:ring-2 w-4 h-4"
                                  />
                                  <span className={`text-xs font-medium ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>#{index + 1}</span>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="relative group">
                                  <img
                                    className="w-20 h-16 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                                    src={item.thumbnail}
                                    alt="thumbnail"
                                  />
                                  <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="space-y-2">
                                  <Typography variant="h6" className="font-bold text-gray-800 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                                    {item.blogs.title}
                                  </Typography>
                                  <div className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-1 text-blue-600">
                                      <FaClock className="text-xs" />
                                      <span>{item.blogs.readingTime || '5 min read'}</span>
                                    </div>
                                    {item.blogs.tags && item.blogs.tags.length > 0 && (
                                      <div className="flex items-center gap-1 text-purple-600">
                                        <FaTags className="text-xs" />
                                        <span>{item.blogs.tags.length} tags</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="space-y-2">
                                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                    mode === 'dark' 
                                      ? 'bg-gradient-to-r from-teal-900/50 to-blue-900/50 text-teal-200 border border-teal-700' 
                                      : 'bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 border border-teal-200'
                                  }`}>
                                    <FaFolder className="text-xs" />
                                    {item.blogs.category}
                                  </span>
                                  {item.blogs.categories && item.blogs.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {item.blogs.categories.slice(0, 2).map((cat, idx) => (
                                        <span key={idx} className={`px-2 py-1 rounded-md text-xs ${
                                          mode === 'dark' 
                                            ? 'bg-gray-700 text-gray-200' 
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                          {cat}
                                        </span>
                                      ))}
                                      {item.blogs.categories.length > 2 && (
                                        <span className={`px-2 py-1 rounded-md text-xs ${
                                          mode === 'dark' 
                                            ? 'bg-gray-700 text-gray-200' 
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                          +{item.blogs.categories.length - 2} more
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                    <FaCalendarAlt className="text-orange-600 dark:text-orange-400 text-sm" />
                                  </div>
                                  <div>
                                    <div className={`font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>{item.date}</div>
                                    <div className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Published</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className={`flex items-center gap-2 p-2 rounded-lg ${
                                      mode === 'dark' 
                                        ? 'bg-blue-900/30 text-blue-300' 
                                        : 'bg-blue-100 text-blue-600'
                                    }`}>
                                      <FaEye className={mode === 'dark' ? 'text-blue-300' : 'text-blue-600'} />
                                      <span className="font-medium">{item.blogs.views || 0}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 p-2 rounded-lg ${
                                      mode === 'dark' 
                                        ? 'bg-green-900/30 text-green-300' 
                                        : 'bg-green-100 text-green-600'
                                    }`}>
                                      <FaThumbsUp className={mode === 'dark' ? 'text-green-300' : 'text-green-600'} />
                                      <span className="font-medium">{item.blogs.likes || 0}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                                                 <div className="flex gap-2">
                                   <Link to={`/bloginfo/${item.id}`}>
                                     <Button
                                       variant="outlined"
                                       size="sm"
                                       className="flex items-center gap-2 px-4 py-2 border-teal-500 text-teal-600 hover:bg-teal-50 hover:border-teal-600 transition-all duration-300"
                                     >
                                       <FaEye />
                                       View
                                     </Button>
                                   </Link>
                                  <Link to={`/editblog/${item.id}`}>
                                    <Button
                                      variant="outlined"
                                      size="sm"
                                      className="flex items-center gap-2 px-4 py-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all duration-300"
                                    >
                                      <FaEdit />
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="outlined"
                                    size="sm"
                                    onClick={() => handleDeleteBlog(item.id, item.blogs.title)}
                                    className="flex items-center gap-2 px-4 py-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 transition-all duration-300"
                                  >
                                    <FaTrash />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="p-8 text-center">
                              <div className="flex flex-col items-center gap-4">
                                <FaNewspaper className="text-6xl text-gray-400" />
                                <Typography variant="h6" className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                  No blogs found
                                </Typography>
                                <Typography variant="small" className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your search or filters' : 'Create your first blog post to get started'}
                                </Typography>
                                {!searchTerm && selectedCategory === 'all' && (
                                  <Link to="/createblog">
                                    <Button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500">
                                      <FaPlus />
                                      Create First Post
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedBlogs.length > 0 ? (
                  filteredAndSortedBlogs.map((item) => (
                    <Card key={item.id} className={`${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                      <CardBody className="p-0">
                        <div className="relative">
                          <img
                            className="w-full h-48 object-cover rounded-t-lg"
                            src={item.thumbnail}
                            alt={item.blogs.title}
                          />
                          <div className="absolute top-2 left-2">
                            <input
                              type="checkbox"
                              checked={selectedBlogs.includes(item.id)}
                              onChange={(e) => handleSelectBlog(item.id, e.target.checked)}
                              className="rounded border-gray-300 bg-white"
                            />
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800`}>
                              {item.blogs.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <Typography variant="h6" className="font-semibold mb-2 line-clamp-2">
                            {item.blogs.title}
                          </Typography>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <FaCalendarAlt />
                              {item.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <FaClock />
                              {item.blogs.readingTime || '5 min read'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <FaEye className="text-blue-500" />
                                <span>{item.blogs.views || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaThumbsUp className="text-green-500" />
                                <span>{item.blogs.likes || 0}</span>
                              </div>
                            </div>
                          </div>
                                                     <div className="flex gap-2">
                             <Link to={`/bloginfo/${item.id}`} className="flex-1">
                               <Button variant="outlined" size="sm" className="w-full flex items-center gap-1">
                                 <FaEye />
                                 View
                               </Button>
                             </Link>
                            <Link to={`/editblog/${item.id}`} className="flex-1">
                              <Button variant="outlined" size="sm" className="w-full flex items-center gap-1">
                                <FaEdit />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outlined"
                              size="sm"
                              onClick={() => handleDeleteBlog(item.id, item.blogs.title)}
                              className="flex items-center gap-1 text-red-500 border-red-500 hover:bg-red-50"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card className={`${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <CardBody className="p-8 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <FaNewspaper className="text-6xl text-gray-400" />
                          <Typography variant="h6" className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            No blogs found
                          </Typography>
                          <Typography variant="small" className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your search or filters' : 'Create your first blog post to get started'}
                          </Typography>
                          {!searchTerm && selectedCategory === 'all' && (
                            <Link to="/createblog">
                              <Button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500">
                                <FaPlus />
                                Create First Post
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Results Summary */}
            {filteredAndSortedBlogs.length > 0 && (
              <div className="mt-6 text-center">
                                      <Typography variant="small" className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Showing {filteredAndSortedBlogs.length} of {getAllBlog.length} blog posts
                      </Typography>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Dashboard;
