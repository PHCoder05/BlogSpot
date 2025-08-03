import { Fragment, useContext, useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogBody,
    Input,
    Chip,
    Button,
} from "@material-tailwind/react";
import myContext from "../../context/data/myContext";
import { 
    AiOutlineSearch, 
    AiOutlineClose, 
    AiOutlineHistory,
    AiOutlineFilter,
    AiOutlineClockCircle,
    AiOutlineFire
} from "react-icons/ai";
import { useNavigate } from "react-router";
import { FaEye, FaCalendar, FaUser, FaTags, FaFolder } from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";

export default function SearchDialog() {
    const [open, setOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        title: true,
        content: true,
        category: true,
        tags: true
    });
    const [recentSearches, setRecentSearches] = useState([]);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const searchInputRef = useRef(null);

    const handleOpen = () => {
        setOpen(!open);
        // Load recent searches from localStorage
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    };

    const context = useContext(myContext);
    const { mode, searchkey, setSearchkey, getAllBlog } = context;
    const navigate = useNavigate();

    // Get unique categories for filter
    const categories = ['all', ...new Set(getAllBlog.map(blog => blog.blogs?.category).filter(Boolean))];

    // Generate search suggestions based on content
    const generateSuggestions = (query) => {
        if (!query.trim()) return [];
        
        const suggestions = new Set();
        const queryLower = query.toLowerCase();
        
        getAllBlog.forEach(blog => {
            // Add title suggestions
            if (blog.blogs?.title?.toLowerCase().includes(queryLower)) {
                const words = blog.blogs.title.split(' ');
                words.forEach(word => {
                    if (word.toLowerCase().includes(queryLower) && word.length > 2) {
                        suggestions.add(word);
                    }
                });
            }
            
            // Add category suggestions
            if (blog.blogs?.category?.toLowerCase().includes(queryLower)) {
                suggestions.add(blog.blogs.category);
            }
            
            // Add tag suggestions
            if (blog.blogs?.tags) {
                blog.blogs.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(queryLower)) {
                        suggestions.add(tag);
                    }
                });
            }
        });
        
        return Array.from(suggestions).slice(0, 5);
    };

    // Enhanced search algorithm with scoring
    const searchBlogs = (query, filters = searchFilters, category = selectedCategory) => {
        if (!query.trim()) return [];
        
        const results = getAllBlog.map(blog => {
            let score = 0;
            const queryLower = query.toLowerCase();
            const title = blog.blogs?.title?.toLowerCase() || '';
            const content = blog.blogs?.content?.toLowerCase() || '';
            const blogCategory = blog.blogs?.category?.toLowerCase() || '';
            const tags = blog.blogs?.tags?.join(' ').toLowerCase() || '';
            
            // Category filter
            if (category !== 'all' && blogCategory !== category.toLowerCase()) {
                return null;
            }
            
            // Title search (highest priority)
            if (filters.title && title.includes(queryLower)) {
                score += title.startsWith(queryLower) ? 100 : 50;
                if (title === queryLower) score += 200; // Exact match
            }
            
            // Content search
            if (filters.content && content.includes(queryLower)) {
                score += 10;
                // Bonus for multiple occurrences
                const occurrences = (content.match(new RegExp(queryLower, 'g')) || []).length;
                score += occurrences * 5;
            }
            
            // Category search
            if (filters.category && blogCategory.includes(queryLower)) {
                score += 30;
            }
            
            // Tags search
            if (filters.tags && tags.includes(queryLower)) {
                score += 20;
            }
            
            return score > 0 ? { ...blog, score } : null;
        }).filter(Boolean);
        
        // Sort by score and recency
        return results.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(b.date) - new Date(a.date);
        });
    };

    // Handle search input changes with debouncing
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchkey(value);
        
        if (value.trim() === '') {
            setSearchResults([]);
            setSearchSuggestions([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        
        // Generate suggestions
        setSearchSuggestions(generateSuggestions(value));
        
        // Debounced search
        setTimeout(() => {
            const results = searchBlogs(value, searchFilters, selectedCategory);
            setSearchResults(results);
            setIsSearching(false);
        }, 300);
    };

    // Handle filter changes
    const handleFilterChange = (filterType) => {
        setSearchFilters(prev => ({
            ...prev,
            [filterType]: !prev[filterType]
        }));
    };

    // Handle category filter change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (searchkey.trim()) {
            const results = searchBlogs(searchkey, searchFilters, category);
            setSearchResults(results);
        }
    };

    // Handle search click with recent search tracking
    const handleSearchClick = (id) => {
        const searchTerm = searchkey.trim();
        if (searchTerm) {
            // Add to recent searches
            const newRecentSearches = [
                searchTerm,
                ...recentSearches.filter(term => term !== searchTerm)
            ].slice(0, 5);
            setRecentSearches(newRecentSearches);
            localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
        }
        
        navigate(`/bloginfo/${id}`);
        setOpen(false);
        setSearchkey('');
        setSearchResults([]);
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setSearchkey(suggestion);
        const results = searchBlogs(suggestion, searchFilters, selectedCategory);
        setSearchResults(results);
        setSearchSuggestions([]);
    };

    // Handle recent search click
    const handleRecentSearchClick = (term) => {
        setSearchkey(term);
        const results = searchBlogs(term, searchFilters, selectedCategory);
        setSearchResults(results);
    };

    const handleClose = () => {
        setOpen(false);
        setSearchkey('');
        setSearchResults([]);
        setSearchSuggestions([]);
        setShowFilters(false);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeydown = (e) => {
            if (!open) return;
            
            switch (e.key) {
                case 'Escape':
                    handleClose();
                    break;
                case 'Enter':
                    if (searchResults.length > 0) {
                        handleSearchClick(searchResults[0].id);
                    }
                    break;
                case 'k':
                case 'K':
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault();
                        setOpen(!open);
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [open, searchResults]);

    // Focus input when dialog opens
    useEffect(() => {
        if (open && searchInputRef.current) {
            setTimeout(() => searchInputRef.current.focus(), 100);
        }
    }, [open]);

    return (
        <Fragment>
            {/* Search Icon */}
            <div 
                onClick={handleOpen} 
                className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-2 group"
            >
                <AiOutlineSearch size={20} className="text-white group-hover:scale-110 transition-transform" />
                <span className="hidden lg:inline text-white text-sm">Search</span>
                <div className="hidden lg:flex items-center gap-1 text-xs text-gray-300">
                    <span className="px-1 py-0.5 bg-gray-700 rounded text-xs">⌘K</span>
                </div>
            </div>
            
            {/* Dialog */}
            <Dialog 
                open={open} 
                handler={handleClose}
                size="lg"
                className={`${mode === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl`}
            >
                <DialogBody className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Search Blogs
                            </h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="text"
                                    className={`p-2 ${mode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <AiOutlineFilter size={16} />
                                </Button>
                                <Chip
                                    value={`${searchResults.length} results`}
                                    size="sm"
                                    className={`${searchResults.length > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleClose}
                            className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                        >
                            <AiOutlineClose size={20} className={mode === 'dark' ? 'text-white' : 'text-gray-600'} />
                        </button>
                    </div>

                    {/* Filters Section */}
                    {showFilters && (
                        <div className={`mb-4 p-4 rounded-lg border ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <AiOutlineFilter size={16} className={mode === 'dark' ? 'text-white' : 'text-gray-600'} />
                                <span className={`text-sm font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Search Filters</span>
                            </div>
                            
                            {/* Search Options */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {Object.entries(searchFilters).map(([key, value]) => (
                                    <Chip
                                        key={key}
                                        value={key.charAt(0).toUpperCase() + key.slice(1)}
                                        variant={value ? "filled" : "outlined"}
                                        color={value ? "blue" : "gray"}
                                        size="sm"
                                        onClick={() => handleFilterChange(key)}
                                        className="cursor-pointer"
                                    />
                                ))}
                            </div>
                            
                            {/* Category Filter */}
                            <div className="flex items-center gap-2">
                                <FaFolder size={14} className={mode === 'dark' ? 'text-white' : 'text-gray-600'} />
                                <span className={`text-sm ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Category:</span>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className={`text-sm px-2 py-1 rounded border ${
                                        mode === 'dark' 
                                            ? 'bg-gray-700 text-white border-gray-600' 
                                            : 'bg-white text-gray-900 border-gray-300'
                                    }`}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? 'All Categories' : category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Search Input */}
                    <div className="mb-6">
                        <Input
                            ref={searchInputRef}
                            value={searchkey}
                            onChange={handleSearchChange}
                            type="search"
                            label="Search blogs by title, content, category, or tags..."
                            className={`${
                                mode === 'dark' 
                                    ? 'bg-gray-800 text-white border-gray-600' 
                                    : 'bg-gray-50 text-gray-900 border-gray-300'
                            }`}
                            containerProps={{
                                className: "min-w-full",
                            }}
                            autoFocus
                            icon={<AiOutlineSearch className="text-gray-400" />}
                        />
                    </div>

                    {/* Search Suggestions */}
                    {searchSuggestions.length > 0 && !isSearching && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BiTrendingUp size={14} className="text-blue-500" />
                                <span className={`text-sm font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Suggestions</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {searchSuggestions.map((suggestion, index) => (
                                    <Chip
                                        key={index}
                                        value={suggestion}
                                        size="sm"
                                        variant="outlined"
                                        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Searches */}
                    {!searchkey && recentSearches.length > 0 && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AiOutlineHistory size={14} className="text-gray-500" />
                                <span className={`text-sm font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Searches</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map((term, index) => (
                                    <Chip
                                        key={index}
                                        value={term}
                                        size="sm"
                                        variant="outlined"
                                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => handleRecentSearchClick(term)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {isSearching ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Searching...</p>
                            </div>
                        ) : searchkey && searchResults.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                    </p>
                                    {searchResults.length > 1 && (
                                        <p className="text-xs text-gray-500">
                                            Press Enter to open first result
                                        </p>
                                    )}
                                </div>
                                {searchResults.map((blog, index) => (
                                    <div 
                                        key={blog.id} 
                                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                                            mode === 'dark' 
                                                ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                                                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                        onClick={() => handleSearchClick(blog.id)}
                                    >
                                        <div className="flex gap-4">
                                            {/* Thumbnail */}
                                            <div className="flex-shrink-0">
                                                <img 
                                                    className="w-16 h-16 rounded-lg object-cover" 
                                                    src={blog.thumbnail} 
                                                    alt={blog.blogs?.title}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/64x64?text=Blog';
                                                    }}
                                                />
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className={`font-semibold text-sm line-clamp-2 flex-1 ${
                                                        mode === 'dark' ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                        {blog.blogs?.title}
                                                    </h3>
                                                    {blog.score > 50 && (
                                                        <AiOutlineFire size={14} className="text-orange-500 flex-shrink-0 ml-2" />
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                                    <div className="flex items-center gap-1">
                                                        <FaUser size={12} />
                                                        <span>Pankaj Hadole</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FaCalendar size={12} />
                                                        <span>{blog.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FaEye size={12} />
                                                        <span>{blog.blogs?.views || 0} views</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {blog.blogs?.category && (
                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                            mode === 'dark' 
                                                                ? 'bg-blue-600 text-white' 
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {blog.blogs.category}
                                                        </span>
                                                    )}
                                                    {blog.blogs?.tags && blog.blogs.tags.length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <FaTags size={10} className="text-gray-400" />
                                                            <span className="text-xs text-gray-500">
                                                                {blog.blogs.tags.slice(0, 2).join(', ')}
                                                                {blog.blogs.tags.length > 2 && '...'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : searchkey ? (
                            <div className="text-center py-8">
                                <AiOutlineSearch size={48} className="text-gray-400 mx-auto mb-4" />
                                <p className={`text-lg font-medium mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    No results found
                                </p>
                                <p className="text-gray-500 mb-4">
                                    No blogs found matching "{searchkey}"
                                </p>
                                <div className="flex flex-col gap-2 text-sm text-gray-500">
                                    <p>Try:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Using different keywords</li>
                                        <li>Checking your spelling</li>
                                        <li>Using broader search terms</li>
                                        <li>Adjusting search filters</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <AiOutlineSearch size={48} className="text-gray-400 mx-auto mb-4" />
                                <p className={`text-lg font-medium mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Start searching
                                </p>
                                <p className="text-gray-500 mb-4">
                                    Type to search blogs by title, content, category, or tags
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className={`p-3 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <AiOutlineClockCircle size={14} className="text-blue-500" />
                                            <span className="font-medium">Quick Search</span>
                                        </div>
                                        <p className="text-gray-500 text-xs">Use ⌘K to open search anytime</p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <AiOutlineFilter size={14} className="text-green-500" />
                                            <span className="font-medium">Smart Filters</span>
                                        </div>
                                        <p className="text-gray-500 text-xs">Filter by category and content type</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 text-sm">
                            Powered by <span className="font-semibold text-blue-500">PHcoder05</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Press ⌘K to open search • Enter to select first result • Esc to close
                        </p>
                    </div>
                </DialogBody>
            </Dialog>
        </Fragment>
    );
}