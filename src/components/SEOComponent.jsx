import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  generateBlogSEOTags, 
  generateHomeSEOTags, 
  generateAllBlogsSEOTags,
  generateAboutSEOTags,
  generateLoginSEOTags,
  generateSignupSEOTags,
  generateAdminSEOTags,
  generate404SEOTags,
  generateUnsubscribeSEOTags,
  cleanObjectForJSON
} from '../utils/seoUtils';



/**
 * Safe string conversion utility
 * Ensures all values are converted to strings and handles Symbol values
 */
const safeString = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'symbol') {
    console.warn('Symbol value detected and converted to empty string:', value);
    return '';
  }
  try {
    const result = String(value);
    return result;
  } catch (error) {
    console.warn('Failed to convert value to string:', value, error);
    return '';
  }
};

/**
 * Safe array check and filter
 * Ensures array contains only valid string values
 */
const safeArray = (arr) => {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.filter(item => {
    if (typeof item === 'symbol') {
      console.warn('Symbol value in array filtered out:', item);
      return false;
    }
    try {
      const str = String(item);
      return str.trim() !== '';
    } catch {
      return false;
    }
  });
};

/**
 * Generate safe SEO tags with comprehensive error handling
 */
const generateSafeSEOTags = (type, blog, currentUrl, totalBlogs, selectedCategory, pageType) => {
  try {
    let seoTags;
    
    switch (type) {
      case 'blog':
        if (blog) {
          seoTags = generateBlogSEOTags(blog, currentUrl);
        } else {
          seoTags = generateHomeSEOTags(currentUrl);
        }
        break;
      
      case 'home':
        seoTags = generateHomeSEOTags(currentUrl);
        break;
      
      case 'allblogs':
        seoTags = generateAllBlogsSEOTags(currentUrl, totalBlogs, selectedCategory);
        break;
      
      case 'about':
        seoTags = generateAboutSEOTags(currentUrl, totalBlogs);
        break;
      
      case 'login':
        seoTags = generateLoginSEOTags(currentUrl);
        break;
      
      case 'signup':
        seoTags = generateSignupSEOTags(currentUrl);
        break;
      
      case 'admin':
        seoTags = generateAdminSEOTags(currentUrl, pageType);
        break;
      
      case '404':
        seoTags = generate404SEOTags(currentUrl);
        break;
      
      case 'unsubscribe':
        seoTags = generateUnsubscribeSEOTags(currentUrl);
        break;
      
      default:
        seoTags = generateHomeSEOTags(currentUrl);
    }
    
    // Deep clean the SEO tags
    return cleanObjectForJSON(seoTags);
  } catch (error) {
    console.error('Error generating SEO tags:', error);
    return {
      title: 'BlogSpot',
      description: '',
      keywords: '',
      author: '',
      robots: 'index, follow',
      ogType: 'website',
      ogTitle: 'BlogSpot',
      ogDescription: '',
      ogImage: '',
      ogImageWidth: '',
      ogImageHeight: '',
      ogImageAlt: '',
      ogUrl: currentUrl || '',
      ogSiteName: 'BlogSpot',
      ogLocale: 'en_US',
      twitterCard: 'summary',
      twitterTitle: 'BlogSpot',
      twitterDescription: '',
      twitterImage: '',
      twitterImageAlt: '',
      twitterSite: '',
      twitterCreator: '',
      themeColor: '#0ea5e9',
      msTileColor: '#0ea5e9',
      canonicalUrl: currentUrl || '',
      structuredData: {}
    };
  }
};

/**
 * Error Boundary Component for SEO
 */
class SEOErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error('SEO Error Boundary caught an error:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SEO Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return a minimal Helmet with just the title
      return (
        <Helmet>
          <title>BlogSpot</title>
        </Helmet>
      );
    }

    return this.props.children;
  }
}

/**
 * SEO Component for BlogSpot
 * Provides comprehensive SEO implementation with proper meta tags, Open Graph, Twitter Cards, and structured data
 */
const SEOComponent = ({ 
  type = 'blog', // 'blog', 'home', 'allblogs', 'about', 'login', 'signup', 'admin', '404', 'unsubscribe'
  blog = null, 
  currentUrl = window.location.href,
  totalBlogs = 0,
  selectedCategory = 'all',
  pageType = 'dashboard' // for admin pages
}) => {
  // Generate safe SEO tags
  const seoTags = generateSafeSEOTags(type, blog, currentUrl, totalBlogs, selectedCategory, pageType);
  
  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('SEOComponent rendered with:', { type, blog: !!blog, currentUrl });
    console.log('Generated SEO tags:', seoTags);
    console.log('OG Image:', seoTags.ogImage);
    console.log('Twitter Image:', seoTags.twitterImage);
    
    // Check for Symbol values in blog data
    if (blog) {
      const checkForSymbols = (obj, path = '') => {
        if (obj && typeof obj === 'object') {
          Object.entries(obj).forEach(([key, value]) => {
            const currentPath = path ? `${path}.${key}` : key;
            if (typeof value === 'symbol') {
              console.error('Symbol found in blog data at:', currentPath, value);
            } else if (value && typeof value === 'object') {
              checkForSymbols(value, currentPath);
            }
          });
        }
      };
      checkForSymbols(blog, 'blog');
    }
  }
  
  // Check if meta tags are actually rendered in DOM
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const ogImage = document.querySelector('meta[property="og:image"]');
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        console.log('DOM Check - OG Image meta tag:', ogImage?.content || 'NOT FOUND');
        console.log('DOM Check - Twitter Image meta tag:', twitterImage?.content || 'NOT FOUND');
      }, 100);
    }
  }, [seoTags.ogImage, seoTags.twitterImage]);
  
  return (
    <SEOErrorBoundary>
      <Helmet>
        {/* Test meta tag to verify Helmet is working */}
        {process.env.NODE_ENV === 'development' && (
          <meta name="seo-component-test" content="SEO Component is working" />
        )}
        
        {/* Basic Meta Tags */}
        <title>{safeString(seoTags.title)}</title>
        <meta name="description" content={safeString(seoTags.description)} />
        <meta name="keywords" content={safeString(seoTags.keywords)} />
        <meta name="author" content={safeString(seoTags.author)} />
        <meta name="robots" content={safeString(seoTags.robots)} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={safeString(seoTags.ogType)} />
        <meta property="og:title" content={safeString(seoTags.ogTitle)} />
        <meta property="og:description" content={safeString(seoTags.ogDescription)} />
        <meta property="og:image" content={safeString(seoTags.ogImage) || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} />
        <meta property="og:image:width" content={safeString(seoTags.ogImageWidth)} />
        <meta property="og:image:height" content={safeString(seoTags.ogImageHeight)} />
        <meta property="og:image:alt" content={safeString(seoTags.ogImageAlt)} />
        <meta property="og:url" content={safeString(seoTags.ogUrl)} />
        <meta property="og:site_name" content={safeString(seoTags.ogSiteName)} />
        <meta property="og:locale" content={safeString(seoTags.ogLocale)} />
        
        {/* Article-specific Open Graph tags */}
        {type === 'blog' && (
          <>
            <meta property="article:author" content={safeString(seoTags.articleAuthor)} />
            <meta property="article:published_time" content={safeString(seoTags.articlePublishedTime)} />
            <meta property="article:section" content={safeString(seoTags.articleSection)} />
            {safeArray(seoTags.articleTags).map((tag, index) => (
              <meta key={index} property="article:tag" content={safeString(tag)} />
            ))}
          </>
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={safeString(seoTags.twitterCard)} />
        <meta name="twitter:title" content={safeString(seoTags.twitterTitle)} />
        <meta name="twitter:description" content={safeString(seoTags.twitterDescription)} />
        <meta name="twitter:image" content={safeString(seoTags.twitterImage) || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} />
        <meta name="twitter:image:alt" content={safeString(seoTags.twitterImageAlt)} />
        <meta name="twitter:site" content={safeString(seoTags.twitterSite)} />
        <meta name="twitter:creator" content={safeString(seoTags.twitterCreator)} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content={safeString(seoTags.themeColor)} />
        <meta name="msapplication-TileColor" content={safeString(seoTags.msTileColor)} />
        <link rel="canonical" href={safeString(seoTags.canonicalUrl)} />
        
        {/* Structured Data */}
        {seoTags.structuredData && Object.keys(seoTags.structuredData).length > 0 && (() => {
          try {
            const cleanedData = cleanObjectForJSON(seoTags.structuredData || {});
            
            // Additional check for Symbol values before JSON.stringify
            const checkForSymbolsInData = (obj, path = '') => {
              if (obj && typeof obj === 'object') {
                Object.entries(obj).forEach(([key, value]) => {
                  const currentPath = path ? `${path}.${key}` : key;
                  if (typeof value === 'symbol') {
                    console.error('Symbol found in structured data at:', currentPath, value);
                  } else if (value && typeof value === 'object') {
                    checkForSymbolsInData(value, currentPath);
                  }
                });
              }
            };
            checkForSymbolsInData(cleanedData, 'structuredData');
            
            return (
              <script type="application/ld+json">
                {JSON.stringify(cleanedData)}
              </script>
            );
          } catch (error) {
            console.error('Error rendering structured data:', error);
            return null;
          }
        })()}
      </Helmet>
    </SEOErrorBoundary>
  );
};

export default SEOComponent; 