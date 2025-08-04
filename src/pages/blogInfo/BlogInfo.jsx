import React, { useContext, useEffect, useState, useCallback } from 'react';
import myContext from '../../context/data/myContext';
import { useParams, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, getDocs, updateDoc, increment, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import Loader from '../../components/loader/Loader';
import Layout from '../../components/layout/Layout';
import Comment from '../../components/comment/Comment';
import ShareDialogBox from '../../components/shareDialogBox/ShareDialogBox';
import SEOComponent from '../../components/SEOComponent';
import toast from 'react-hot-toast';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share';
import { 
  FaCopy, FaCode, FaEdit, FaEye, FaClock, FaUser, FaCalendar, FaTags, 
  FaHeart, FaBookmark, FaShare, FaPrint, FaArrowUp, FaComment, 
  FaThumbsUp, FaThumbsDown, FaBookOpen, FaStar, FaDownload, FaLink,
  FaEllipsisH, FaTimes, FaCheck, FaPencilAlt, FaTrash, FaReply, FaListUl, FaExpand, FaCompress, FaTextHeight
} from 'react-icons/fa';
import { generateSocialPreviewTestUrls, validateMetaTags } from '../../utils/seoUtils';
import { debugThumbnailUrl, getSocialMediaTestLinks } from '../../utils/thumbnailTest';
import { Helmet } from 'react-helmet';

const Ad = ({ position }) => (
  <div className="ad-container my-8 text-center">
    <p className="text-gray-400 dark:text-gray-600">[Advertisement Space - {position}]</p>
  </div>
);

function BlogInfo() {
  const context = useContext(myContext);
  const { mode, loading, setloading, user } = context;

  const params = useParams();
  const navigate = useNavigate();

  const [getBlogs, setGetBlogs] = useState(null);
  const [processedContent, setProcessedContent] = useState('');
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [fullName, setFullName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [allComment, setAllComment] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [showReadingMode, setShowReadingMode] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [showRelatedPosts, setShowRelatedPosts] = useState(true);
  const [toc, setToc] = useState([]);

  // Handle full screen toggle
  const toggleFullScreen = () => {
    setShowFullScreen(!showFullScreen);
  };

  // Handle ESC key to exit full screen
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showFullScreen) {
        setShowFullScreen(false);
      }
    };

    if (showFullScreen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when in full screen
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showFullScreen]);

  const processContentForToc = useCallback((htmlContent) => {
    if (!htmlContent) {
        setToc([]);
        return '';
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');
    const newToc = [];

    headings.forEach((heading, index) => {
        const text = heading.textContent;
        const level = parseInt(heading.tagName.substring(1), 10);
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + `-${index}`;
        
        heading.setAttribute('id', id);
        
        newToc.push({ id, text, level, node: heading });
    });

    setToc(newToc);
    return doc.body.innerHTML;
  }, []);

  const getAllBlogs = useCallback(async () => {
    setloading(true);
    try {
      const productTemp = await getDoc(doc(fireDb, "blogPost", params.id));
      if (productTemp.exists()) {
        const blogData = productTemp.data();
        console.log('Blog data fetched:', blogData);
        console.log('Blog thumbnail:', blogData.thumbnail);
        setGetBlogs(blogData);
        setUpdatedTitle(blogData.blogs.title);
        setUpdatedContent(blogData.blogs.content);
        const contentWithIds = processContentForToc(blogData.blogs.content);
        setProcessedContent(contentWithIds);
        
        await updateDoc(doc(fireDb, "blogPost", params.id), {
          'blogs.views': increment(1)
        });
      } else {
        toast.error("Blog post not found!");
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading blog post");
    } finally {
      setloading(false);
    }
  }, [params.id, navigate, setloading, processContentForToc]);

  useEffect(() => {
    getAllBlogs();
  }, [getAllBlogs]);
  
  // Effect for checking like status
  useEffect(() => {
      if (user && getBlogs?.blogs?.likedBy) {
          setIsLiked(getBlogs.blogs.likedBy.includes(user.uid));
      } else {
          setIsLiked(false);
      }
  }, [user, getBlogs]);

  // Effect for checking bookmark status
  useEffect(() => {
      if (!user) {
          setIsBookmarked(false);
          return;
      }
      const userRef = doc(fireDb, "users", user.uid);
      const unsub = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
              const bookmarks = doc.data().bookmarks || [];
              setIsBookmarked(bookmarks.includes(params.id));
          } else {
              // If user document doesn't exist, user is not bookmarked
              setIsBookmarked(false);
          }
      });
      return () => unsub(); // Cleanup listener
  }, [user, params.id]);

  const getOtherBlogs = useCallback(async () => {
    if (!getBlogs) return;
    try {
      const q = query(collection(fireDb, "blogPost"), orderBy('date', 'desc'), );
      const querySnapshot = await getDocs(q);
      const blogsArray = querySnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(doc => doc.id !== params.id);

      const currentCategory = getBlogs.blogs.category;
      const currentTags = getBlogs.blogs.tags || [];

      const scoredBlogs = blogsArray.map(blog => {
          let score = 0;
          if (blog.blogs?.category === currentCategory) score += 5;
          const matchingTags = blog.blogs?.tags?.filter(tag => currentTags.includes(tag)).length || 0;
          score += matchingTags * 2;
          return { ...blog, score };
      });
      
      const relevantBlogs = scoredBlogs.sort((a, b) => b.score - a.score).slice(0, 4);
      setOtherBlogs(relevantBlogs);

    } catch (error) {
      console.error(error);
    }
  }, [getBlogs, params.id]);

  useEffect(() => {
    getOtherBlogs();
  }, [getOtherBlogs]);

  const addComment = async () => {
    if (!commentText.trim() || !fullName.trim()) {
        return toast.error("Name and comment cannot be empty.");
    }
    const commentRef = collection(fireDb, `blogPost/${params.id}/comment`);
    try {
      await addDoc(commentRef, {
          fullName,
          commentText,
          time: Timestamp.now(),
          date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      });
      toast.success('Comment Added Successfully');
      setFullName("");
      setCommentText("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment.");
    }
  };

  const getcomment = useCallback(() => {
    try {
      const q = query(collection(fireDb, `blogPost/${params.id}/comment`), orderBy('time', 'desc'));
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const commentsArray = QuerySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setAllComment(commentsArray);
      });
      return unsubscribe;
    } catch (error) {
      console.error(error);
    }
  }, [params.id]);

  useEffect(() => {
    const unsubscribe = getcomment();
    window.scrollTo(0, 0);
    return () => unsubscribe && unsubscribe();
  }, [getcomment]);
  
  useEffect(() => {
    const handleScroll = () => {
      const element = document.documentElement;
      const scrollTotal = element.scrollHeight - element.clientHeight;
      if (scrollTotal > 0) {
        setReadingProgress((element.scrollTop / scrollTotal) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shareUrl = window.location.href;
  const shareTitle = getBlogs?.blogs?.title;

  const copyToClipboard = (textToCopy, message) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success(message))
      .catch((err) => toast.error('Failed to copy.'));
  };

  const updateBlog = async () => {
    const blogRef = doc(fireDb, "blogPost", params.id);
    try {
      await updateDoc(blogRef, {
        'blogs.title': updatedTitle,
        'blogs.content': updatedContent,
        date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      });
      toast.success('Blog updated successfully');
      setIsEditing(false);
      getAllBlogs();
    } catch (error) {
      console.error(error);
      toast.error('Error updating blog');
    }
  };

  const handleLike = async () => {
    if (!user) {
        toast.error('Please login to like posts');
        navigate('/login');
        return;
    }
    const blogRef = doc(fireDb, "blogPost", params.id);
    try {
        const change = isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid);
        await updateDoc(blogRef, { 'blogs.likedBy': change });
        // Optimistic update of UI
        const newLikedBy = isLiked 
          ? getBlogs.blogs.likedBy.filter(uid => uid !== user.uid)
          : [...(getBlogs.blogs.likedBy || []), user.uid];
        setGetBlogs({ ...getBlogs, blogs: { ...getBlogs.blogs, likedBy: newLikedBy } });
        toast.success(isLiked ? 'Post unliked' : 'Post liked!');
    } catch (error) {
        console.error("Error updating like:", error);
        toast.error('Error updating like');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
        toast.error('Please login to bookmark posts');
        navigate('/login');
        return;
    }
    const userRef = doc(fireDb, "users", user.uid);
    try {
        const change = isBookmarked ? arrayRemove(params.id) : arrayUnion(params.id);
        
        // Check if user document exists, if not create it
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            // Create user document if it doesn't exist
            await setDoc(userRef, {
                name: user.displayName || user.email,
                uid: user.uid,
                email: user.email,
                time: Timestamp.now(),
                role: 'user',
                bookmarks: isBookmarked ? [] : [params.id]
            });
        } else {
            // Update existing document
            await updateDoc(userRef, { bookmarks: change });
        }
        
        setIsBookmarked(!isBookmarked); // Optimistic update
        toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks!');
    } catch (error) {
        console.error("Error updating bookmarks:", error);
        toast.error("Error updating bookmarks");
    }
  };
  
  const handlePrint = () => window.print();

  const handleDownload = () => {
    const content = `Title: ${getBlogs?.blogs?.title}\nAuthor: Pankaj Hadole\nDate: ${getBlogs?.date}\n\n${getBlogs?.blogs?.content.replace(/<[^>]*>?/gm, '')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getBlogs?.blogs?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Article downloaded successfully!');
  };

  const createMarkup = (content) => ({ __html: content });

  const formatReadingTime = (content = '') => Math.ceil(content.split(' ').length / 200);

  const getFontSizeClass = () => ({
    small: 'text-sm', medium: 'text-base', large: 'text-lg', xl: 'text-xl'
  })[fontSize] || 'text-base';

  const getReadingModeClass = () => showReadingMode ? 'max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-4 sm:p-8' : '';

  const handleTocClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };
  
  if (loading || !getBlogs) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  // Debug logging to identify Symbol values
  console.log('BlogInfo render - getBlogs:', getBlogs);
  if (getBlogs?.blogs?.tags && Array.isArray(getBlogs.blogs.tags)) {
    console.log('Blog tags:', getBlogs.blogs.tags);
    getBlogs.blogs.tags.forEach((tag, index) => {
      if (typeof tag === 'symbol') {
        console.error('Symbol found in tags at index:', index, tag);
      }
    });
  }

  // Create safe blog object
  const safeBlog = getBlogs && typeof getBlogs === 'object' ? {
    title: getBlogs.blogs?.title || '',
    content: getBlogs.blogs?.content || '',
    thumbnail: getBlogs?.thumbnail || getBlogs?.blogs?.thumbnail || '',
    tags: Array.isArray(getBlogs.blogs?.tags) 
      ? getBlogs.blogs.tags.filter(tag => typeof tag === 'string' && tag.trim() !== '')
      : [],
    category: getBlogs.blogs?.category || '',
    date: getBlogs.date || '',
    author: 'Pankaj Hadole'
  } : null;
  
  // Debug: Log safe blog object
  console.log('Safe blog object:', safeBlog);
  console.log('Safe blog thumbnail:', safeBlog?.thumbnail);
  console.log('Original blog data:', getBlogs);
  console.log('Original thumbnail paths:', {
    blogsThumbnail: getBlogs?.blogs?.thumbnail,
    directThumbnail: getBlogs?.thumbnail
  });
  
  // Additional debugging for thumbnail URL
  if (safeBlog?.thumbnail) {
    console.log('Thumbnail URL analysis:', {
      originalUrl: safeBlog.thumbnail,
      isAbsolute: safeBlog.thumbnail.startsWith('http'),
      isRelative: safeBlog.thumbnail.startsWith('/'),
      isDataUrl: safeBlog.thumbnail.startsWith('data:'),
      urlLength: safeBlog.thumbnail.length
    });
  }
  
  // Debug SEOComponent props
  console.log('SEOComponent props:', {
    type: 'blog',
    blog: safeBlog,
    currentUrl: window.location.href
  });
  
  // Test if meta tags are actually in the DOM
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && safeBlog) {
      setTimeout(() => {
        const ogImage = document.querySelector('meta[property="og:image"]');
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        console.log('DOM Check - OG Image meta tag:', ogImage?.content || 'NOT FOUND');
        console.log('DOM Check - Twitter Image meta tag:', twitterImage?.content || 'NOT FOUND');
        console.log('All meta tags:', document.querySelectorAll('meta').length);
      }, 1000);
    }
  }, [safeBlog]);

  return (
    <Layout>
      {safeBlog ? (
        <SEOComponent 
          type="blog"
          blog={safeBlog}
          currentUrl={window.location.href}
        />
      ) : (
        <SEOComponent 
          type="home"
          currentUrl={window.location.href}
        />
      )}
      
            {/* Test meta tags directly */}
      {process.env.NODE_ENV === 'development' && safeBlog && (
        <Helmet>
          <meta property="og:image" content={safeBlog.thumbnail} />
          <meta name="twitter:image" content={safeBlog.thumbnail} />
        </Helmet>
      )}

      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 dark:bg-gray-700 z-50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="fixed bottom-20 sm:bottom-24 md:bottom-28 right-4 sm:right-5 z-50">
        <button onClick={toggleFullScreen} className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${mode === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
          {showFullScreen ? <FaCompress /> : <FaExpand />}
        </button>
      </div>

      {/* Full Screen Exit Button */}
      {showFullScreen && (
        <div className="fixed top-4 right-4 z-50">
          <button 
            onClick={() => setShowFullScreen(false)}
            className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${mode === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            title="Exit Full Screen (ESC)"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
      )}

      <div className={`${showFullScreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto' : ''}`}>
        {showFullScreen && (
          <div className="fixed top-4 left-4 z-50">
            <div className={`px-4 py-2 rounded-lg shadow-lg ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
              <p className="text-sm font-medium">Full Screen Mode</p>
              <p className="text-xs opacity-75">Press ESC or click X to exit</p>
            </div>
          </div>
        )}
        <section className={`container mx-auto px-4 ${showFullScreen ? 'py-8' : 'py-4 lg:py-8'}`}>
          <div className={getReadingModeClass()}>
                <div className="relative mb-8">
                    <div className="relative h-72 md:h-[450px] rounded-2xl overflow-hidden shadow-2xl group">
                        <img alt="Blog thumbnail" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src={getBlogs?.blogs?.thumbnail || getBlogs?.thumbnail || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute top-4 left-4">
                            <span className="px-4 py-2 rounded-full text-sm font-bold bg-white/20 text-white backdrop-blur-sm border border-white/30">{getBlogs?.blogs?.category || 'General'}</span>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={handleLike} className={`p-3 rounded-full shadow-lg transition-all duration-300 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-red-500 hover:bg-white'}`}>
                                <FaHeart />
                            </button>
                            <button onClick={handleBookmark} className={`p-3 rounded-full shadow-lg transition-all duration-300 ${isBookmarked ? 'bg-blue-500 text-white' : 'bg-white/90 text-blue-500 hover:bg-white'}`}>
                                <FaBookmark />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {isEditing ? <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} className="w-full p-2 border-2 border-blue-500 rounded-lg" /> : getBlogs?.blogs?.title}
                    </h1>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2"><FaUser className="text-blue-500"/> <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Pankaj Hadole</span></div>
                        <div className="flex items-center gap-2"><FaCalendar className="text-green-500"/> <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{getBlogs?.date}</span></div>
                        <div className="flex items-center gap-2"><FaClock className="text-purple-500"/> <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{formatReadingTime(getBlogs?.blogs?.content)} min read</span></div>
                        <div className="flex items-center gap-2"><FaEye className="text-orange-500"/> <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{getBlogs?.blogs?.views || 0} Views</span></div>
                    </div>
                    {getBlogs?.blogs?.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {getBlogs.blogs.tags.map((tag, index) => (
                                <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${mode === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className={`sticky top-1.5 z-30 flex flex-wrap items-center justify-between gap-4 p-3 mb-8 rounded-xl shadow-md transition-all ${mode === 'dark' ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 border'} backdrop-blur-sm`}>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={() => setShowTableOfContents(!showTableOfContents)} className={`p-2 rounded-lg ${mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><FaListUl/></button>
                        <button onClick={() => setShowReadingMode(!showReadingMode)} className={`p-2 rounded-lg ${showReadingMode ? 'text-blue-500' : ''} ${mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><FaBookOpen/></button>
                        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
                           {['small', 'medium', 'large', 'xl'].map(size => (
                               <button key={size} onClick={() => setFontSize(size)} className={`px-2 py-1 text-sm rounded ${fontSize === size ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}><FaTextHeight/></button>
                           ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                       <button onClick={handleLike} className={`flex items-center gap-2 p-2 rounded-lg ${mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                           <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-500'}/> <span className="text-sm font-semibold">{getBlogs?.blogs?.likedBy?.length || 0}</span>
                       </button>
                       {getBlogs && (
                         <ShareDialogBox 
                             key={`share-${params.id}-${getBlogs?.blogs?.title || 'default'}`}
                             title={getBlogs?.blogs?.title}
                             url={window.location.href}
                             description={getBlogs?.blogs?.content?.replace(/<[^>]*>/g, '').slice(0, 160)}
                             image={getBlogs?.blogs?.thumbnail || getBlogs?.thumbnail}
                             hashtags={getBlogs?.blogs?.tags || ['technology', 'programming', 'blog']}
                             blog={getBlogs}
                         />
                       )}
                       {user?.role === 'admin' && <button onClick={() => setIsEditing(!isEditing)} className={`p-2 rounded-lg ${mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><FaEdit className="text-blue-500"/></button>}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Table of Contents */}
                    {showTableOfContents && toc.length > 0 && (
                      <aside className="lg:w-1/4 order-first lg:order-last">
                        <div className="sticky top-24">
                          <h3 className="text-lg font-bold mb-4">Table of Contents</h3>
                          <ul className="space-y-2">
                              {toc.map(item => (
                                  <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}>
                                      <a href={`#${item.id}`} onClick={(e) => handleTocClick(e, item.id)} className={`block text-sm transition-colors ${activeSection === item.id ? 'text-blue-500 font-bold' : (mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black')}`}>{item.text}</a>
                                  </li>
                              ))}
                          </ul>
                        </div>
                      </aside>
                    )}

                    <main className={toc.length > 0 && showTableOfContents ? 'lg:w-3/4' : 'w-full'}>
                        {isEditing ? (
                          <div className="mb-8">
                            <textarea value={updatedContent} onChange={(e) => setUpdatedContent(e.target.value)} className={`w-full p-4 border-2 border-blue-500 rounded-xl focus:outline-none ${mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`} rows="20"/>
                            <div className="flex gap-4 mt-4">
                              <button onClick={updateBlog} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><FaCheck /> Save</button>
                              <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"><FaTimes /> Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className={`prose prose-lg max-w-none ${getFontSizeClass()} ${mode === 'dark' ? 'prose-invert text-white' : 'text-gray-900'} prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-lg ${mode === 'dark' ? 'prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-em:text-gray-300 prose-blockquote:text-gray-300 prose-code:text-gray-300 prose-pre:text-gray-300' : ''}`}>
                            <div 
                              className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}
                              dangerouslySetInnerHTML={createMarkup(processedContent)} 
                            />
                          </div>
                        )}
                    </main>
                </div>

                <Ad position="Inline" />
          </div>

          {showComments && (
            <div className="mt-16" id="comments">
              <h3 className={`text-3xl font-bold mb-8 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>💬 Comments ({allComment.length})</h3>
              <Comment
                addComment={addComment}
                commentText={commentText}
                setcommentText={setCommentText}
                allComment={allComment}
                fullName={fullName}
                setFullName={setFullName}
              />
            </div>
          )}

          {showRelatedPosts && (
            <section className="mt-16" id="related">
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-3xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>🔗 Related Posts</h2>
                <Link to="/allblogs" className="text-blue-500 hover:underline font-medium">View All</Link>
              </div>
              {otherBlogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {otherBlogs.map(blog => (
                    <div key={blog.id} className={`rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="relative">
                        <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" src={blog.thumbnail} alt={blog.blogs?.title} />
                        <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/30">{blog.blogs?.category || 'General'}</span>
                      </div>
                      <div className="p-4">
                        <h3 className={`text-lg font-bold line-clamp-2 mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{blog.blogs?.title}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                           <span>{blog.date}</span>
                           <span className="flex items-center gap-1"><FaEye/> {blog.blogs?.views || 0}</span>
                        </div>
                         <Link to={`/bloginfo/${blog.id}`} className="mt-4 inline-block text-blue-500 font-semibold hover:underline">Read More &rarr;</Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10">No related posts found.</p>
              )}
            </section>
          )}
          
          {/* Debug Section - Only show in development */}
          {process.env.NODE_ENV === 'development' && safeBlog && (
            <section className="mt-16 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">🔧 Debug: Social Media Preview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Current Thumbnail:</p>
                  <p className="text-sm text-gray-800 dark:text-white break-all">{safeBlog.thumbnail || 'No thumbnail'}</p>
                  
                  {/* Thumbnail Debug Info */}
                  {safeBlog.thumbnail && (() => {
                    const debugInfo = debugThumbnailUrl(safeBlog.thumbnail);
                    return (
                      <div className="mt-2 p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Thumbnail Analysis:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-medium">Empty:</span> 
                            <span className={debugInfo.isEmpty ? 'text-red-600' : 'text-green-600'}> {debugInfo.isEmpty ? 'Yes' : 'No'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Data URL:</span> 
                            <span className={debugInfo.isDataUrl ? 'text-red-600' : 'text-green-600'}> {debugInfo.isDataUrl ? 'Yes' : 'No'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Relative:</span> 
                            <span className={debugInfo.isRelative ? 'text-yellow-600' : 'text-green-600'}> {debugInfo.isRelative ? 'Yes' : 'No'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Absolute:</span> 
                            <span className={debugInfo.isAbsolute ? 'text-green-600' : 'text-red-600'}> {debugInfo.isAbsolute ? 'Yes' : 'No'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Firebase:</span> 
                            <span className={debugInfo.isFirebase ? 'text-green-600' : 'text-gray-600'}> {debugInfo.isFirebase ? 'Yes' : 'No'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Valid Image:</span> 
                            <span className={debugInfo.isValidImageUrl ? 'text-green-600' : 'text-red-600'}> {debugInfo.isValidImageUrl ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Length: {debugInfo.length} characters</p>
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Meta Tag Validation:</p>
                  {(() => {
                    const { metaTags, validation } = validateMetaTags();
                    return (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Title: <span className={validation.hasTitle ? 'text-green-600' : 'text-red-600'}>{validation.hasTitle ? '✓' : '✗'}</span></p>
                            <p className="text-gray-600 dark:text-gray-400 truncate">{metaTags.title}</p>
                          </div>
                          <div>
                            <p className="font-medium">Description: <span className={validation.hasDescription ? 'text-green-600' : 'text-red-600'}>{validation.hasDescription ? '✓' : '✗'}</span></p>
                            <p className="text-gray-600 dark:text-gray-400 truncate">{metaTags.description}</p>
                          </div>
                          <div>
                            <p className="font-medium">OG Image: <span className={validation.hasOgTags ? 'text-green-600' : 'text-red-600'}>{validation.hasOgTags ? '✓' : '✗'}</span></p>
                            <p className="text-gray-600 dark:text-gray-400 truncate">{metaTags.ogImage}</p>
                          </div>
                          <div>
                            <p className="font-medium">Twitter Image: <span className={validation.hasTwitterTags ? 'text-green-600' : 'text-red-600'}>{validation.hasTwitterTags ? '✓' : '✗'}</span></p>
                            <p className="text-gray-600 dark:text-gray-400 truncate">{metaTags.twitterImage}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="font-medium">Overall Status: <span className={validation.isComplete ? 'text-green-600' : 'text-red-600'}>{validation.isComplete ? '✓ Complete' : '✗ Incomplete'}</span></p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Test Social Media Previews:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(getSocialMediaTestLinks(window.location.href)).map(([platform, url]) => (
                      <a 
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                      >
                        Test {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default BlogInfo;
