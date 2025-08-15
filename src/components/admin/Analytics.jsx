import React, { useState, useEffect, useContext } from 'react';
import {
  FaChartLine, FaEye, FaUsers, FaThumbsUp, FaComments,
  FaCalendar, FaGlobe, FaMobile, FaDesktop, FaDownload,
  FaShare, FaHeart, FaBookmark, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import myContext from '../../context/data/myContext';

const Analytics = ({ getAllBlog }) => {
  const { mode } = useContext(myContext);
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    generateAnalytics();
  }, [getAllBlog, timeRange]);

  const generateAnalytics = () => {
    if (!getAllBlog || getAllBlog.length === 0) return;

    const now = new Date();
    const ranges = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };

    const daysBack = ranges[timeRange];
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Filter blogs by date range
    const blogsInRange = getAllBlog.filter(blog => {
      const blogDate = new Date(blog.date);
      return blogDate >= startDate;
    });

    // Calculate metrics
    const totalViews = blogsInRange.reduce((sum, blog) => sum + (blog.blogs?.views || 0), 0);
    const totalLikes = blogsInRange.reduce((sum, blog) => sum + (blog.blogs?.likes || 0), 0);
    const totalComments = blogsInRange.reduce((sum, blog) => sum + (blog.blogs?.comments?.length || 0), 0);
    const totalShares = blogsInRange.reduce((sum, blog) => sum + (blog.blogs?.shares || 0), 0);

    // Top performing posts
    const topPosts = getAllBlog
      .sort((a, b) => (b.blogs?.views || 0) - (a.blogs?.views || 0))
      .slice(0, 5)
      .map(blog => ({
        id: blog.id,
        title: blog.blogs?.title,
        views: blog.blogs?.views || 0,
        likes: blog.blogs?.likes || 0,
        comments: blog.blogs?.comments?.length || 0,
        category: blog.blogs?.category,
        date: blog.date
      }));

    // Daily views (mock data for chart)
    const dailyViews = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const views = Math.floor(Math.random() * 500) + 100;
      dailyViews.push({
        date: date.toISOString().split('T')[0],
        views: views,
        users: Math.floor(views * 0.7),
        newUsers: Math.floor(views * 0.3)
      });
    }

    // Traffic sources (mock data)
    const trafficSources = [
      { source: 'Direct', visitors: Math.floor(totalViews * 0.35), percentage: 35 },
      { source: 'Google Search', visitors: Math.floor(totalViews * 0.25), percentage: 25 },
      { source: 'Social Media', visitors: Math.floor(totalViews * 0.20), percentage: 20 },
      { source: 'Referral', visitors: Math.floor(totalViews * 0.15), percentage: 15 },
      { source: 'Email', visitors: Math.floor(totalViews * 0.05), percentage: 5 }
    ];

    // Device breakdown (mock data)
    const deviceStats = [
      { device: 'Desktop', visitors: Math.floor(totalViews * 0.60), icon: FaDesktop },
      { device: 'Mobile', visitors: Math.floor(totalViews * 0.35), icon: FaMobile },
      { device: 'Tablet', visitors: Math.floor(totalViews * 0.05), icon: FaDesktop }
    ];

    // Popular categories
    const categoryStats = getAllBlog.reduce((acc, blog) => {
      const category = blog.blogs?.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { views: 0, posts: 0 };
      }
      acc[category].views += blog.blogs?.views || 0;
      acc[category].posts += 1;
      return acc;
    }, {});

    const popularCategories = Object.entries(categoryStats)
      .map(([category, stats]) => ({ category, ...stats }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    setAnalytics({
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      blogsInRange: blogsInRange.length,
      topPosts,
      dailyViews,
      trafficSources,
      deviceStats,
      popularCategories,
      avgViews: blogsInRange.length > 0 ? Math.round(totalViews / blogsInRange.length) : 0,
      engagementRate: totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(1) : 0
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getChangeIndicator = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous * 100).toFixed(1);
    const isPositive = change > 0;
    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
        {Math.abs(change)}%
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your blog performance and engagement</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <FaEye className="text-3xl text-blue-500" />
              {getChangeIndicator(analytics.totalViews, analytics.totalViews * 0.8)}
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatNumber(analytics.totalViews)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
            <p className="text-xs text-gray-500 mt-1">Avg: {analytics.avgViews} per post</p>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <FaThumbsUp className="text-3xl text-green-500" />
              {getChangeIndicator(analytics.totalLikes, analytics.totalLikes * 0.9)}
            </div>
            <p className="text-2xl font-bold text-green-600">{formatNumber(analytics.totalLikes)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
            <p className="text-xs text-gray-500 mt-1">Engagement: {analytics.engagementRate}%</p>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <FaComments className="text-3xl text-purple-500" />
              {getChangeIndicator(analytics.totalComments, analytics.totalComments * 1.1)}
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatNumber(analytics.totalComments)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Comments</p>
            <p className="text-xs text-gray-500 mt-1">Community engagement</p>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <FaShare className="text-3xl text-orange-500" />
              {getChangeIndicator(analytics.totalShares, analytics.totalShares * 0.7)}
            </div>
            <p className="text-2xl font-bold text-orange-600">{formatNumber(analytics.totalShares)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Shares</p>
            <p className="text-xs text-gray-500 mt-1">Social reach</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaGlobe className="text-teal-500" />
            Traffic Sources
          </h3>
          <div className="space-y-4">
            {analytics.trafficSources?.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{source.source}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {source.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaDesktop className="text-blue-500" />
            Device Breakdown
          </h3>
          <div className="space-y-4">
            {analytics.deviceStats?.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <device.icon className="text-gray-500" />
                  <span className="text-sm font-medium">{device.device}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatNumber(device.visitors)} visitors
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Posts and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Posts */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaChartLine className="text-green-500" />
            Top Performing Posts
          </h3>
          <div className="space-y-4">
            {analytics.topPosts?.map((post, index) => (
              <div key={post.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-xs text-gray-500">{post.category}</span>
                  </div>
                  <h4 className="font-medium text-sm line-clamp-2 mb-2">{post.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaEye />
                      {formatNumber(post.views)}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaThumbsUp />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaComments />
                      {post.comments}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div className={`p-6 rounded-xl shadow-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaBookmark className="text-purple-500" />
            Popular Categories
          </h3>
          <div className="space-y-4">
            {analytics.popularCategories?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{category.category}</span>
                  <p className="text-xs text-gray-500">{category.posts} posts</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-blue-600">
                    <FaEye />
                    <span className="font-medium">{formatNumber(category.views)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {Math.round(category.views / category.posts)} avg views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const data = { analytics, timeRange, generatedAt: new Date().toISOString() };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            window.URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600"
        >
          <FaDownload />
          Export Analytics
        </button>
      </div>
    </div>
  );
};

export default Analytics;
