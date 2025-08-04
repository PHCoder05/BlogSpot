import { Fragment, useContext, useState, memo } from "react";
import myContext from "../../context/data/myContext";
import { generateShareUrl, optimizeThumbnail, generateHashtags } from "../../utils/seoUtils";
import {
    AiOutlineShareAlt,
    AiFillLinkedin,
    AiFillInstagram,
    AiFillGithub,
    AiFillFacebook,
    AiOutlineTwitter
} from 'react-icons/ai';
import { FaShare } from 'react-icons/fa';
import { FaWhatsapp, FaTelegram, FaReddit, FaPinterest, FaTimes } from 'react-icons/fa';
import { 
    FacebookShareButton, 
    TwitterShareButton, 
    LinkedinShareButton, 
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon
} from 'react-share';
import Toast from '../toast/Toast';

function ShareDialogBox({ title, url, description, image, hashtags = [], isOpen, onClose, blog }) {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // Use external control if isOpen is provided, otherwise use internal state
    const isDialogOpen = isOpen !== undefined ? isOpen : open;
    const handleOpen = () => {
        if (isOpen !== undefined) {
            onClose && onClose();
        } else {
            setOpen(!open);
        }
    };

    const context = useContext(myContext);
    const { mode } = context;

    // Debug: Log component rendering and image data
    console.log('ShareDialogBox rendering, mode:', mode, 'title:', title, 'image:', image, 'blog:', blog);

    // Get current page URL and title with proper SEO optimization
    const currentUrl = url || window.location.href;
    const currentTitle = title || document.title || 'PHcoder05 Blog';
    const currentDescription = description || 'Check out this amazing blog post!';
    
    // Handle blog object structure - extract thumbnail from blog object
    const getBlogImage = () => {
        if (blog && typeof blog === 'object') {
            // If blog object is provided, extract thumbnail from it
            return blog.blogs?.thumbnail || blog.thumbnail || image;
        }
        return image;
    };
    
    // Create a better fallback image based on the blog content
    const getFallbackImage = () => {
      // Use different images based on the blog title or category
      const blogTitle = (blog?.blogs?.title || title || '').toLowerCase();
      const blogDescription = (blog?.blogs?.content || description || '').toLowerCase();
      
      if (blogTitle.includes('programming') || blogDescription.includes('code') || blogDescription.includes('programming')) {
        return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
      } else if (blogTitle.includes('cloud') || blogDescription.includes('cloud') || blogDescription.includes('aws') || blogDescription.includes('azure')) {
        return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
      } else if (blogTitle.includes('devops') || blogDescription.includes('devops') || blogDescription.includes('deployment')) {
        return 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
      } else {
        // Default tech blog image
        return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
      }
    };
    
    // Optimize image for social sharing - handle both direct image and blog object structure
    const imageToUse = getBlogImage() || getFallbackImage();
    let optimizedImage;
    let currentImage;
    
    try {
        optimizedImage = optimizeThumbnail(imageToUse);
        currentImage = optimizedImage.url;
    } catch (error) {
        console.error('Error optimizing thumbnail:', error);
        optimizedImage = {
            url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            width: 1200,
            height: 630,
            alt: 'Blog Post Thumbnail'
        };
        currentImage = optimizedImage.url;
    }
    
    // Debug: Log optimized image
    console.log('Optimized image:', optimizedImage);
    
    // Additional debugging for image handling
    console.log('Original image prop:', image);
    console.log('Blog object:', blog);
    console.log('Current image URL:', currentImage);
    
    // Generate optimized hashtags - ensure hashtags is an array
    const safeHashtags = Array.isArray(hashtags) ? hashtags : [];
    let optimizedHashtags;
    let currentHashtags;
    
    try {
        optimizedHashtags = generateHashtags(safeHashtags);
        currentHashtags = optimizedHashtags.join(' ');
    } catch (error) {
        console.error('Error generating hashtags:', error);
        optimizedHashtags = ['technology', 'programming', 'blog'];
        currentHashtags = optimizedHashtags.join(' ');
    }

    // Create share data object for SEO utilities
    const shareData = {
        url: currentUrl,
        title: currentTitle,
        description: currentDescription,
        image: currentImage,
        hashtags: optimizedHashtags
    };

    // Generate optimized share URLs using SEO utilities
    let facebookShareUrl, twitterShareUrl, linkedinShareUrl, whatsappShareUrl, telegramShareUrl, redditShareUrl, pinterestShareUrl;
    
    try {
        facebookShareUrl = generateShareUrl('facebook', shareData);
        twitterShareUrl = generateShareUrl('twitter', shareData);
        linkedinShareUrl = generateShareUrl('linkedin', shareData);
        whatsappShareUrl = generateShareUrl('whatsapp', shareData);
        telegramShareUrl = generateShareUrl('telegram', shareData);
        redditShareUrl = generateShareUrl('reddit', shareData);
        pinterestShareUrl = generateShareUrl('pinterest', shareData);
    } catch (error) {
        console.error('Error generating share URLs:', error);
        // Fallback URLs
        const fallbackUrl = currentUrl;
        facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fallbackUrl)}`;
        twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fallbackUrl)}&text=${encodeURIComponent(currentTitle)}`;
        linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fallbackUrl)}`;
        whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(currentTitle + ' ' + fallbackUrl)}`;
        telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(fallbackUrl)}&text=${encodeURIComponent(currentTitle)}`;
        redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(fallbackUrl)}&title=${encodeURIComponent(currentTitle)}`;
        pinterestShareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(fallbackUrl)}&description=${encodeURIComponent(currentTitle)}`;
    }

    // Native Web Share API (for mobile devices)
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: currentTitle,
                    text: currentDescription,
                    url: currentUrl,
                });
                setToast({
                    message: 'Shared successfully!',
                    type: 'success',
                    duration: 2000
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback to copy link
            handleCopyLink();
        }
    };

    const handleShare = (shareUrl, platform) => {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        setToast({
            message: `Shared on ${platform}!`,
            type: 'success',
            duration: 2000
        });
        console.log(`Shared on ${platform}`);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setToast({
                message: 'Link copied to clipboard!',
                type: 'success',
                duration: 2000
            });
            console.log('Link copied to clipboard');
        } catch (err) {
            setToast({
                message: 'Failed to copy link',
                type: 'error',
                duration: 3000
            });
            console.error('Failed to copy link:', err);
        }
    };

    const closeToast = () => {
        setToast(null);
    };

    return (
        <Fragment>
            <div className="cursor-pointer" onClick={handleOpen}>
                <FaShare 
                    size={20} 
                    className={`transition-colors duration-200 hover:text-blue-500 ${
                        mode === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                    }`}
                    style={{ 
                        color: mode === 'dark' ? '#ffffff' : '#374151',
                        filter: mode === 'dark' ? 'brightness(1)' : 'none',
                        opacity: mode === 'dark' ? '1' : '1',
                        display: 'block',
                        visibility: 'visible'
                    }}
                />
                {/* Debug: Show text if icon doesn't render */}
                <span className="sr-only">Share</span>
                {/* Debug: Show visible text for testing */}
                <span className={`text-xs ${mode === 'dark' ? 'text-white' : 'text-gray-700'}`} style={{display: 'none'}}>SHARE</span>
            </div>
            
            {/* Custom Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={handleOpen}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className={`relative w-full max-w-md mx-4 p-6 rounded-xl shadow-2xl ${
                        mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                        {/* Close Button */}
                        <button 
                            onClick={handleOpen}
                            className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                                mode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <FaTimes size={20} />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className={`text-xl font-bold mb-2 ${
                                mode === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}>
                                Share This Page
                            </h2>
                            <p className={`text-sm ${
                                mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Share this page with your friends and followers
                            </p>
                        </div>

                        {/* Preview Card */}
                        <div className={`mb-6 p-4 rounded-lg border ${
                            mode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                        }`}>
                            <div className="flex items-start space-x-3">
                                <img 
                                    src={currentImage} 
                                    alt={currentTitle}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className={`text-sm font-semibold truncate ${
                                        mode === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {currentTitle}
                                    </h3>
                                    <p className={`text-xs mt-1 line-clamp-2 ${
                                        mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {currentDescription}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex gap-4 flex-wrap justify-center">
                            {/* Native Share (Mobile) */}
                            <div 
                                className="p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors duration-200 cursor-pointer"
                                onClick={handleNativeShare}
                                title="Share (Native)"
                            >
                                <svg 
                                    className="w-9 h-9 text-blue-600 hover:text-blue-700 transition-colors duration-200" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                                </svg>
                            </div>

                            {/* Facebook - Using react-share component */}
                            <FacebookShareButton url={currentUrl} quote={currentTitle + ' - ' + currentDescription}>
                                <div className="p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors duration-200">
                                    <FacebookIcon size={35} round />
                                </div>
                            </FacebookShareButton>

                            {/* Twitter - Using react-share component */}
                            <TwitterShareButton url={currentUrl} title={currentTitle + ' - ' + currentDescription} hashtags={optimizedHashtags}>
                                <div className="p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors duration-200">
                                    <TwitterIcon size={35} round />
                                </div>
                            </TwitterShareButton>

                            {/* LinkedIn - Using react-share component */}
                            <LinkedinShareButton url={currentUrl} title={currentTitle} summary={currentDescription}>
                                <div className="p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors duration-200">
                                    <LinkedinIcon size={35} round />
                                </div>
                            </LinkedinShareButton>

                            {/* WhatsApp - Using react-share component */}
                            <WhatsappShareButton url={currentUrl} title={currentTitle + ' - ' + currentDescription}>
                                <div className="p-3 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors duration-200">
                                                                <WhatsappIcon size={35} round />
                        </div>
                    </WhatsappShareButton>
                    {/* 
                      NOTE: If WhatsApp is showing the wrong thumbnail, it's likely due to caching.
                      To fix this, use the Facebook Sharing Debugger to clear the cache for the blog post URL:
                      https://developers.facebook.com/tools/debug/
                    */}
                    {/* Telegram */}
                    <div 
                        className="p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleShare(telegramShareUrl, 'Telegram')}
                        title="Share on Telegram"
                    >
                        <FaTelegram 
                            size={35} 
                            className="text-blue-500 hover:text-blue-600 transition-colors duration-200" 
                        />
                    </div>

                            {/* Reddit */}
                            <div 
                                className="p-3 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleShare(redditShareUrl, 'Reddit')}
                                title="Share on Reddit"
                            >
                                <FaReddit 
                                    size={35} 
                                    className="text-orange-500 hover:text-orange-600 transition-colors duration-200" 
                                />
                            </div>

                            {/* Pinterest */}
                            <div 
                                className="p-3 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleShare(pinterestShareUrl, 'Pinterest')}
                                title="Share on Pinterest"
                            >
                                <FaPinterest 
                                    size={35} 
                                    className="text-red-600 hover:text-red-700 transition-colors duration-200" 
                                />
                            </div>

                            {/* Copy Link */}
                            <div 
                                className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                onClick={handleCopyLink}
                                title="Copy link"
                            >
                                <svg 
                                    className="w-9 h-9 text-gray-600 hover:text-gray-700 transition-colors duration-200" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Powered By */}
                        <div className="text-center mt-6">
                            <h1 className="text-gray-600 text-sm">Powered By PHcoder05</h1>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={closeToast}
                />
            )}
        </Fragment>
    );
}

export default memo(ShareDialogBox);
