import { Button, Typography } from '@material-tailwind/react';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import myContext from '../../context/data/myContext';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet';
import { debounce } from 'lodash';
import { FaEye, FaHeart, FaShare, FaBookmark, FaClock, FaTag, FaSearch, FaFilter } from 'react-icons/fa';

function BlogPostCard() {
  const context = useContext(myContext);
  const { mode, getAllBlog } = context;
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [shuffledBlogs, setShuffledBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Debounced shuffle function
    const debouncedShuffleBlogs = debounce(() => {
      shuffleBlogs();
      setIsLoading(false);
    }, 300);
    debouncedShuffleBlogs();
    return () => {
      debouncedShuffleBlogs.cancel();
    };
  }, [getAllBlog, selectedCategory, sortOption, searchTerm, selectedTag]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const shuffleBlogs = () => {
    let blogs = selectedCategory === 'All'
      ? getAllBlog
      : getAllBlog.filter(blog => blog.blogs.category === selectedCategory);

    if (searchTerm) {
      blogs = blogs.filter(blog => blog.blogs.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedTag !== 'All') {
      blogs = blogs.filter(blog => blog.blogs.tags && blog.blogs.tags.includes(selectedTag));
    }

    if (sortOption === 'Oldest') {
      blogs = blogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      blogs = blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setShuffledBlogs(shuffleArray(blogs));
  };

  const truncateText = (text, limit, id) => {
    if (!text) return '';
    
    try {
      // First, sanitize the HTML content
      const sanitizedText = DOMPurify.sanitize(text, { 
        ALLOWED_TAGS: [], 
        ALLOWED_ATTR: [] 
      });
      
      // Clean up the text
      let cleanedText = sanitizedText
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
      
      // If the sanitized text is empty, try to extract text from HTML
      if (!cleanedText) {
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        cleanedText = tempDiv.textContent || tempDiv.innerText || '';
        cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
      }
      
      // If still empty, return a default message
      if (!cleanedText) {
        return 'Click to read more...';
      }

      if (cleanedText.length <= limit) return cleanedText;

      return (
        <>
          {cleanedText.substring(0, limit)}
          <span
            style={{
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/bloginfo/${id}`)}
          >
            {' read more...'}
          </span>
        </>
      );
    } catch (error) {
      console.warn('Error processing text:', error);
      return 'Click to read more...';
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = useMemo(() => shuffledBlogs.slice(indexOfFirstPost, indexOfLastPost), [shuffledBlogs, indexOfFirstPost, indexOfLastPost]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className={`py-16 ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Helmet>
        <title>Latest Blog Posts - Technology, Programming & DevOps | PHcoder05</title>
        <meta name="description" content="Explore our latest blog posts on technology, programming, DevOps, cloud computing, and software development. Stay updated with the latest tech trends and tutorials." />
        <meta name="keywords" content="blog posts, technology blog, programming tutorials, DevOps, cloud computing, software development, tech news, latest posts" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Latest Blog Posts - Technology, Programming & DevOps" />
        <meta property="og:description" content="Explore our latest blog posts on technology, programming, DevOps, cloud computing, and software development." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://phcoder05.vercel.app/" />
        
        {/* Structured Data for Blog Posts */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Latest Blog Posts",
            "description": "Latest blog posts on technology, programming, and DevOps",
            "url": "https://phcoder05.vercel.app/",
            "numberOfItems": currentPosts.length,
            "itemListElement": currentPosts.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "BlogPosting",
                "headline": item.blogs.title,
                "description": item.blogs.content.substring(0, 200) + "...",
                "author": {
                  "@type": "Person",
                  "name": "Pankaj Hadole"
                },
                "datePublished": item.date,
                "image": item.thumbnail,
                "url": `https://phcoder05.vercel.app/bloginfo/${item.id}`
              }
            }))
          })}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12">
          <Typography
            variant="h2"
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent"
          >
            Latest Blog Posts
          </Typography>
          <Typography
            variant="paragraph"
            className={`text-xl max-w-3xl mx-auto ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Discover insightful articles on programming, DevOps, cloud computing, and the latest technology trends
          </Typography>
        </div>

        {/* Enhanced Filter Section */}
        <div className={`p-6 rounded-xl shadow-lg mb-8 backdrop-blur-sm ${
          mode === 'dark' 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white/80 border border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-teal-500" />
            <h3 className="text-lg font-semibold" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
              Filter & Search
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="category-select" className="block text-sm font-medium mb-2" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                Category
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className={`w-full p-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  mode === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                aria-label="Select Category"
              >
                <option value="All">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Farming">Farming</option>
                <option value="Programming">Programming</option>
                <option value="Sports">Sports</option>
                <option value="News">News</option>
                <option value="Personal">Personal</option>
                <option value="Trending">Trending</option>
                <option value="Other..">Other..</option>
              </select>
            </div>

            <div>
              <label htmlFor="sort-select" className="block text-sm font-medium mb-2" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                Sort By
              </label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={handleSortChange}
                className={`w-full p-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  mode === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                aria-label="Sort By"
              >
                <option value="Latest">Latest Post</option>
                <option value="Oldest">Oldest Post</option>
              </select>
            </div>

            <div>
              <label htmlFor="tag-select" className="block text-sm font-medium mb-2" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                Tags
              </label>
              <select
                id="tag-select"
                value={selectedTag}
                onChange={handleTagChange}
                className={`w-full p-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  mode === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                aria-label="Select Tag"
              >
                <option value="All">All Tags</option>
                <option value="Tech">Tech</option>
                <option value="Life">Life</option>
                <option value="Health">Health</option>
                <option value="Travel">Travel</option>
              </select>
            </div>

            <div>
              <label htmlFor="search-input" className="block text-sm font-medium mb-2" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                Search
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="search-input"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search blogs..."
                  className={`w-full p-3 pl-10 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    mode === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  aria-label="Search Blogs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        )}

        {/* Enhanced Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {!isLoading && currentPosts.length > 0 ? (
            currentPosts.map((item) => {
              const { thumbnail, date, id, blogs } = item;
              return (
                <article 
                  key={id}
                  className={`group cursor-pointer transition-all duration-300 hover:transform hover:scale-105 ${
                    mode === 'dark' 
                      ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
                      : 'bg-white/80 backdrop-blur-sm border border-gray-200'
                  } rounded-xl shadow-lg hover:shadow-2xl overflow-hidden`}
                  onClick={() => navigate(`/bloginfo/${id}`)}
                  aria-label={`Read ${blogs.title}`}
                >
                  {/* Enhanced Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      className="w-full h-48 object-cover object-top transition-transform duration-300 group-hover:scale-110"
                      src={thumbnail}
                      alt={blogs.title}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Enhanced Category Badge */}
                    {blogs.category && (
                      <div className="absolute top-4 left-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          mode === 'dark' 
                            ? 'bg-teal-500/20 text-teal-300' 
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {blogs.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="p-6">
                    {/* Enhanced Date */}
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <FaClock className="text-teal-500" />
                      <time className={mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        {new Date(date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </time>
                    </div>
                    
                    {/* Enhanced Title */}
                    <h3 
                      onClick={() => navigate(`/bloginfo/${id}`)}
                      className="text-xl font-bold mb-3 cursor-pointer hover:text-teal-500 transition-colors duration-300 line-clamp-2"
                      style={{ color: mode === 'dark' ? 'black' : 'black' }}
                    >
                      {blogs.title}
                    </h3>
                    
                    {/* Enhanced Content Preview */}
                    <p className={`text-base leading-relaxed mb-4 opacity-80 ${mode === 'dark' ? 'text-black' : 'text-gray-600'}`}>
                      {truncateText(blogs.content, 120, id) || 'Click to read more...'}
                    </p>
                    
                    {/* Enhanced Tags */}
                    {blogs.tags && blogs.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blogs.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                              mode === 'dark' 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            <FaTag className="text-teal-500" />
                            #{tag}
                          </span>
                        ))}
                        {blogs.tags.length > 3 && (
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            mode === 'dark' 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            +{blogs.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Enhanced Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-2 ${
                        mode === 'dark' 
                          ? 'text-teal-400 group-hover:text-teal-300' 
                          : 'text-teal-600 group-hover:text-teal-500'
                      }`}>
                        <FaEye />
                        Read More →
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <FaHeart className="text-red-500" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <FaShare className="text-blue-500 dark:text-blue-400" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <FaBookmark className="text-yellow-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : !isLoading && (
            <div className="col-span-full text-center py-12">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                No Blogs Found
              </h3>
              <p className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {shuffledBlogs.length > postsPerPage && (
          <div className="flex justify-center mb-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="Previous page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {Array.from({ length: Math.ceil(shuffledBlogs.length / postsPerPage) }, (_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = currentPage === pageNumber;
                const isNearCurrent = Math.abs(pageNumber - currentPage) <= 1;
                const isFirstOrLast = pageNumber === 1 || pageNumber === Math.ceil(shuffledBlogs.length / postsPerPage);
                
                if (isCurrentPage || isNearCurrent || isFirstOrLast) {
                  return (
                    <button
                      key={index}
                      onClick={() => paginate(pageNumber)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isCurrentPage
                          ? 'bg-teal-500 text-white font-semibold'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      aria-label={`Go to page ${pageNumber}`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                  return <span key={index} className="px-2">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => paginate(Math.min(Math.ceil(shuffledBlogs.length / postsPerPage), currentPage + 1))}
                disabled={currentPage === Math.ceil(shuffledBlogs.length / postsPerPage)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  currentPage === Math.ceil(shuffledBlogs.length / postsPerPage)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="Next page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className={`p-8 rounded-xl shadow-lg max-w-2xl mx-auto backdrop-blur-sm ${
            mode === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/80 border border-gray-200'
          }`}>
            <Typography
              variant="h3"
              className="text-2xl font-bold mb-4"
              style={{ color: mode === 'dark' ? 'white' : 'black' }}
            >
              Want to See More?
            </Typography>
            <Typography
              variant="paragraph"
              className={`text-lg mb-6 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Explore our complete collection of blog posts and tutorials
            </Typography>
            <Link to="/allblogs">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                aria-label="See More Blogs"
              >
                View All Blogs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogPostCard;
