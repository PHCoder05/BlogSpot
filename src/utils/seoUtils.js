/**
 * SEO Utilities for BlogSpot
 * Provides comprehensive SEO functions for better social sharing and search engine optimization
 */

/**
 * Generate comprehensive SEO meta tags for blog posts
 * @param {Object} blog - Blog post data
 * @param {string} blog.title - Blog title
 * @param {string} blog.content - Blog content
 * @param {string} blog.thumbnail - Blog thumbnail URL
 * @param {Array} blog.tags - Blog tags
 * @param {string} blog.category - Blog category
 * @param {string} blog.date - Blog publish date
 * @param {string} blog.author - Blog author
 * @param {string} currentUrl - Current page URL
 * @returns {Object} SEO meta tags object
 */
export const generateBlogSEOTags = (blog, currentUrl) => {
  // Create a more engaging description that entices users to read more
  const createEngagingDescription = (content) => {
    if (!content) return 'Discover insights and knowledge in this comprehensive blog post.';
    
    // Remove HTML tags and clean up content
    const cleanText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    
    // Take first 200-250 characters for a better teaser
    const maxLength = 200;
    
    if (cleanText.length <= maxLength) {
      return cleanText;
    }
    
    // Find the last complete sentence within the limit
    const truncated = cleanText.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );
    
    if (lastSentenceEnd > 100) {
      // If we found a sentence ending after 100 chars, use it
      return truncated.substring(0, lastSentenceEnd + 1) + '..';
    } else {
      // Otherwise, find the last space to avoid cutting words
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 100) {
        return truncated.substring(0, lastSpace) + '...';
      }
      return truncated + '...';
    }
  };

  const engagingDescription = createEngagingDescription(blog?.content);
  const tags = blog?.tags?.join(', ') || 'blog, technology, programming';
  const author = blog?.author || 'Pankaj Hadole';
  const category = blog?.category || 'Technology';
  const title = blog?.title || 'Blog Post';
  
  // Use the blog thumbnail - no fallback to Unsplash
  const thumbnail = blog?.thumbnail || blog?.blogs?.thumbnail || '/logo.png';

  return {
    // Basic Meta Tags
    title: title,
    description: engagingDescription,
    keywords: tags,
    author: author,
    robots: 'index, follow',
    
    // Open Graph / Facebook
    ogType: 'article',
    ogTitle: title,
    ogDescription: engagingDescription,
    ogImage: thumbnail,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: title,
    ogUrl: currentUrl,
    ogSiteName: 'PHcoder05',
    ogLocale: 'en_US',
    articleAuthor: author,
    articlePublishedTime: blog?.date,
    articleSection: category,
    articleTags: Array.isArray(blog?.tags) ? blog.tags.filter(tag => typeof tag === 'string' && tag.trim() !== '') : [],
    
    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: engagingDescription,
    twitterImage: thumbnail,
    twitterImageAlt: title,
    twitterSite: '@phcoder05',
    twitterCreator: '@phcoder05',
    
    // Additional SEO
    themeColor: '#0ea5e9',
    msTileColor: '#0ea5e9',
    canonicalUrl: currentUrl,
    
    // Structured Data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": engagingDescription,
      "image": {
        "@type": "ImageObject",
        "url": thumbnail,
        "width": 1200,
        "height": 630
      },
      "author": {
        "@type": "Person",
        "name": author,
        "url": "https://phcoder05.vercel.app/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "PHcoder05",
        "logo": {
          "@type": "ImageObject",
          "url": "https://phcoder05.vercel.app/logo.png"
        }
      },
      "datePublished": blog?.date,
      "dateModified": blog?.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": currentUrl
      },
      "articleSection": category,
      "keywords": tags,
      "wordCount": blog?.content?.replace(/<[^>]*>/g, '').split(' ').length || 0,
      "timeRequired": `PT${Math.ceil((blog?.content?.split(' ').length || 0) / 200)}M`
    }
  };
};

/**
 * Generate SEO meta tags for home page
 * @param {string} currentUrl - Current page URL
 * @returns {Object} SEO meta tags object
 */
export const generateHomeSEOTags = (currentUrl) => {
  return {
    title: 'PHcoder05 - Technology Blog & Programming Tutorials | Pankaj Hadole',
    description: 'Explore insightful technology blogs, programming tutorials, DevOps guides, and development tips. Stay updated with the latest in tech, cloud computing, and software development.',
    keywords: 'technology blog, programming tutorials, DevOps, cloud computing, software development, web development, tech news, programming tips, coding tutorials, Pankaj Hadole',
    author: 'Pankaj Hadole',
    robots: 'index, follow',
    
    // Open Graph
    ogType: 'website',
    ogTitle: 'PHcoder05 - Technology Blog & Programming Tutorials',
    ogDescription: 'Explore insightful technology blogs, programming tutorials, DevOps guides, and development tips.',
    ogImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    ogUrl: currentUrl,
    ogSiteName: 'PHcoder05',
    ogLocale: 'en_US',
    
    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterTitle: 'PHcoder05 - Technology Blog & Programming Tutorials',
    twitterDescription: 'Explore insightful technology blogs, programming tutorials, DevOps guides, and development tips.',
    twitterImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    
    // Additional SEO
    themeColor: '#0ea5e9',
    msTileColor: '#0ea5e9',
    canonicalUrl: currentUrl,
    
    // Structured Data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "PHcoder05",
      "url": currentUrl,
      "description": "Technology blog and programming tutorials by Pankaj Hadole",
      "author": {
        "@type": "Person",
        "name": "Pankaj Hadole",
        "jobTitle": "Software Developer",
        "url": "https://phcoder05.vercel.app/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "PHcoder05",
        "logo": {
          "@type": "ImageObject",
          "url": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
        }
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${currentUrl}search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  };
};

/**
 * Generate SEO meta tags for all blogs page
 * @param {string} currentUrl - Current page URL
 * @param {number} totalBlogs - Total number of blogs
 * @param {string} selectedCategory - Currently selected category
 * @returns {Object} SEO meta tags object
 */
export const generateAllBlogsSEOTags = (currentUrl, totalBlogs = 0, selectedCategory = 'all') => {
  const categoryText = selectedCategory === 'all' ? '' : ` in ${selectedCategory}`;
  
  return {
    title: `All Articles${categoryText} - PHcoder05 Blog | Programming & Technology`,
    description: `Explore ${totalBlogs} articles on programming, cloud computing, DevOps, and technology. Find in-depth tutorials, guides, and insights for developers.`,
    keywords: 'programming articles, cloud computing, devops, technology tutorials, software development, coding guides, tech blog posts',
    author: 'Pankaj Hadole',
    robots: 'index, follow',
    
    // Open Graph
    ogType: 'website',
    ogTitle: `All Articles${categoryText} - PHcoder05 Blog`,
    ogDescription: `Explore ${totalBlogs} articles on programming, cloud computing, DevOps, and technology.`,
    ogImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    ogUrl: currentUrl,
    ogSiteName: 'PHcoder05',
    ogLocale: 'en_US',
    
    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterTitle: `All Articles${categoryText} - PHcoder05 Blog`,
    twitterDescription: `Explore ${totalBlogs} articles on programming, cloud computing, DevOps, and technology.`,
    twitterImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    
    // Additional SEO
    themeColor: '#0ea5e9',
    msTileColor: '#0ea5e9',
    canonicalUrl: currentUrl,
    
    // Structured Data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `All Articles${categoryText}`,
      "description": `Collection of ${totalBlogs} articles on programming, cloud computing, DevOps, and technology`,
      "url": currentUrl,
      "numberOfItems": totalBlogs,
      "publisher": {
        "@type": "Organization",
        "name": "PHcoder05",
        "logo": {
          "@type": "ImageObject",
          "url": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
        }
      }
    }
  };
};

/**
 * Generate SEO meta tags for about page
 * @param {string} currentUrl - Current page URL
 * @param {number} totalBlogs - Total number of published blogs
 * @returns {Object} SEO meta tags object
 */
export const generateAboutSEOTags = (currentUrl, totalBlogs = 0) => {
  return {
    title: 'About PHcoder05 - Technology Blog & Developer Portfolio | Pankaj Hadole',
    description: 'Learn about PHcoder05, a technology blog focused on programming tutorials, cloud computing, DevOps, and software development. Meet Pankaj Hadole, the developer behind the blog.',
    keywords: 'about PHcoder05, Pankaj Hadole, technology blogger, software developer, programming tutorials, tech blog author',
    author: 'Pankaj Hadole',
    robots: 'index, follow',
    
    // Open Graph
    ogType: 'profile',
    ogTitle: 'About PHcoder05 - Technology Blog & Developer Portfolio',
    ogDescription: 'Learn about PHcoder05, a technology blog focused on programming tutorials, cloud computing, DevOps, and software development.',
    ogImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    ogUrl: currentUrl,
    ogSiteName: 'PHcoder05',
    ogLocale: 'en_US',
    
    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterTitle: 'About PHcoder05 - Technology Blog & Developer Portfolio',
    twitterDescription: 'Learn about PHcoder05, a technology blog focused on programming tutorials, cloud computing, DevOps, and software development.',
    twitterImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    
    // Additional SEO
    themeColor: '#0ea5e9',
    msTileColor: '#0ea5e9',
    canonicalUrl: currentUrl,
    
    // Structured Data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Pankaj Hadole",
      "jobTitle": "Software Developer & Technology Blogger",
      "url": "https://phcoder05.vercel.app/",
      "description": "Technology blogger and software developer focused on programming tutorials, cloud computing, and DevOps",
      "image": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "sameAs": [
        "https://github.com/phcoder05",
        "https://linkedin.com/in/pankaj-hadole",
        "https://twitter.com/phcoder05"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "PHcoder05"
      },
      "knowsAbout": ["Programming", "Cloud Computing", "DevOps", "Software Development", "Technology Blogging"]
    }
  };
};

/**
 * Generate SEO meta tags for login page
 * @param {string} currentUrl - Current page URL
 * @returns {Object} SEO meta tags object
 */
export const generateLoginSEOTags = (currentUrl) => {
  return {
    title: 'Login - PHcoder05 Blog | Access Your Account',
    description: 'Login to your PHcoder05 account to access personalized features, bookmark articles, and engage with the community.',
    keywords: 'login, PHcoder05, user account, blog login, technology blog login',
    author: 'Pankaj Hadole',
    robots: 'noindex, nofollow', // Login pages should not be indexed
    
    // Open Graph
    ogType: 'website',
    ogTitle: 'Login - PHcoder05 Blog',
    ogDescription: 'Login to your PHcoder05 account to access personalized features.',
    ogImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    ogUrl: currentUrl,
    ogSiteName: 'PHcoder05',
    ogLocale: 'en_US',
    
    // Twitter Card
    twitterCard: 'summary',
    twitterTitle: 'Login - PHcoder05 Blog',
    twitterDescription: 'Login to your PHcoder05 account to access personalized features.',
    twitterImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    
    // Additional SEO
    themeColor: '#0ea5e9',
    msTileColor: '#0ea5e9',
    canonicalUrl: currentUrl,
    
    // Structured Data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Login - PHcoder05 Blog",
      "description": "Login page for PHcoder05 blog users",
      "url": currentUrl,
      "isPartOf": {
        "@type": "WebSite",
        "name": "PHcoder05"
      }
    }
  };
};

/**
 * Generate SEO meta tags for signup page
 * @param {string} currentUrl - Current page URL
 * @returns {Object} SEO meta tags object
 */
export const generateSignupSEOTags = (currentUrl) => {
  return {
    title: 'Sign Up - PHcoder05 Blog | Join Our Community',
    description: 'Create your PHcoder05 account to bookmark articles, leave comments, and stay updated with the latest technology content.',
    keywords: 'sign up, register, PHcoder05, create account, technology blog registration',
    author: 'Pankaj Hadole',
    robots: 'noindex, nofollow', // Signup pages should not be indexed
    
    // Open Graph
    ogType: 'website',
    ogTitle: 'Sign Up - PHcoder05 Blog',
    ogDescription: 'Create your PHcoder05 account to bookmark articles and engage with the community.',
    ogImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    ogUrl: currentUrl,
    ogSiteName: 'PHcoder05',
    ogLocale: 'en_US',
    
    // Twitter Card
    twitterCard: 'summary',
    twitterTitle: 'Sign Up - PHcoder05 Blog',
    twitterDescription: 'Create your PHcoder05 account to bookmark articles and engage with the community.',
    twitterImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    
    // Additional SEO
    themeColor: '#0ea5e9',
    msTileColor: '#0ea5e9',
    canonicalUrl: currentUrl,
    
    // Structured Data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Sign Up - PHcoder05 Blog",
      "description": "Registration page for PHcoder05 blog users",
      "url": currentUrl,
      "isPartOf": {
        "@type": "WebSite",
        "name": "PHcoder05"
      }
    }
  };
};

/**
 * Generate SEO meta tags for admin pages
 * @param {string} currentUrl - Current page URL
 * @param {string} pageType - Type of admin page (dashboard, create, edit, etc.)
 * @returns {Object} SEO meta tags object
 */
export const generateAdminSEOTags = (currentUrl, pageType = 'dashboard') => {
  const pageTitles = {
    dashboard: 'Admin Dashboard - PHcoder05 Blog',
    create: 'Create Blog Post - PHcoder05 Admin',
    edit: 'Edit Blog Post - PHcoder05 Admin',
    profile: 'Edit Profile - PHcoder05 Admin',
    login: 'Admin Login - PHcoder05 Blog'
  };
  
  const pageDescriptions = {
    dashboard: 'Admin dashboard for managing PHcoder05 blog content and user interactions.',
    create: 'Create and publish new blog posts on PHcoder05.',
    edit: 'Edit existing blog posts on PHcoder05.',
    profile: 'Edit admin profile and account settings.',
    login: 'Admin login for PHcoder05 blog management.'
  };
  
  return {
    title: pageTitles[pageType] || 'Admin - PHcoder05 Blog',
    description: pageDescriptions[pageType] || 'Admin panel for PHcoder05 blog management.',
    keywords: 'admin, PHcoder05, blog management, content management, admin panel',
    author: 'Pankaj Hadole',
    robots: 'noindex, nofollow', // Admin pages should not be indexed
    
    // Open Graph
    ogType: 'website',
    ogTitle: pageTitles[pageType] || 'Admin - PHcoder05 Blog',
    ogDescription: pageDescriptions[pageType] || 'Admin panel for PHcoder05 blog management.',
    ogImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    ogUrl: currentUrl,
    ogSiteName: 'PHcoder05',
    ogLocale: 'en_US',
    
    // Twitter Card
    twitterCard: 'summary',
    twitterTitle: pageTitles[pageType] || 'Admin - PHcoder05 Blog',
    twitterDescription: pageDescriptions[pageType] || 'Admin panel for PHcoder05 blog management.',
    twitterImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    
    // Additional SEO
    themeColor: '#0ea5e9',
    msTileColor: '#0ea5e9',
    canonicalUrl: currentUrl,
    
    // Structured Data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": pageTitles[pageType] || 'Admin - PHcoder05 Blog',
      "description": pageDescriptions[pageType] || 'Admin panel for PHcoder05 blog management.',
      "url": currentUrl,
      "isPartOf": {
        "@type": "WebSite",
        "name": "PHcoder05"
      }
    }
  };
};

/**
 * Generate optimized share URL for social media platforms
 * @param {string} platform - Social media platform
 * @param {Object} shareData - Share data object
 * @returns {string} Optimized share URL
 */
export const generateShareUrl = (platform, shareData) => {
  const { url, title, description, image, hashtags } = shareData;
  
  switch (platform.toLowerCase()) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title + ' - ' + description)}`;
    
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - ' + description)}&hashtags=${encodeURIComponent(hashtags.join(' '))}`;
    
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
    
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(title + ' - ' + description + ' ' + url)}`;
    
    case 'telegram':
      return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - ' + description)}`;
    
    case 'reddit':
      return `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    
    case 'pinterest':
      return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title + ' - ' + description)}`;
    
    default:
      return url;
  }
};

/**
 * Validate and optimize thumbnail image for social sharing
 * @param {string} imageUrl - Image URL
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {Object} Optimized image object
 */
export const optimizeThumbnail = (imageUrl, width = 1200, height = 630) => {
  // Check if image URL is valid and not empty
  if (!imageUrl || imageUrl === '' || imageUrl === null || imageUrl === undefined) {
    // Return a more appropriate default image that represents the blog
    return {
      url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      width: width,
      height: height,
      alt: 'Blog Post Thumbnail'
    };
  }

  // If the image URL is a relative path, make it absolute
  let processedUrl = imageUrl;
  if (imageUrl.startsWith('/') || !imageUrl.startsWith('http')) {
    // If it's a relative path, try to make it absolute
    if (imageUrl.startsWith('/')) {
      processedUrl = `${window.location.origin}${imageUrl}`;
    } else if (!imageUrl.startsWith('http')) {
      // If it's not a full URL, assume it's a relative path
      processedUrl = `${window.location.origin}/${imageUrl}`;
    }
  }

  return {
    url: processedUrl,
    width: width,
    height: height,
    alt: 'Blog Post Thumbnail'
  };
};

/**
 * Generate reading time estimate
 * @param {string} content - Blog content
 * @returns {number} Reading time in minutes
 */
export const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Clean and truncate text for meta descriptions
 * @param {string} text - Raw text
 * @param {number} maxLength - Maximum length (default: 160)
 * @returns {string} Cleaned and truncated text
 */
export const cleanMetaDescription = (text, maxLength = 160) => {
  if (!text) return '';
  
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace
  const trimmedText = cleanText.replace(/\s+/g, ' ').trim();
  
  // Truncate if too long
  if (trimmedText.length <= maxLength) {
    return trimmedText;
  }
  
  return trimmedText.substring(0, maxLength - 3) + '...';
};

/**
 * Clean object to remove Symbol values and ensure all values are serializable
 * @param {Object} obj - Object to clean
 * @returns {Object} Cleaned object
 */
export const cleanObjectForJSON = (obj) => {
  if (obj === null || obj === undefined) {
    return {};
  }
  
  if (typeof obj === 'symbol') {
    console.warn('Symbol value detected in cleanObjectForJSON:', obj);
    return '';
  }
  
  if (typeof obj !== 'object') {
    try {
      return String(obj);
    } catch (error) {
      console.warn('Failed to convert value to string in cleanObjectForJSON:', obj, error);
      return '';
    }
  }
  
  if (Array.isArray(obj)) {
    return obj
      .filter(item => typeof item !== 'symbol')
      .map(item => cleanObjectForJSON(item))
      .filter(item => item !== null && item !== undefined);
  }
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'symbol') {
      console.warn('Symbol value detected in object key:', key, value);
      continue; // Skip Symbol values
    }
    if (value !== null && value !== undefined) {
      try {
        cleaned[key] = cleanObjectForJSON(value);
      } catch (error) {
        console.warn('Error cleaning object value for key:', key, value, error);
        cleaned[key] = '';
      }
    }
  }
  
  // Additional check for any remaining Symbol values
  const checkForRemainingSymbols = (obj, path = '') => {
    if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === 'symbol') {
          console.error('Symbol still present after cleaning at:', currentPath, value);
        } else if (value && typeof value === 'object') {
          checkForRemainingSymbols(value, currentPath);
        }
      });
    }
  };
  checkForRemainingSymbols(cleaned, 'cleaned');
  
  return cleaned;
};

/**
 * Generate hashtags for social sharing
 * @param {Array} tags - Blog tags
 * @param {Array} defaultTags - Default tags to include
 * @returns {Array} Optimized hashtags
 */
export const generateHashtags = (tags = [], defaultTags = ['technology', 'programming', 'blog']) => {
  const allTags = [...tags, ...defaultTags];
  const uniqueTags = [...new Set(allTags)];
  
  // Convert to hashtags and limit to reasonable number
  return uniqueTags.slice(0, 5).map(tag => 
    tag.startsWith('#') ? tag : `#${tag.replace(/\s+/g, '')}`
  );
};

/**
 * Generate SEO meta tags for 404 page
 * @param {string} currentUrl - Current page URL
 * @returns {Object} SEO meta tags object
 */
export const generate404SEOTags = (currentUrl) => {
  return {
    title: '404 - Page Not Found | PHcoder05 Blog',
    description: 'The page you are looking for does not exist. Play our memory game while you\'re here or return to the homepage.',
    keywords: '404, page not found, error, memory game, PHcoder05 blog',
    author: 'Pankaj Hadole',
    robots: 'noindex, nofollow', // Don't index 404 pages
    
    // Open Graph
    ogType: 'website',
    ogTitle: '404 - Page Not Found | PHcoder05 Blog',
    ogDescription: 'The page you are looking for does not exist. Play our memory game while you\'re here.',
    ogImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    ogUrl: currentUrl,
    ogSiteName: 'PHcoder05',
    ogLocale: 'en_US',
    
    // Twitter Card
    twitterCard: 'summary',
    twitterTitle: '404 - Page Not Found | PHcoder05 Blog',
    twitterDescription: 'The page you are looking for does not exist. Play our memory game while you\'re here.',
    twitterImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    
    // Additional SEO
    themeColor: '#0ea5e9',
    msTileColor: '#0ea5e9',
    canonicalUrl: currentUrl,
    
    // Structured Data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "404 - Page Not Found",
      "description": "The page you are looking for does not exist",
      "url": currentUrl,
      "isPartOf": {
        "@type": "WebSite",
        "name": "PHcoder05",
        "url": "https://phcoder05.vercel.app/"
      }
    }
  };
}; 

/**
 * Generate SEO meta tags for unsubscribe page
 * @param {string} currentUrl - Current page URL
 * @returns {Object} SEO meta tags object
 */
export const generateUnsubscribeSEOTags = (currentUrl) => {
  return {
    title: 'Unsubscribe from Newsletter - PHcoder05 Blog',
    description: 'Unsubscribe from our newsletter. We\'re sorry to see you go, but you can always resubscribe later.',
    keywords: 'unsubscribe, newsletter, email, PHcoder05, opt-out, email preferences',
    author: 'Pankaj Hadole',
    robots: 'noindex, nofollow', // Don't index unsubscribe pages
    
    // Open Graph
    ogType: 'website',
    ogTitle: 'Unsubscribe from Newsletter - PHcoder05 Blog',
    ogDescription: 'Unsubscribe from our newsletter. We\'re sorry to see you go, but you can always resubscribe later.',
    ogImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    ogUrl: currentUrl,
    ogSiteName: 'PHcoder05',
    ogLocale: 'en_US',
    
    // Twitter Card
    twitterCard: 'summary',
    twitterTitle: 'Unsubscribe from Newsletter - PHcoder05 Blog',
    twitterDescription: 'Unsubscribe from our newsletter. We\'re sorry to see you go, but you can always resubscribe later.',
    twitterImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    
    // Additional SEO
    themeColor: '#0ea5e9',
    msTileColor: '#0ea5e9',
    canonicalUrl: currentUrl,
    
    // Structured Data
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Unsubscribe from Newsletter",
      "description": "Unsubscribe from PHcoder05 newsletter",
      "url": currentUrl,
      "isPartOf": {
        "@type": "WebSite",
        "name": "PHcoder05"
      }
    }
  };
}; 
