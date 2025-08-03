import React, { useContext, useEffect, useState } from 'react';
import { Typography, Button, Card, CardBody } from '@material-tailwind/react';
import myContext from '../../context/data/myContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaRocket, FaCode, FaCloud, FaServer, 
  FaBookOpen, FaUsers, FaEye, FaHeart, FaArrowRight, FaSearch, FaRss, FaTags,
  FaCalendarAlt, FaPen, FaGraduationCap, FaLightbulb, FaStar, FaPlay, FaPause
} from 'react-icons/fa';
import './HeroSection.css';

function HeroSection() {
  const context = useContext(myContext);
  const { mode, getAllBlog } = context;
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const blogTopics = [
    'Programming Tutorials',
    'Tech Insights', 
    'Development Tips',
    'Cloud Computing',
    'Software Engineering'
  ];

  useEffect(() => {
    // Animation delays
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Typing animation for blog topics
    if (isPlaying) {
      const topic = blogTopics[currentTopicIndex];
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex < topic.length) {
          setTypedText(topic.substring(0, charIndex + 1));
          charIndex++;
        } else {
          setTimeout(() => {
            setCurrentTopicIndex((prev) => (prev + 1) % blogTopics.length);
            setTypedText('');
          }, 2000);
          clearInterval(typeInterval);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(typeInterval);
      };
    }
  }, [currentTopicIndex, isPlaying]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExploreBlogsClick = () => {
    navigate('/allblogs');
  };

  const handleSubscribeClick = () => {
    // Could implement newsletter subscription
    navigate('/allblogs');
  };

  const handleSearchClick = () => {
    navigate('/allblogs');
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com/phcoder05', label: 'GitHub', color: 'hover:text-gray-800' },
    { icon: FaLinkedin, url: 'https://linkedin.com/in/pankaj-hadole', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: FaTwitter, url: 'https://twitter.com/phcoder05', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: FaEnvelope, url: 'mailto:pankajhadole24@gmail.com', label: 'Email', color: 'hover:text-red-500' }
  ];

  const blogStats = [
    { icon: FaBookOpen, number: `${getAllBlog?.length || 0}+`, label: 'Blog Posts', color: 'from-blue-500 to-purple-600' },
    { icon: FaTags, number: '10+', label: 'Categories', color: 'from-green-500 to-teal-600' },
    { icon: FaUsers, number: '5K+', label: 'Readers', color: 'from-pink-500 to-red-600' },
    { icon: FaHeart, number: '1K+', label: 'Likes', color: 'from-indigo-500 to-purple-600' }
  ];

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
  ];

  const featuredPosts = getAllBlog?.slice(0, 3) || [];

  return (
    <div className={`min-h-screen overflow-hidden ${
      mode === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-100'
    }`}>
      
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="bubbles-overlay" style={{ transform: `translateY(${scrollY * 0.5}px)` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
      </div>

      {/* Main Hero Section */}
      <section className="relative z-10 pt-24 pb-16">
        <div className={`max-w-7xl mx-auto px-6 text-center ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } transition-all duration-1000 ease-out`}>
          
          {/* Enhanced Blog Icon with Animation */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-6 shadow-2xl animate-pulse">
              <FaPen className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Enhanced Main Heading */}
          <div className="space-y-6 mb-12">
            <Typography
              variant="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
            >
              Welcome to{' '}
              <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                PHcoder05 Blog
              </span>
            </Typography>
            
            {/* Enhanced Typing Animation with Controls */}
            <div className="text-2xl md:text-3xl font-semibold h-12 flex justify-center items-center gap-4">
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

            <Typography
              variant="paragraph"
              className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
              style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}
            >
              Dive into insightful articles about programming, technology, cloud computing, 
              and software development. Learn, grow, and stay updated with the latest trends 
              in the tech world.
            </Typography>
          </div>

          {/* Enhanced CTA Buttons with Better Hover Effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={handleExploreBlogsClick}
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg font-semibold group"
            >
              <FaBookOpen className="mr-2 group-hover:rotate-12 transition-transform" />
              Explore All Blogs
            </Button>
            
            <Button
              onClick={handleSubscribeClick}
              variant="outlined"
              size="lg"
              className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg font-semibold group"
            >
              <FaRss className="mr-2 group-hover:animate-pulse" />
              Subscribe for Updates
            </Button>
            
            <Button
              onClick={handleSearchClick}
              variant="text"
              size="lg"
              className="text-teal-500 hover:bg-teal-50 py-4 px-8 rounded-xl transition-all duration-300 text-lg font-semibold group"
            >
              <FaSearch className="mr-2 group-hover:scale-110 transition-transform" />
              Search Articles
            </Button>
          </div>

          {/* Enhanced Blog Stats with Hover Effects */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {blogStats.map((stat, index) => (
              <Card 
                key={index}
                className={`p-4 text-center transition-all duration-300 hover:scale-105 hover:rotate-1 ${
                  mode === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' 
                    : 'bg-white/80 border-gray-200 hover:bg-white'
                }`}
              >
                <CardBody className="p-2">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} mx-auto mb-3 flex items-center justify-center transition-transform hover:scale-110`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className={`text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Categories */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Typography
              variant="h2"
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
            >
              Explore by Category
            </Typography>
            <Typography
              variant="paragraph"
              className="text-lg"
              style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}
            >
              Discover content tailored to your interests
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={index}
                onClick={() => navigate('/allblogs')}
                className={`p-6 text-center transition-all duration-300 hover:scale-105 cursor-pointer group ${
                  mode === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' 
                    : 'bg-white/80 border-gray-200 hover:bg-white'
                }`}
              >
                <CardBody className="p-0">
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
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <Typography
                variant="h2"
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
              >
                Latest Blog Posts
              </Typography>
              <Typography
                variant="paragraph"
                className="text-lg"
                style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}
              >
                Stay updated with our newest content
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <Card 
                  key={index}
                  onClick={() => navigate(`/bloginfo/${post.id}`)}
                  className={`overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer group ${
                    mode === 'dark' 
                      ? 'bg-gray-800/50 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={post.thumbnail} 
                      alt={post.blogs?.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardBody className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-teal-500 text-white text-xs rounded-full">
                        {post.blogs?.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {post.date}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {post.blogs?.title}
                    </h3>
                    <p className={`text-sm line-clamp-3 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {post.blogs?.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={handleExploreBlogsClick}
                variant="outlined"
                size="lg"
                className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white py-3 px-6 rounded-xl transition-all duration-300 group"
              >
                View All Posts
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Newsletter Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Card className={`p-12 text-center ${
            mode === 'dark' 
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-gradient-to-r from-teal-50 to-blue-50 border-gray-200'
          }`}>
            <CardBody className="p-0">
              <div className="mb-6">
                <FaRss className={`w-12 h-12 mx-auto mb-4 ${mode === 'dark' ? 'text-teal-400' : 'text-teal-500'} animate-pulse`} />
              </div>
              <Typography
                variant="h2"
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
              >
                Never Miss a Post!
              </Typography>
              <Typography
                variant="paragraph"
                className="text-lg mb-8"
                style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}
              >
                Subscribe to our newsletter and get the latest blog posts delivered straight to your inbox.
              </Typography>
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
                <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                No spam, unsubscribe at any time.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Enhanced Social Links */}
      <section className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Typography
            variant="h6"
            className="mb-6"
            style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
          >
            Follow for Updates
          </Typography>
          <div className="flex justify-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
                  mode === 'dark' 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } shadow-lg hover:shadow-xl ${social.color}`}
                aria-label={`Follow us on ${social.label}`}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;