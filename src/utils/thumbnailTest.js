/**
 * Thumbnail Testing Utility
 * Helps debug thumbnail URL issues for social media sharing
 */

/**
 * Test if a thumbnail URL is accessible and valid
 * @param {string} url - The URL to test
 * @returns {Promise<Object>} Test results
 */
export const testThumbnailUrl = async (url) => {
  if (!url) {
    return {
      valid: false,
      error: 'No URL provided',
      accessible: false,
      status: 'No URL'
    };
  }

  try {
    // Test if URL is valid
    new URL(url);
    
    // Test if image is accessible (CORS might block this in browser)
    const response = await fetch(url, { method: 'HEAD' });
    
    return {
      valid: true,
      accessible: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type'),
      url: url
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      accessible: false,
      status: 'Error',
      url: url
    };
  }
};

/**
 * Generate a list of common thumbnail URL patterns to test
 * @param {string} baseUrl - Base URL for the site
 * @returns {Array} List of test URLs
 */
export const generateTestThumbnails = (baseUrl = 'https://phcoder05.vercel.app') => {
  return [
    `${baseUrl}/logo.png`,
    `${baseUrl}/favicon.png`,
    `${baseUrl}/thumbnail.jpg`,
    `${baseUrl}/images/logo.png`,
    `${baseUrl}/assets/logo.png`,
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://via.placeholder.com/1200x630/0ea5e9/ffffff?text=Blog+Thumbnail',
    'https://picsum.photos/1200/630'
  ];
};

/**
 * Test all common thumbnail patterns
 * @param {string} baseUrl - Base URL for the site
 * @returns {Promise<Array>} Test results for all patterns
 */
export const testAllThumbnailPatterns = async (baseUrl = 'https://phcoder05.vercel.app') => {
  const testUrls = generateTestThumbnails(baseUrl);
  const results = [];
  
  for (const url of testUrls) {
    const result = await testThumbnailUrl(url);
    results.push({
      url,
      ...result
    });
  }
  
  return results;
};

/**
 * Generate social media preview test links
 * @param {string} pageUrl - The page URL to test
 * @returns {Object} Test links for different platforms
 */
export const getSocialMediaTestLinks = (pageUrl) => {
  return {
    facebook: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(pageUrl)}`,
    twitter: `https://cards-dev.twitter.com/validator?url=${encodeURIComponent(pageUrl)}`,
    linkedin: `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(pageUrl)}`,
    google: `https://search.google.com/test/rich-results?url=${encodeURIComponent(pageUrl)}`,
    pinterest: `https://developers.pinterest.com/tools/url-debugger/?link=${encodeURIComponent(pageUrl)}`
  };
};

/**
 * Check if a URL is a valid image URL
 * @param {string} url - The URL to check
 * @returns {boolean} True if it looks like an image URL
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowerUrl = url.toLowerCase();
  
  // Check for image extensions
  if (imageExtensions.some(ext => lowerUrl.includes(ext))) {
    return true;
  }
  
  // Check for common image hosting services
  const imageHosts = [
    'firebasestorage.googleapis.com',
    'images.unsplash.com',
    'picsum.photos',
    'via.placeholder.com',
    'imgur.com',
    'cloudinary.com'
  ];
  
  if (imageHosts.some(host => lowerUrl.includes(host))) {
    return true;
  }
  
  return false;
};

/**
 * Generate a fallback thumbnail URL
 * @returns {string} A reliable fallback thumbnail URL
 */
export const getFallbackThumbnail = () => {
  return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
};

/**
 * Debug thumbnail URL issues
 * @param {string} thumbnailUrl - The thumbnail URL to debug
 * @returns {Object} Debug information
 */
export const debugThumbnailUrl = (thumbnailUrl) => {
  return {
    originalUrl: thumbnailUrl,
    isEmpty: !thumbnailUrl || thumbnailUrl === '',
    isDataUrl: thumbnailUrl?.startsWith('data:'),
    isRelative: thumbnailUrl?.startsWith('/'),
    isAbsolute: thumbnailUrl?.startsWith('http'),
    isFirebase: thumbnailUrl?.includes('firebasestorage.googleapis.com'),
    isValidImageUrl: isValidImageUrl(thumbnailUrl),
    length: thumbnailUrl?.length || 0,
    suggestedFallback: getFallbackThumbnail()
  };
}; 