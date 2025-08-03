import React, { useContext, useEffect, useState, useMemo } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { 
  FaSearch, FaFilter, FaSort, FaCalendarAlt, FaEye, FaHeart, 
  FaShare, FaBookmark, FaTags, FaClock, FaArrowUp, FaArrowDown,
  FaStar, FaFire, FaNewspaper, FaCode, FaCloud, FaServer, 
  FaGraduationCap, FaTimes, FaCheck, FaList, FaThLarge
} from 'react-icons/fa';
import ShareDialogBox from '../../components/shareDialogBox/ShareDialogBox';
import SEOComponent from '../../components/SEOComponent';

function AllBlogs() {
    const context = useContext(myContext);
    const { mode, getAllBlog } = context;
    const navigate = useNavigate();

    // State management
    const [blogs, setBlogs] = useState(getAllBlog || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(9);
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);

    // Categories for filtering
    const categories = [
        { id: 'all', name: 'All Categories', icon: FaNewspaper },
        { id: 'programming', name: 'Programming', icon: FaCode },
        { id: 'cloud', name: 'Cloud Computing', icon: FaCloud },
        { id: 'devops', name: 'DevOps', icon: FaServer },
        { id: 'learning', name: 'Learning', icon: FaGraduationCap }
    ];

    // Sort options
    const sortOptions = [
        { value: 'date', label: 'Date', icon: FaCalendarAlt },
        { value: 'title', label: 'Title', icon: FaNewspaper },
        { value: 'popularity', label: 'Popularity', icon: FaFire },
        { value: 'views', label: 'Views', icon: FaEye }
    ];

    // Helper function to truncate text and remove HTML tags
    const truncateText = (text, limit) => {
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
            
            // Truncate if needed
            return cleanedText.length <= limit ? cleanedText : cleanedText.substring(0, limit) + '...';
        } catch (error) {
            console.warn('Error processing text:', error);
            return 'Click to read more...';
        }
    };

    // Filter and sort blogs
    const filteredAndSortedBlogs = useMemo(() => {
        let filtered = blogs;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(blog => 
                blog.blogs?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.blogs?.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.blogs?.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(blog => 
                blog.blogs?.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Sort blogs
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'date':
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case 'title':
                    aValue = a.blogs?.title || '';
                    bValue = b.blogs?.title || '';
                    break;
                case 'popularity':
                    aValue = a.blogs?.likes || 0;
                    bValue = b.blogs?.likes || 0;
                    break;
                case 'views':
                    aValue = a.blogs?.views || 0;
                    bValue = b.blogs?.views || 0;
                    break;
                default:
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [blogs, searchTerm, selectedCategory, sortBy, sortOrder]);

    // Pagination
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredAndSortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(filteredAndSortedBlogs.length / blogsPerPage);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when searching
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle category change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    // Fetch blogs on component mount
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                // Use context data if available, otherwise fetch from API
                if (getAllBlog && getAllBlog.length > 0) {
                    setBlogs(getAllBlog);
                } else {
                    // Since there's no API endpoint, just use context data or empty array
                    console.warn('No API endpoint available, using context data only');
                    setBlogs([]);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
        window.scrollTo(0, 0);
    }, [getAllBlog]);

    // Handle blog click
    const handleBlogClick = (id) => {
        navigate(`/bloginfo/${id}`);
    };



    // Handle like
    const handleLike = (blogId) => {
        // Implement like functionality
        console.log('Liked blog:', blogId);
    };

    // Handle bookmark
    const handleBookmark = (blogId) => {
        // Implement bookmark functionality
        console.log('Bookmarked blog:', blogId);
    };

    return (
        <Layout>
            <SEOComponent 
                type="allblogs" 
                currentUrl={window.location.href}
                totalBlogs={filteredAndSortedBlogs.length}
                selectedCategory={selectedCategory}
            />

            <section className={`min-h-screen py-8 ${
                mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
                <div className="container mx-auto px-4 max-w-7xl">
                    
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
                            mode === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                            All Articles
                        </h1>
                        <p className={`text-lg ${
                            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Discover {filteredAndSortedBlogs.length} articles on programming, cloud computing, and technology
                        </p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className={`mb-8 p-6 rounded-xl ${
                        mode === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}>
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            
                            {/* Search Input */}
                            <div className="relative flex-1 w-full">
                                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                    mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                                        mode === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex gap-2 flex-wrap">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                            selectedCategory === category.id
                                                ? 'bg-teal-500 text-white'
                                                : mode === 'dark'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        <category.icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{category.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [sort, order] = e.target.value.split('-');
                                        setSortBy(sort);
                                        setSortOrder(order);
                                    }}
                                    className={`px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                                        mode === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                >
                                    <option value="date-desc">Latest First</option>
                                    <option value="date-asc">Oldest First</option>
                                    <option value="title-asc">Title A-Z</option>
                                    <option value="title-desc">Title Z-A</option>
                                    <option value="popularity-desc">Most Popular</option>
                                    <option value="views-desc">Most Viewed</option>
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-lg transition-all duration-200 ${
                                        viewMode === 'grid'
                                            ? 'bg-teal-500 text-white'
                                            : mode === 'dark'
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    <FaThLarge className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-lg transition-all duration-200 ${
                                        viewMode === 'list'
                                            ? 'bg-teal-500 text-white'
                                            : mode === 'dark'
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    <FaList className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className={`mb-6 p-4 rounded-lg ${
                        mode === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-md`}>
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                            <p className={`${
                                mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Showing {indexOfFirstBlog + 1}-{Math.min(indexOfLastBlog, filteredAndSortedBlogs.length)} of {filteredAndSortedBlogs.length} articles
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

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                            <p className={`mt-4 ${
                                mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>Loading articles...</p>
                        </div>
                    )}

                    {/* Blog Grid/List */}
                    {!loading && (
                        <>
                            {currentBlogs.length > 0 ? (
                                <div className={viewMode === 'grid' 
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                                    : "space-y-6"
                                }>
                                    {currentBlogs.map((item) => {
                                        const { thumbnail, date, id, blogs } = item;
                                        return (
                                            <div key={id} className={`${
                                                viewMode === 'grid' 
                                                    ? 'bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700' 
                                                    : 'bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700'
                                            }`}>
                                                
                                                {viewMode === 'grid' ? (
                                                    // Grid View
                                                    <>
                                                        {/* Blog Thumbnail */}
                                                        <div className="relative">
                                                            <img
                                                                onClick={() => handleBlogClick(id)}
                                                                className="w-full h-48 object-cover rounded-t-xl cursor-pointer"
                                                                src={thumbnail}
                                                                alt={blogs?.title || "Blog Thumbnail"}
                                                            />
                                                            <div className="absolute top-3 left-3">
                                                                <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                                    {blogs?.category || 'Tech'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Blog Content */}
                                                        <div className="p-6">
                                                            <div className="flex items-center gap-2 text-sm mb-3">
                                                                <FaCalendarAlt className={`w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                                                <span className={mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{date}</span>
                                                            </div>

                                                            <h3 
                                                                onClick={() => handleBlogClick(id)}
                                                                className="text-xl font-bold mb-3 cursor-pointer hover:text-teal-500 transition-colors duration-200"
                                                                style={{ color: mode === 'dark' ? 'black' : 'black' }}
                                                            >
                                                                {blogs?.title}
                                                            </h3>

                                                            <p className={`mb-4 line-clamp-3 ${
                                                mode === 'dark' ? 'text-black' : 'text-gray-600'
                                            }`}>
                                                                {truncateText(blogs?.content || '', 120) || 'Click to read more...'}
                                                            </p>

                                                            {/* Action Buttons */}
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
                                                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                                                        title="Share"
                                                                        style={{ 
                                                                            color: mode === 'dark' ? '#ffffff' : '#374151',
                                                                            backgroundColor: 'transparent',
                                                                            border: 'none',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        <FaShare className="w-4 h-4 text-blue-500 dark:text-blue-400" />
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
                                                                style={{ color: mode === 'dark' ? 'black' : 'black' }}
                                                            >
                                                                {blogs?.title}
                                                            </h3>

                                                            <p className={`mb-4 ${
                                                mode === 'dark' ? 'text-black' : 'text-gray-600'
                                            }`}>
                                                                {truncateText(blogs?.content || '', 200) || 'Click to read more...'}
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
                                                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                                                        title="Share"
                                                                        style={{ 
                                                                            color: mode === 'dark' ? '#ffffff' : '#374151',
                                                                            backgroundColor: 'transparent',
                                                                            border: 'none',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        <FaShare className="w-4 h-4 text-blue-500 dark:text-blue-400" />
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
                            ) : (
                                <div className="text-center py-12">
                                    <FaSearch className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className={`text-xl font-semibold mb-2 ${
                                        mode === 'dark' ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        No articles found
                                    </h3>
                                    <p className={`${
                                        mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {searchTerm 
                                            ? `No articles match "${searchTerm}". Try adjusting your search terms.`
                                            : 'No articles available at the moment.'
                                        }
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                        currentPage === 1
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-teal-500 text-white hover:bg-teal-600'
                                    }`}
                                >
                                    Previous
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                            currentPage === page
                                                ? 'bg-teal-500 text-white'
                                                : mode === 'dark'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                        currentPage === totalPages
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-teal-500 text-white hover:bg-teal-600'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}

export default AllBlogs;
