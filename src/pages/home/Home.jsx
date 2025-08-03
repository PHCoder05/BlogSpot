import React, { useEffect, useContext, useState } from 'react'
import Layout from '../../components/layout/Layout'
import { Helmet } from 'react-helmet'
import myContext from '../../context/data/myContext'
import { 
  FaBookOpen, FaUsers, FaEye, FaHeart, FaArrowRight, FaSearch, FaRss, FaTags,
  FaCalendarAlt, FaPen, FaGraduationCap, FaLightbulb, FaStar, FaCode, FaCloud, FaServer,
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaRocket, FaPlay, FaPause
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import DOMPurify from 'dompurify'

function Home() {
  const context = useContext(myContext)
  const { mode, getAllBlog } = context
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

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

  const featuredPosts = getAllBlog?.slice(0, 6) || []
  const latestPosts = getAllBlog?.slice(0, 3) || []

  const categories = [
    { 
      icon: FaCode, 
      title: 'Programming', 
      description: 'Tutorials, tips, and best practices',
      color: 'from-blue-500 to-cyan-500',
      posts: getAllBlog?.filter(blog => blog.blogs?.category === 'Programming')?.length || 0
    },
    { 
      icon: FaCloud, 
      title: 'Technology', 
      description: 'Latest tech trends and insights',
      color: 'from-green-500 to-emerald-500',
      posts: getAllBlog?.filter(blog => blog.blogs?.category === 'Technology')?.length || 0
    },
    { 
      icon: FaServer, 
      title: 'DevOps', 
      description: 'Cloud, deployment, and automation',
      color: 'from-purple-500 to-pink-500',
      posts: getAllBlog?.filter(blog => blog.blogs?.category === 'DevOps')?.length || 0
    },
    { 
      icon: FaGraduationCap, 
      title: 'Learning', 
      description: 'Educational content and resources',
      color: 'from-orange-500 to-red-500',
      posts: getAllBlog?.filter(blog => blog.blogs?.category === 'Personal')?.length || 0
    }
  ]

  const blogStats = [
    { icon: FaBookOpen, number: `${getAllBlog?.length || 0}+`, label: 'Blog Posts', color: 'from-blue-500 to-purple-600' },
    { icon: FaTags, number: '10+', label: 'Categories', color: 'from-green-500 to-teal-600' },
    { icon: FaUsers, number: '5K+', label: 'Readers', color: 'from-pink-500 to-red-600' },
    { icon: FaHeart, number: '1K+', label: 'Likes', color: 'from-indigo-500 to-purple-600' }
  ]

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
        <section className={`min-h-screen flex items-center justify-center ${
          mode === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-100'
        }`}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className={`${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } transition-all duration-1000 ease-out`}>
              
              {/* Blog Icon */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-6 shadow-2xl animate-pulse">
                  <FaPen className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
                  Welcome to{' '}
                </span>
                <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  PHcoder05 Blog
                </span>
              </h1>
              
              {/* Typing Animation */}
              <div className="text-2xl md:text-3xl font-semibold h-12 flex justify-center items-center gap-4 mb-6">
                <span className={mode === 'dark' ? 'text-teal-300' : 'text-teal-600'}>
                  {typedText}
                  <span className="animate-pulse">|</span>
                </span>
                <button
                  onClick={toggleAnimation}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                >
                  {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                </button>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-12" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}>
                Dive into insightful articles about programming, technology, cloud computing, 
                and software development. Learn, grow, and stay updated with the latest trends 
                in the tech world.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link to="/allblogs">
                  <button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg font-semibold group">
                    <FaBookOpen className="mr-2 inline group-hover:rotate-12 transition-transform" />
                    Explore All Blogs
                  </button>
                </Link>
                
                <Link to="/about">
                  <button className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg font-semibold group">
                    <FaRocket className="mr-2 inline group-hover:animate-pulse" />
                    About Blog
                  </button>
                </Link>
              </div>

              {/* Blog Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {blogStats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`p-4 text-center transition-all duration-300 hover:scale-105 hover:rotate-1 ${
                      mode === 'dark' 
                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' 
                        : 'bg-white/80 border-gray-200 hover:bg-white'
                    } rounded-xl border`}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} mx-auto mb-3 flex items-center justify-center transition-transform hover:scale-110`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <article 
                    key={post.id}
                    className={`group cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${
                      mode === 'dark' 
                        ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
                        : 'bg-white/80 backdrop-blur-sm border border-gray-200'
                    } rounded-xl shadow-lg hover:shadow-2xl overflow-hidden`}
                    onClick={() => window.location.href = `/bloginfo/${post.id}`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        className="w-full h-48 object-cover object-top transition-transform duration-300 group-hover:scale-110"
                        src={post.thumbnail}
                        alt={post.blogs?.title}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {post.blogs?.category && (
                        <div className="absolute top-4 left-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            mode === 'dark' 
                              ? 'bg-teal-500/20 text-teal-300' 
                              : 'bg-teal-100 text-teal-800'
                          }`}>
                            {post.blogs.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                        <FaCalendarAlt className="text-teal-500" />
                        <time>
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </time>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-4 leading-tight group-hover:text-teal-500 transition-colors" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        {post.blogs?.title}
                      </h3>
                      
                      <p className="text-base leading-relaxed mb-4 opacity-80" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}>
                        {truncateText(post.blogs?.content || '', 120)}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-2 ${
                          mode === 'dark' 
                            ? 'text-teal-400 group-hover:text-teal-300' 
                            : 'text-teal-600 group-hover:text-teal-500'
                        }`}>
                          <FaEye />
                          Read More →
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/allblogs">
                  <button className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white py-3 px-6 rounded-xl transition-all duration-300 group">
                    View All Posts
                    <FaArrowRight className="ml-2 inline group-hover:translate-x-1 transition-transform" />
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
            <div className={`p-12 text-center rounded-xl shadow-lg ${
              mode === 'dark' 
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-gradient-to-r from-teal-50 to-blue-50 border-gray-200'
            } border`}>
              <div className="mb-6">
                <FaRss className={`w-12 h-12 mx-auto mb-4 ${mode === 'dark' ? 'text-teal-400' : 'text-teal-500'} animate-pulse`} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}>
                Never Miss a Post!
              </h2>
              <p className="text-lg mb-8" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}>
                Subscribe to our newsletter and get the latest blog posts delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    mode === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-white font-semibold">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export default Home