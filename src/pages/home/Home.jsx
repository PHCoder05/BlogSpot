import React, { useEffect, useContext, useState } from 'react'
import Layout from '../../components/layout/Layout'
import { Helmet } from 'react-helmet'
import myContext from '../../context/data/myContext'
import { 
  FaBookOpen, FaUsers, FaEye, FaHeart, FaArrowRight, FaSearch, FaRss, FaTags,
  FaCalendarAlt, FaPen, FaGraduationCap, FaLightbulb, FaStar, FaCode, FaCloud, FaServer,
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaRocket, FaPlay, FaPause, FaShare, FaBookmark,
  FaFire, FaNewspaper, FaTimes, FaList, FaThLarge, FaFilter, FaSort
} from 'react-icons/fa'
import NewsletterSubscription from '../../components/NewsletterSubscription'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify'

function Home() {
  const context = useContext(myContext)
  const { mode, getAllBlog } = context
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const blogTopics = [
    'Programming Tutorials',
    'Tech Insights', 
    'Development Tips',
    'Cloud Computing',
    'Software Engineering'
  ]

  useEffect(() => {
    // Only scroll to top on initial mount, not on every re-render
    const timer = setTimeout(() => setIsVisible(true), 100)

    if (isPlaying) {
      const topic = blogTopics[currentTopicIndex]
      let charIndex = 0
      
      const typeInterval = setInterval(() => {
        if (charIndex < topic.length) {
          setTypedText(topic.substring(0, charIndex + 1))
          charIndex++
        } else {
          setTimeout(() => {
            setCurrentTopicIndex((prev) => (prev + 1) % blogTopics.length)
            setTypedText('')
          }, 2000)
          clearInterval(typeInterval)
        }
      }, 100)

      return () => {
        clearTimeout(timer)
        clearInterval(typeInterval)
      }
    }
  }, [currentTopicIndex, isPlaying])

  // Separate useEffect for initial scroll to top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying)
  }

  const truncateText = (text, limit) => {
    const sanitizedText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    const cleanedText = sanitizedText.replace(/&nbsp;/g, ' ')
    return cleanedText.length <= limit ? cleanedText : cleanedText.substring(0, limit) + '...'
  }

  // Filter blogs based on search and category
  const filteredBlogs = getAllBlog?.filter(blog => {
    const matchesSearch = !searchTerm || 
      blog.blogs?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.blogs?.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.blogs?.category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
      blog.blogs?.category?.toLowerCase() === selectedCategory.toLowerCase()
    
    return matchesSearch && matchesCategory
  }) || []

  const featuredPosts = filteredBlogs.slice(0, 6)
  const latestPosts = getAllBlog?.slice(0, 3) || []

  const categories = [
    { 
      id: 'all',
      icon: FaNewspaper, 
      title: 'All Categories', 
      description: 'Browse all articles',
      color: 'from-blue-500 to-cyan-500',
      posts: getAllBlog?.length || 0
    },
    { 
      id: 'programming',
      icon: FaCode, 
      title: 'Programming', 
      description: 'Tutorials, tips, and best practices',
      color: 'from-green-500 to-emerald-500',
      posts: getAllBlog?.filter(blog => blog.blogs?.category === 'Programming')?.length || 0
    },
    { 
      id: 'technology',
      icon: FaCloud, 
      title: 'Technology', 
      description: 'Latest tech trends and insights',
      color: 'from-purple-500 to-pink-500',
      posts: getAllBlog?.filter(blog => blog.blogs?.category === 'Technology')?.length || 0
    },
    { 
      id: 'devops',
      icon: FaServer, 
      title: 'DevOps', 
      description: 'Cloud, deployment, and automation',
      color: 'from-orange-500 to-red-500',
      posts: getAllBlog?.filter(blog => blog.blogs?.category === 'DevOps')?.length || 0
    }
  ]

  const blogStats = [
    { icon: FaBookOpen, number: `${getAllBlog?.length || 0}+`, label: 'Blog Posts', color: 'from-blue-500 to-purple-600' },
    { icon: FaTags, number: '10+', label: 'Categories', color: 'from-green-500 to-teal-600' },
    { icon: FaUsers, number: '5K+', label: 'Readers', color: 'from-pink-500 to-red-600' },
    { icon: FaHeart, number: '1K+', label: 'Likes', color: 'from-indigo-500 to-purple-600' }
  ]

  const handleBlogClick = (id) => {
    window.location.href = `/bloginfo/${id}`
  }

  const handleShare = (blog) => {
    if (navigator.share) {
      navigator.share({
        title: blog.blogs?.title,
        text: blog.blogs?.content?.substring(0, 100) + '...',
        url: window.location.origin + `/bloginfo/${blog.id}`
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/bloginfo/${blog.id}`)
      alert('Link copied to clipboard!')
    }
  }

  const handleLike = (blogId) => {
    // Implement like functionality
    console.log('Liked blog:', blogId)
  }

  const handleBookmark = (blogId) => {
    // Implement bookmark functionality
    console.log('Bookmarked blog:', blogId)
  }

  return (
    <>
      <Helmet>
        <title>PHcoder05 - Technology Blog & Programming Tutorials | Pankaj Hadole</title>
        <meta name="description" content="Explore insightful technology blogs, programming tutorials, DevOps guides, and development tips. Stay updated with the latest in tech, cloud computing, and software development." />
        <meta name="keywords" content="technology blog, programming tutorials, DevOps, cloud computing, software development, web development, tech news, programming tips, coding tutorials, Pankaj Hadole" />
        <meta name="author" content="Pankaj Hadole" />
        
        {/* Open Graph */}
        <meta property="og:title" content="PHcoder05 - Technology Blog & Programming Tutorials" />
        <meta property="og:description" content="Explore insightful technology blogs, programming tutorials, DevOps guides, and development tips." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://phcoder05.vercel.app/" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PHcoder05 - Technology Blog & Programming Tutorials" />
        <meta name="twitter:description" content="Explore insightful technology blogs, programming tutorials, DevOps guides, and development tips." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://phcoder05.vercel.app/" />
      </Helmet>
      
      <Layout>
        {/* Hero Section */}
        <section className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
          mode === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-100'
        }`}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div className={`${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } transition-all duration-1000 ease-out`}>
              
              {/* Blog Icon with Enhanced Animation */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-6 shadow-2xl animate-pulse hover:animate-bounce transition-all duration-300 hover:scale-110">
                  <FaPen className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Enhanced Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
                  Welcome to{' '}
                </span>
                                 <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient hover:scale-105 transition-transform duration-300">
                   TechCraft Hub
                 </span>
              </h1>
              
              {/* Enhanced Typing Animation */}
              <div className="text-2xl md:text-3xl font-semibold h-16 flex justify-center items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className={mode === 'dark' ? 'text-teal-300' : 'text-teal-600'}>
                    {typedText}
                    <span className="animate-pulse text-teal-500">|</span>
                  </span>
                  <button
                    onClick={toggleAnimation}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors hover:scale-110"
                    aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                  >
                    {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
                  </button>
                </div>
              </div>

              {/* Enhanced Description with Icons */}
              <div className="max-w-4xl mx-auto mb-12">
                <p className="text-lg md:text-xl leading-relaxed mb-6" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}>
                  Dive into insightful articles about programming, technology, cloud computing, 
                  and software development. Learn, grow, and stay updated with the latest trends 
                  in the tech world.
                </p>
                
                {/* Feature Highlights */}
                <div className="flex flex-wrap justify-center gap-6 mt-8">
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: mode === 'dark' ? 'rgb(203, 213, 225)' : 'rgb(100, 116, 139)' }}>
                    <FaCode className="text-teal-500" />
                    <span>Programming Tutorials</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: mode === 'dark' ? 'rgb(203, 213, 225)' : 'rgb(100, 116, 139)' }}>
                    <FaCloud className="text-blue-500" />
                    <span>Cloud Computing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: mode === 'dark' ? 'rgb(203, 213, 225)' : 'rgb(100, 116, 139)' }}>
                    <FaServer className="text-purple-500" />
                    <span>DevOps Guides</span>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Link to="/allblogs">
                  <button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg font-semibold group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <FaBookOpen className="mr-3 inline group-hover:rotate-12 transition-transform" />
                    Explore All Blogs
                  </button>
                </Link>
                
                <Link to="/about">
                  <button className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg font-semibold group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <FaRocket className="mr-3 inline group-hover:animate-pulse" />
                    About Blog
                  </button>
                </Link>
              </div>

              {/* Enhanced Blog Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {blogStats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`p-6 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                      mode === 'dark' 
                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:shadow-2xl' 
                        : 'bg-white/80 border-gray-200 hover:bg-white hover:shadow-2xl'
                    } rounded-xl border backdrop-blur-sm`}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} mx-auto mb-4 flex items-center justify-center transition-transform hover:scale-110 hover:rotate-12`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className={`text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Search and Filter Section */}
        <section className={`py-12 ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className={`p-8 rounded-2xl shadow-xl backdrop-blur-sm ${
              mode === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/90 border-gray-200'
            } border`}>
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                
                {/* Enhanced Search Input */}
                <div className="relative flex-1 w-full">
                  <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search articles, topics, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 ${
                      mode === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400'
                    }`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FaTimes className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Enhanced Category Filter */}
                <div className="flex gap-3 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                          : mode === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                      }`}
                    >
                      <category.icon className={`w-4 h-4 ${selectedCategory === category.id ? 'animate-pulse' : ''}`} />
                      <span className="hidden sm:inline font-medium">{category.title}</span>
                    </button>
                  ))}
                </div>

                {/* Enhanced View Mode Toggle */}
                <div className="flex gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                        : mode === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-gray-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                    title="Grid View"
                  >
                    <FaThLarge className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                        : mode === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-gray-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                    title="List View"
                  >
                    <FaList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className={`py-16 ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                  Featured Posts
                </h2>
                <p className="text-lg" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}>
                  Discover our most popular and insightful articles
                </p>
              </div>

              {/* Results Summary */}
              <div className={`mb-6 p-4 rounded-lg ${
                mode === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-md`}>
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <p className={`${
                    mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Showing {featuredPosts.length} articles
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="flex items-center gap-2 text-teal-500 hover:text-teal-600 transition-colors duration-200"
                    >
                      <FaTimes className="w-4 h-4" />
                      Clear search
                    </button>
                  )}
                </div>
              </div>

              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                : "space-y-8"
              }>
                {featuredPosts.map((post, index) => {
                  const { thumbnail, date, id, blogs } = post;
                  return (
                    <div 
                      key={id} 
                      className={`group ${
                        viewMode === 'grid' 
                          ? 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-200 dark:border-gray-700 overflow-hidden hover-lift' 
                          : 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      
                      {viewMode === 'grid' ? (
                        // Grid View
                        <>
                                                  {/* Enhanced Blog Thumbnail */}
                        <div className="relative overflow-hidden">
                          <img
                            onClick={() => handleBlogClick(id)}
                            className="w-full h-56 object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                            src={thumbnail}
                            alt={blogs?.title || "Blog Thumbnail"}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                              {blogs?.category || 'Tech'}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <FaEye className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                    
                                                  {/* Enhanced Blog Content */}
                        <div className="p-6">
                          <div className="flex items-center gap-3 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className={`w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                                {new Date(date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="flex items-center gap-1">
                              <FaEye className={`w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                                {Math.floor(Math.random() * 1000) + 100} views
                              </span>
                            </div>
                          </div>
                          
                          <h3 
                            onClick={() => handleBlogClick(id)}
                            className="text-xl font-bold mb-4 cursor-pointer hover:text-teal-500 transition-colors duration-300 line-clamp-2"
                            style={{ color: mode === 'dark' ? 'white' : 'black' }}
                          >
                            {blogs?.title}
                          </h3>
                          
                          <p className={`mb-6 line-clamp-3 leading-relaxed ${
                            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {truncateText(blogs?.content || '', 120)}
                          </p>

                            {/* Enhanced Action Buttons */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleLike(id)}
                                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-110 group"
                                  title="Like"
                                >
                                  <FaHeart className="w-4 h-4 text-red-500 group-hover:animate-pulse" />
                                </button>
                                <button
                                  onClick={() => handleShare(post)}
                                  className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110 group"
                                  title="Share"
                                >
                                  <FaShare className="w-4 h-4 text-blue-500 group-hover:animate-pulse" />
                                </button>
                                <button
                                  onClick={() => handleBookmark(id)}
                                  className="p-2 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300 hover:scale-110 group"
                                  title="Bookmark"
                                >
                                  <FaBookmark className="w-4 h-4 text-yellow-500 group-hover:animate-pulse" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleBlogClick(id)}
                                className="flex items-center gap-2 text-teal-500 hover:text-teal-600 font-semibold transition-all duration-300 hover:gap-3 group"
                              >
                                <span>Read More</span>
                                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        // List View
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3">
                            <img
                              onClick={() => handleBlogClick(id)}
                              className="w-full h-48 object-cover rounded-lg cursor-pointer"
                              src={thumbnail}
                              alt={blogs?.title || "Blog Thumbnail"}
                            />
                          </div>
                          <div className="md:w-2/3">
                            <div className="flex items-center gap-4 mb-3">
                              <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {blogs?.category || 'Tech'}
                              </span>
                              <div className="flex items-center gap-2 text-sm">
                                <FaCalendarAlt className={`w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                <span className={mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{date}</span>
                              </div>
                            </div>

                            <h3 
                              onClick={() => handleBlogClick(id)}
                              className="text-2xl font-bold mb-3 cursor-pointer hover:text-teal-500 transition-colors duration-200"
                              style={{ color: mode === 'dark' ? 'white' : 'black' }}
                            >
                              {blogs?.title}
                            </h3>

                            <p className={`mb-4 ${
                              mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {truncateText(blogs?.content || '', 200)}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleLike(id)}
                                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                  title="Like"
                                >
                                  <FaHeart className="w-4 h-4 text-red-500" />
                                </button>
                                <button
                                  onClick={() => handleShare(post)}
                                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                  title="Share"
                                >
                                  <FaShare className="w-4 h-4 text-blue-500" />
                                </button>
                                <button
                                  onClick={() => handleBookmark(id)}
                                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                  title="Bookmark"
                                >
                                  <FaBookmark className="w-4 h-4 text-yellow-500" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleBlogClick(id)}
                                className="text-teal-500 hover:text-teal-600 font-medium transition-colors duration-200"
                              >
                          Read More →
                              </button>
                            </div>
                          </div>
                      </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {featuredPosts.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
                    <FaSearch className="w-12 h-12 text-teal-500" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    mode === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {searchTerm ? 'No articles found' : 'No articles available'}
                  </h3>
                  <p className={`text-lg mb-6 ${
                    mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {searchTerm 
                      ? `No articles match "${searchTerm}". Try adjusting your search terms.`
                      : 'Check back soon for new content!'
                    }
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}

              <div className="text-center mt-16">
                <Link to="/allblogs">
                  <button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg font-semibold group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative flex items-center gap-3">
                      <FaBookOpen className="w-5 h-5" />
                      View All Posts
                      <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className={`py-16 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
                Explore by Category
              </h2>
              <p className="text-lg" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}>
                Discover content tailored to your interests
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div 
                  key={index}
                  onClick={() => window.location.href = '/allblogs'}
                  className={`p-6 text-center transition-all duration-300 hover:scale-105 cursor-pointer group ${
                    mode === 'dark' 
                      ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' 
                      : 'bg-white/80 border-gray-200 hover:bg-white'
                  } rounded-xl border`}
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {category.title}
                  </h3>
                  <p className={`mb-3 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {category.description}
                  </p>
                  <div className="text-sm text-teal-500 font-semibold group-hover:text-teal-400 transition-colors">
                    {category.posts} Posts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className={`py-16 ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto px-6">
            <NewsletterSubscription />
          </div>
        </section>
      </Layout>
    </>
  )
}

export default Home