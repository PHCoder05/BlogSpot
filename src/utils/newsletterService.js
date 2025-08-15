import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { fireDb } from '../firebase/FirebaseConfig';
import EmailService from './emailService';

// Newsletter collection name
const NEWSLETTER_COLLECTION = 'newsletter_subscribers';
const NOTIFICATIONS_COLLECTION = 'notifications';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class NewsletterService {
  
  /**
   * Subscribe a user to the newsletter
   * @param {string} email - User's email address
   * @returns {Promise<{success: boolean, message: string}>}
   */
  static async subscribeToNewsletter(email) {
    try {
      console.log('📧 Newsletter subscription request for:', email);
      
      // Validate email
      if (!email || !EMAIL_REGEX.test(email)) {
        console.warn('❌ Invalid email format:', email);
        return {
          success: false,
          message: 'Please enter a valid email address.'
        };
      }

      // Check if email already exists
      const existingSubscriber = await this.getSubscriberByEmail(email);
      if (existingSubscriber) {
        console.warn('❌ Email already subscribed:', email);
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.'
        };
      }

      // Add subscriber to database
      const subscriberData = {
        email: email.toLowerCase().trim(),
        subscribedAt: serverTimestamp(),
        isActive: true,
        lastNotificationSent: null
      };

      console.log('📧 Adding subscriber to database:', subscriberData);
      await addDoc(collection(fireDb, NEWSLETTER_COLLECTION), subscriberData);
      console.log('✅ Subscriber added to database successfully');

      // Send welcome email
      console.log('📧 Sending welcome email to:', email);
      const welcomeEmailResult = await EmailService.sendWelcomeEmail(email.toLowerCase().trim());
      
      if (welcomeEmailResult) {
        console.log('✅ Welcome email sent successfully');
      } else {
        console.warn('⚠️ Welcome email failed to send, but subscription was successful');
      }

      return {
        success: true,
        message: 'Successfully subscribed to our newsletter! You\'ll receive updates about new blog posts.'
      };

    } catch (error) {
      console.error('❌ Error subscribing to newsletter:', error);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.'
      };
    }
  }

  /**
   * Unsubscribe a user from the newsletter
   * @param {string} email - User's email address
   * @returns {Promise<{success: boolean, message: string}>}
   */
  static async unsubscribeFromNewsletter(email) {
    try {
      console.log('📧 Newsletter unsubscription request for:', email);
      
      const subscriber = await this.getSubscriberByEmail(email);
      
      if (!subscriber) {
        console.warn('❌ Email not found for unsubscription:', email);
        return {
          success: false,
          message: 'Email not found in our subscription list.'
        };
      }

      console.log('📧 Removing subscriber from database:', subscriber.id);
      await deleteDoc(doc(fireDb, NEWSLETTER_COLLECTION, subscriber.id));
      console.log('✅ Subscriber removed from database successfully');

      // Send unsubscribe confirmation email
      console.log('📧 Sending unsubscribe confirmation email to:', email);
      const unsubscribeEmailResult = await EmailService.sendUnsubscribeEmail(email.toLowerCase().trim());
      
      if (unsubscribeEmailResult) {
        console.log('✅ Unsubscribe confirmation email sent successfully');
      } else {
        console.warn('⚠️ Unsubscribe confirmation email failed to send, but unsubscription was successful');
      }

      return {
        success: true,
        message: 'Successfully unsubscribed from our newsletter.'
      };

    } catch (error) {
      console.error('❌ Error unsubscribing from newsletter:', error);
      return {
        success: false,
        message: 'Failed to unsubscribe. Please try again later.'
      };
    }
  }

  /**
   * Get subscriber by email
   * @param {string} email - User's email address
   * @returns {Promise<Object|null>}
   */
  static async getSubscriberByEmail(email) {
    try {
      const q = query(
        collection(fireDb, NEWSLETTER_COLLECTION),
        where('email', '==', email.toLowerCase().trim())
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting subscriber:', error);
      return null;
    }
  }

  /**
   * Get all active subscribers
   * @returns {Promise<Array>}
   */
  static async getAllActiveSubscribers() {
    try {
      console.log('📧 Fetching all active subscribers...');
      
      const q = query(
        collection(fireDb, NEWSLETTER_COLLECTION),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const subscribers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`✅ Found ${subscribers.length} active subscribers`);
      return subscribers;
    } catch (error) {
      console.error('❌ Error getting active subscribers:', error);
      return [];
    }
  }

  /**
   * Send notification to all subscribers when new blog is posted
   * @param {Object} blogData - Blog post data
   * @returns {Promise<{success: boolean, message: string, sentCount: number}>}
   */
  static async sendNewBlogNotification(blogData) {
    try {
      console.log('📧 Starting new blog notification process...');
      console.log('📧 Blog data:', {
        id: blogData.id,
        title: blogData.blogs?.title,
        category: blogData.blogs?.category
      });
      
      const subscribers = await this.getAllActiveSubscribers();
      
      if (subscribers.length === 0) {
        console.log('📧 No active subscribers to notify');
        return {
          success: true,
          message: 'No active subscribers to notify.',
          sentCount: 0
        };
      }

      console.log(`📧 Sending notifications to ${subscribers.length} subscribers...`);

      // 🚀 PERFORMANCE OPTIMIZATION: Choose the best method based on subscriber count
      const USE_BULK_EMAIL = subscribers.length >= 10; // Use bulk for 10+ subscribers
      
      console.log(`📧 Using ${USE_BULK_EMAIL ? 'BULK EMAIL' : 'BATCHED EMAIL'} method for ${subscribers.length} subscribers`);

      // Create notification data
      const notificationData = {
        blogId: blogData.id,
        blogTitle: blogData.blogs?.title || 'New Blog Post',
        blogExcerpt: blogData.blogs?.content?.substring(0, 150) + '...' || 'Check out our latest blog post!',
        blogUrl: `${window.location.origin}/bloginfo/${blogData.id}`,
        sentAt: serverTimestamp(),
        recipientCount: subscribers.length
      };

      // Store notification record
      console.log('📧 Storing notification record in database...');
      await addDoc(collection(fireDb, NOTIFICATIONS_COLLECTION), notificationData);
      console.log('✅ Notification record stored successfully');

      // 🚀 SUPER FAST: Use bulk email API for large subscriber lists
      if (USE_BULK_EMAIL) {
        console.log('📧 Using BULK EMAIL method for ultra-fast sending...');
        
        const bulkResult = await EmailService.sendBulkBlogNotifications(subscribers, blogData);
        
        console.log(`📧 Bulk email completed:`);
        console.log(`   ✅ Successful: ${bulkResult.sentCount}`);
        console.log(`   ❌ Failed: ${bulkResult.failureCount}`);
        console.log(`   📊 Total: ${bulkResult.totalCount}`);

        return {
          success: bulkResult.success,
          message: bulkResult.message,
          sentCount: bulkResult.sentCount,
          totalCount: bulkResult.totalCount,
          failureCount: bulkResult.failureCount
        };
      }

      // ⚡ OPTIMIZED: Send emails in parallel batches for smaller lists
      let successCount = 0;
      let failureCount = 0;
      
      console.log('📧 Starting optimized bulk email sending...');
      
      // Configuration for batch processing
      const BATCH_SIZE = 20; // Send 20 emails at once
      const BATCH_DELAY = 500; // 500ms delay between batches
      
      // Split subscribers into batches
      const batches = [];
      for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
        batches.push(subscribers.slice(i, i + BATCH_SIZE));
      }
      
      console.log(`📧 Processing ${subscribers.length} subscribers in ${batches.length} batches of ${BATCH_SIZE}...`);
      
      // Process each batch in parallel
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        const batchNumber = batchIndex + 1;
        
        console.log(`📧 Processing batch ${batchNumber}/${batches.length} (${batch.length} emails)...`);
        
        // Send all emails in this batch simultaneously
        const batchPromises = batch.map(async (subscriber) => {
          try {
            const blogDataWithEmail = {
              ...blogData,
              subscriberEmail: subscriber.email
            };
            
            const emailResult = await this.sendEmailNotification(subscriber.email, blogDataWithEmail);
            
            if (emailResult) {
              return { success: true, email: subscriber.email };
            } else {
              return { success: false, email: subscriber.email };
            }
          } catch (error) {
            console.error(`❌ Batch ${batchNumber}: Error sending to ${subscriber.email}:`, error);
            return { success: false, email: subscriber.email, error };
          }
        });
        
        // Wait for all emails in this batch to complete
        const batchResults = await Promise.all(batchPromises);
        
        // Count successes and failures for this batch
        const batchSuccesses = batchResults.filter(result => result.success).length;
        const batchFailures = batchResults.filter(result => !result.success).length;
        
        successCount += batchSuccesses;
        failureCount += batchFailures;
        
        console.log(`✅ Batch ${batchNumber} completed: ${batchSuccesses} sent, ${batchFailures} failed`);
        
        // Add delay between batches to prevent rate limiting (except for last batch)
        if (batchIndex < batches.length - 1) {
          console.log(`⏱️ Waiting ${BATCH_DELAY}ms before next batch...`);
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }
      }

      console.log(`📧 Newsletter notification process completed:`);
      console.log(`   ✅ Successful: ${successCount}`);
      console.log(`   ❌ Failed: ${failureCount}`);
      console.log(`   📊 Total: ${subscribers.length}`);

      return {
        success: true,
        message: `Newsletter notification sent to ${successCount} subscribers. ${failureCount > 0 ? `${failureCount} emails failed to send.` : ''}`,
        sentCount: successCount,
        totalCount: subscribers.length,
        failureCount: failureCount
      };

    } catch (error) {
      console.error('❌ Error sending newsletter notifications:', error);
      return {
        success: false,
        message: 'Failed to send newsletter notifications.',
        sentCount: 0,
        error: error.message
      };
    }
  }

  /**
   * Send email notification to a subscriber
   * @param {string} email - Subscriber's email
   * @param {Object} blogData - Blog post data
   * @returns {Promise<boolean>}
   */
  static async sendEmailNotification(email, blogData) {
    try {
      console.log(`📧 Sending email notification to: ${email}`);
      const result = await EmailService.sendBlogNotification(email, blogData);
      
      if (result) {
        console.log(`✅ Email notification sent successfully to: ${email}`);
        return true;
      } else {
        console.warn(`⚠️ Email notification failed for: ${email}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error sending email notification to ${email}:`, error);
      return false;
    }
  }

  /**
   * Get notification history
   * @returns {Promise<Array>}
   */
  static async getNotificationHistory() {
    try {
      console.log('📧 Fetching notification history...');
      
      const querySnapshot = await getDocs(collection(fireDb, NOTIFICATIONS_COLLECTION));
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.sentAt?.toDate() - a.sentAt?.toDate());
      
      console.log(`✅ Found ${notifications.length} notifications in history`);
      return notifications;
    } catch (error) {
      console.error('❌ Error getting notification history:', error);
      return [];
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  static isValidEmail(email) {
    return EMAIL_REGEX.test(email);
  }

  /**
   * Test newsletter system
   * @returns {Promise<{success: boolean, message: string}>}
   */
  static async testNewsletterSystem() {
    try {
      console.log('🧪 Testing newsletter system...');
      
      // Test database connection
      const subscribers = await this.getAllActiveSubscribers();
      console.log('✅ Database connection test passed');
      
      // Test email service (if there are subscribers)
      if (subscribers.length > 0) {
        const testEmail = subscribers[0].email;
        console.log(`📧 Testing email service with: ${testEmail}`);
        
        const testResult = await EmailService.sendBlogNotification(testEmail, {
          id: 'test-blog',
          blogs: {
            title: 'Test Blog Post',
            content: 'This is a test blog post to verify the newsletter system is working correctly.',
            category: 'Test',
            readingTime: '2 min read'
          },
          subscriberEmail: testEmail
        });
        
        if (testResult) {
          console.log('✅ Email service test passed');
        } else {
          console.warn('⚠️ Email service test failed');
        }
      }
      
      return {
        success: true,
        message: 'Newsletter system test completed successfully'
      };
      
    } catch (error) {
      console.error('❌ Newsletter system test failed:', error);
      return {
        success: false,
        message: `Newsletter system test failed: ${error.message}`
      };
    }
  }

  /**
   * Send blog notification to all subscribers
   * @param {Object} blogData - Blog post data
   * @returns {Promise<{success: boolean, sentCount: number, failedCount: number, message: string}>}
   */
  static async sendBlogNotificationToAllSubscribers(blogData) {
    try {
      console.log('📧 Starting blog notification to all subscribers...');
      console.log('📧 Blog data:', {
        id: blogData.id,
        title: blogData.blogs?.title || blogData.title,
        category: blogData.blogs?.category || blogData.category
      });

      // Get all active subscribers
      const subscribers = await this.getAllActiveSubscribers();
      
      if (!subscribers || subscribers.length === 0) {
        console.warn('⚠️ No subscribers found');
        return {
          success: false,
          sentCount: 0,
          failedCount: 0,
          message: 'No subscribers found to send notifications to.'
        };
      }

      console.log(`📧 Found ${subscribers.length} subscribers`);

      let sentCount = 0;
      let failedCount = 0;
      const results = [];

      // Send emails in batches to avoid overwhelming the server
      const batchSize = 5;
      const batches = [];
      
      for (let i = 0; i < subscribers.length; i += batchSize) {
        batches.push(subscribers.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const batchPromises = batch.map(async (subscriber) => {
          try {
            console.log(`📧 Sending notification to: ${subscriber.email}`);
            const result = await EmailService.sendBlogNotification(subscriber.email, blogData);
            
            if (result) {
              sentCount++;
              console.log(`✅ Notification sent successfully to: ${subscriber.email}`);
              return { email: subscriber.email, success: true };
            } else {
              failedCount++;
              console.error(`❌ Failed to send notification to: ${subscriber.email}`);
              return { email: subscriber.email, success: false, error: 'Email service failed' };
            }
          } catch (error) {
            failedCount++;
            console.error(`❌ Error sending notification to ${subscriber.email}:`, error);
            return { email: subscriber.email, success: false, error: error.message };
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults.map(result => result.value || result.reason));

        // Add small delay between batches to prevent rate limiting
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Log detailed results
      console.log('📊 Blog notification results:', {
        totalSubscribers: subscribers.length,
        sentCount,
        failedCount,
        successRate: ((sentCount / subscribers.length) * 100).toFixed(1) + '%'
      });

      // Store notification record
      try {
        await addDoc(collection(fireDb, NOTIFICATIONS_COLLECTION), {
          type: 'blog_notification',
          blogId: blogData.id,
          blogTitle: blogData.blogs?.title || blogData.title,
          totalSubscribers: subscribers.length,
          sentCount,
          failedCount,
          sentAt: serverTimestamp(),
          results: results.slice(0, 100) // Store first 100 results to avoid document size limits
        });
      } catch (logError) {
        console.warn('⚠️ Failed to log notification record:', logError);
      }

      const successMessage = `Blog notification sent! ${sentCount} successful, ${failedCount} failed out of ${subscribers.length} subscribers.`;
      
      return {
        success: sentCount > 0,
        sentCount,
        failedCount,
        totalSubscribers: subscribers.length,
        message: successMessage,
        results
      };

    } catch (error) {
      console.error('❌ Error sending blog notifications:', error);
      return {
        success: false,
        sentCount: 0,
        failedCount: 0,
        message: `Failed to send blog notifications: ${error.message}`
      };
    }
  }

  /**
   * Send test blog notification to a specific email
   * @param {string} email - Test email address
   * @param {Object} blogData - Blog post data
   * @returns {Promise<boolean>}
   */
  static async sendTestBlogNotification(email, blogData) {
    try {
      console.log(`📧 Sending test blog notification to: ${email}`);
      return await EmailService.sendBlogNotification(email, blogData);
    } catch (error) {
      console.error('❌ Error sending test blog notification:', error);
      return false;
    }
  }
}

export default NewsletterService; 