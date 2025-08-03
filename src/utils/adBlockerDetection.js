/**
 * Ad Blocker Detection and Fallback Utilities
 * Handles ad blocker interference and provides fallback mechanisms
 */

/**
 * Check if ad blocker is active
 * @returns {boolean} True if ad blocker is detected
 */
export const detectAdBlocker = () => {
  try {
    // Create a test element that ad blockers typically block
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-10000px';
    testAd.style.top = '-10000px';
    testAd.style.width = '1px';
    testAd.style.height = '1px';
    testAd.style.overflow = 'hidden';
    
    document.body.appendChild(testAd);
    
    // Check if the element is hidden by ad blocker
    const isBlocked = testAd.offsetHeight === 0 || 
                     testAd.offsetWidth === 0 || 
                     testAd.style.display === 'none';
    
    document.body.removeChild(testAd);
    
    return isBlocked;
  } catch (error) {
    console.warn('Ad blocker detection failed:', error);
    return false;
  }
};

/**
 * Handle blocked requests with fallback
 * @param {string} url - The blocked URL
 * @param {Function} fallback - Fallback function to call
 */
export const handleBlockedRequest = (url, fallback) => {
  console.warn('Request blocked by ad blocker:', url);
  
  if (typeof fallback === 'function') {
    try {
      fallback();
    } catch (error) {
      console.error('Fallback function failed:', error);
    }
  }
};

/**
 * Create a safe fetch wrapper that handles ad blocker interference
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {Function} fallback - Fallback function
 * @returns {Promise} Fetch promise with fallback
 */
export const safeFetch = async (url, options = {}, fallback = null) => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    if (error.message.includes('ERR_BLOCKED_BY_CLIENT') || 
        error.message.includes('net::ERR_BLOCKED_BY_CLIENT')) {
      console.warn('Request blocked by ad blocker:', url);
      
      if (typeof fallback === 'function') {
        return fallback();
      }
    }
    throw error;
  }
};

/**
 * Handle Firebase connection issues caused by ad blockers
 * @param {Error} error - The Firebase error
 * @param {Function} fallback - Fallback function
 */
export const handleFirebaseBlockedRequest = (error, fallback = null) => {
  if (error.message && (
    error.message.includes('ERR_BLOCKED_BY_CLIENT') ||
    error.message.includes('net::ERR_BLOCKED_BY_CLIENT') ||
    error.message.includes('Could not establish connection')
  )) {
    console.warn('Firebase request blocked by ad blocker:', error.message);
    
    if (typeof fallback === 'function') {
      try {
        fallback();
      } catch (fallbackError) {
        console.error('Firebase fallback failed:', fallbackError);
      }
    }
  }
};

/**
 * Create a safe image loader that handles blocked images
 * @param {string} src - Image source URL
 * @param {string} fallbackSrc - Fallback image URL
 * @returns {Promise<string>} Promise resolving to image URL
 */
export const safeImageLoader = (src, fallbackSrc = '/default-image.png') => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve(src);
    };
    
    img.onerror = () => {
      console.warn('Image blocked by ad blocker:', src);
      resolve(fallbackSrc);
    };
    
    img.src = src;
  });
};

/**
 * Initialize ad blocker detection and setup global handlers
 */
export const initializeAdBlockerHandling = () => {
  // Check for ad blocker on page load
  const hasAdBlocker = detectAdBlocker();
  
  if (hasAdBlocker) {
    console.info('Ad blocker detected. Some features may be limited.');
    
    // Add a global handler for blocked requests
    window.addEventListener('error', (event) => {
      if (event.error && event.error.message && 
          event.error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        event.preventDefault();
        console.warn('Ad blocker request blocked:', event.error.message);
        return false;
      }
    });
  }
  
  return hasAdBlocker;
};

/**
 * Create a safe analytics wrapper
 * @param {Function} analyticsFunction - Analytics function to call
 * @param {Function} fallback - Fallback function
 */
export const safeAnalytics = (analyticsFunction, fallback = null) => {
  try {
    if (typeof analyticsFunction === 'function') {
      analyticsFunction();
    }
  } catch (error) {
    if (error.message && error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
      console.warn('Analytics blocked by ad blocker');
      
      if (typeof fallback === 'function') {
        try {
          fallback();
        } catch (fallbackError) {
          console.error('Analytics fallback failed:', fallbackError);
        }
      }
    } else {
      console.error('Analytics error:', error);
    }
  }
}; 