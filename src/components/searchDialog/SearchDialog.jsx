import { Fragment, useContext, useState, useEffect } from "react";
import {
    Dialog,
    DialogBody,
    Input,
} from "@material-tailwind/react";
import myContext from "../../context/data/myContext";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router";
import { FaEye, FaCalendar, FaUser } from "react-icons/fa";

export default function SearchDialog() {
    const [open, setOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleOpen = () => setOpen(!open);

    const context = useContext(myContext);
    const { mode, searchkey, setSearchkey, getAllBlog } = context;
    const navigate = useNavigate();

    // Handle search input changes
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchkey(value);
        
        if (value.trim() === '') {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        
        // Filter blogs based on search term
        const filtered = getAllBlog.filter((blog) => {
            const title = blog.blogs?.title?.toLowerCase() || '';
            const content = blog.blogs?.content?.toLowerCase() || '';
            const category = blog.blogs?.category?.toLowerCase() || '';
            const tags = blog.blogs?.tags?.join(' ').toLowerCase() || '';
            const searchTerm = value.toLowerCase();
            
            return title.includes(searchTerm) || 
                   content.includes(searchTerm) || 
                   category.includes(searchTerm) || 
                   tags.includes(searchTerm);
        });

        setSearchResults(filtered);
        setIsSearching(false);
    };

    const handleSearchClick = (id) => {
        navigate(`/bloginfo/${id}`);
        setOpen(false);
        setSearchkey('');
        setSearchResults([]);
    };

    const handleClose = () => {
        setOpen(false);
        setSearchkey('');
        setSearchResults([]);
    };

    // Close dialog when clicking outside
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    return (
        <Fragment>
            {/* Search Icon */}
            <div 
                onClick={handleOpen} 
                className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
            >
                <AiOutlineSearch size={20} color="white" />
                <span className="hidden lg:inline text-white text-sm">Search</span>
            </div>
            
            {/* Dialog */}
            <Dialog 
                open={open} 
                handler={handleClose}
                size="lg"
                className={`${mode === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-xl`}
            >
                <DialogBody className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Search Blogs
                        </h2>
                        <button 
                            onClick={handleClose}
                            className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                        >
                            <AiOutlineClose size={20} className={mode === 'dark' ? 'text-white' : 'text-gray-600'} />
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="mb-6">
                        <Input
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

                    {/* Search Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {isSearching ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Searching...</p>
                            </div>
                        ) : searchkey && searchResults.length > 0 ? (
                            <div className="space-y-4">
                                <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                </p>
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
                                                />
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-semibold text-sm line-clamp-2 mb-2 ${
                                                    mode === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {blog.blogs?.title}
                                                </h3>
                                                
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
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
                                                
                                                {blog.blogs?.category && (
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                                                        mode === 'dark' 
                                                            ? 'bg-blue-600 text-white' 
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {blog.blogs.category}
                                                    </span>
                                                )}
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
                                <p className="text-gray-500">
                                    No blogs found matching "{searchkey}"
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <AiOutlineSearch size={48} className="text-gray-400 mx-auto mb-4" />
                                <p className={`text-lg font-medium mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Start searching
                                </p>
                                <p className="text-gray-500">
                                    Type to search blogs by title, content, category, or tags
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 text-sm">
                            Powered by <span className="font-semibold text-blue-500">PHcoder05</span>
                        </p>
                    </div>
                </DialogBody>
            </Dialog>
        </Fragment>
    );
}