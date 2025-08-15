import React, { useState, useEffect, useContext } from 'react';
import {
  FaUsers, FaFileAlt, FaEnvelope, FaEye, FaThumbsUp, FaComments,
  FaChartLine, FaGlobe, FaDesktop,
  FaArrowUp, FaArrowDown, FaFire, FaRocket, FaStar,
  FaUserPlus, FaSignInAlt, FaDownload, FaSync, FaSpinner
} from 'react-icons/fa';
import UserService from '../../utils/userService';
import NewsletterService from '../../utils/newsletterService';
import myContext from '../../context/data/myContext';
import toast from 'react-hot-toast';

const AdminDashboard = ({ getAllBlog }) => {
  const { mode } = useContext(myContext);
  const [analytics, setAnalytics] = useState({});
  const [userAnalytics, setUserAnalytics] = useState({});
  const [blogStats, setBlogStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [getAllBlog]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [userAnalyticsData, newsletterData] = await Promise.all([
        UserService.getUserAnalytics(),
        NewsletterService.getAllActiveSubscribers()
      ]);

      // Calculate blog statistics
      const blogAnalytics = calculateBlogStats(getAllBlog);
      
      setUserAnalytics(userAnalyticsData);
      setBlogStats(blogAnalytics);
      
      // Combined analytics
      setAnalytics({
        ...userAnalyticsData,
        totalSubscribers: newsletterData.length,
        ...blogAnalytics
      });

      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed!');
  };

  const calculateBlogStats = (blogs) => {
    if (!blogs || blogs.length === 0) return {};

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totalBlogs = blogs.length;
    const totalViews = blogs.reduce((sum, blog) => sum + (blog.blogs?.views || 0), 0);
    const totalLikes = blogs.reduce((sum, blog) => sum + (blog.blogs?.likes || 0), 0);
    const totalComments = blogs.reduce((sum, blog) => sum + (blog.blogs?.comments?.length || 0), 0);

    const blogsToday = blogs.filter(blog => {
      const blogDate = new Date(blog.date);
      return blogDate >= today;
    }).length;

    const blogsThisWeek = blogs.filter(blog => {
      const blogDate = new Date(blog.date);
      return blogDate >= thisWeek;
    }).length;

    const blogsThisMonth = blogs.filter(blog => {
      const blogDate = new Date(blog.date);
      return blogDate >= thisMonth;
    }).length;

    const blogsLastMonth = blogs.filter(blog => {
      const blogDate = new Date(blog.date);
      return blogDate >= lastMonth && blogDate < thisMonth;
    }).length;

    // Category breakdown
    const categoryStats = blogs.reduce((acc, blog) => {
      const category = blog.blogs?.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Top performing blogs
    const topBlogs = blogs
      .sort((a, b) => (b.blogs?.views || 0) - (a.blogs?.views || 0))
      .slice(0, 5)
      .map(blog => ({
        id: blog.id,
        title: blog.blogs?.title,
        views: blog.blogs?.views || 0,
        likes: blog.blogs?.likes || 0,
        date: blog.date
      }));

    const growthRate = blogsLastMonth > 0 
      ? ((blogsThisMonth - blogsLastMonth) / blogsLastMonth * 100).toFixed(1)
      : 0;

    return {
      totalBlogs,
      totalViews,
      totalLikes,
      totalComments,
      blogsToday,
      blogsThisWeek,
      blogsThisMonth,
      blogsLastMonth,
      categoryStats,
      topBlogs,
      growthRate,
      avgViewsPerBlog: totalBlogs > 0 ? Math.round(totalViews / totalBlogs) : 0,
      avgLikesPerBlog: totalBlogs > 0 ? Math.round(totalLikes / totalBlogs) : 0
    };
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const exportDashboardData = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      userAnalytics,
      blogStats,
      analytics
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-8 h-8 animate-spin text-teal-500" />
        <span className="ml-3 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive analytics and insights</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshDashboard}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FaSync className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={exportDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <FaUsers className="text-3xl text-blue-500" />
              <div className="flex items-center gap-1 text-green-600">
                <FaArrowUp className="text-sm" />
                <span className="text-sm font-medium">+{analytics.newUsersThisWeek || 0}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatNumber(analytics.totalUsers)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            <p className="text-xs text-gray-500 mt-1">{analytics.newUsersToday || 0} joined today</p>
          </div>
        </div>

        {/* Total Blogs */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-green-500/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <FaFileAlt className="text-3xl text-teal-500" />
                             <div className="flex items-center gap-1 text-green-600">
                 <FaChartLine className="text-sm" />
                 <span className="text-sm font-medium">{analytics.growthRate || 0}%</span>
               </div>
            </div>
            <p className="text-2xl font-bold text-teal-600">{formatNumber(analytics.totalBlogs)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Blogs</p>
            <p className="text-xs text-gray-500 mt-1">{analytics.blogsThisWeek || 0} this week</p>
          </div>
        </div>

        {/* Total Views */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <FaEye className="text-3xl text-purple-500" />
              <div className="flex items-center gap-1 text-blue-600">
                <FaFire className="text-sm" />
                <span className="text-sm font-medium">Hot</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatNumber(analytics.totalViews)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
            <p className="text-xs text-gray-500 mt-1">Avg: {analytics.avgViewsPerBlog || 0} per blog</p>
          </div>
        </div>

        {/* Newsletter Subscribers */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <FaEnvelope className="text-3xl text-orange-500" />
              <div className="flex items-center gap-1 text-green-600">
                <FaRocket className="text-sm" />
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-600">{formatNumber(analytics.subscribedUsers)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Newsletter Subscribers</p>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.totalUsers > 0 ? Math.round((analytics.subscribedUsers / analytics.totalUsers) * 100) : 0}% of users
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3 mb-4">
            <FaThumbsUp className="text-2xl text-green-500" />
            <div>
              <p className="text-lg font-bold text-green-600">{formatNumber(analytics.totalLikes)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Avg: {analytics.avgLikesPerBlog || 0} per blog</p>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3 mb-4">
            <FaComments className="text-2xl text-blue-500" />
            <div>
              <p className="text-lg font-bold text-blue-600">{formatNumber(analytics.totalComments)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Comments</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Engagement rate</p>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3 mb-4">
            <FaSignInAlt className="text-2xl text-purple-500" />
            <div>
              <p className="text-lg font-bold text-purple-600">{analytics.loginsToday || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Logins</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">{analytics.uniqueLoginsToday || 0} unique users</p>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaChartLine className="text-teal-500" />
            Blog Categories
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.categoryStats || {}).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-medium">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{
                        width: `${(count / analytics.totalBlogs) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Provider Breakdown */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaGlobe className="text-blue-500" />
            User Providers
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.providerBreakdown || {}).map(([provider, count]) => (
              <div key={provider} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {provider === 'email' ? <FaEnvelope className="text-gray-500" /> : 
                   provider === 'google' ? <FaGlobe className="text-red-500" /> :
                   <FaDesktop className="text-blue-500" />}
                  <span className="text-sm font-medium capitalize">{provider}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(count / analytics.totalUsers) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Blogs */}
      <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Top Performing Blogs
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left py-2 font-semibold">Title</th>
                <th className="text-left py-2 font-semibold">Views</th>
                <th className="text-left py-2 font-semibold">Likes</th>
                <th className="text-left py-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {(analytics.topBlogs || []).map((blog, index) => (
                <tr key={blog.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-sm">{blog.title}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <FaEye className="text-blue-500 text-sm" />
                      <span className="text-sm">{formatNumber(blog.views)}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <FaThumbsUp className="text-green-500 text-sm" />
                      <span className="text-sm">{formatNumber(blog.likes)}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{blog.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
