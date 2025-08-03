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
      // Validate email
      if (!email || !EMAIL_REGEX.test(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address.'
        };
      }

      // Check if email already exists
      const existingSubscriber = await this.getSubscriberByEmail(email);
      if (existingSubscriber) {
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

      await addDoc(collection(fireDb, NEWSLETTER_COLLECTION), subscriberData);

      // Send welcome email
      await EmailService.sendWelcomeEmail(email.toLowerCase().trim());

      return {
        success: true,
        message: 'Successfully subscribed to our newsletter! You\'ll receive updates about new blog posts.'
      };

    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
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
      const subscriber = await this.getSubscriberByEmail(email);
      
      if (!subscriber) {
        return {
          success: false,
          message: 'Email not found in our subscription list.'
        };
      }

      await deleteDoc(doc(fireDb, NEWSLETTER_COLLECTION, subscriber.id));

      // Send unsubscribe confirmation email
      await EmailService.sendUnsubscribeEmail(email.toLowerCase().trim());

      return {
        success: true,
        message: 'Successfully unsubscribed from our newsletter.'
      };

    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
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
      console.error('Error getting subscriber:', error);
      return null;
    }
  }

  /**
   * Get all active subscribers
   * @returns {Promise<Array>}
   */
  static async getAllActiveSubscribers() {
    try {
      const q = query(
        collection(fireDb, NEWSLETTER_COLLECTION),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting active subscribers:', error);
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
      const subscribers = await this.getAllActiveSubscribers();
      
      if (subscribers.length === 0) {
        return {
          success: true,
          message: 'No active subscribers to notify.',
          sentCount: 0
        };
      }

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
      await addDoc(collection(fireDb, NOTIFICATIONS_COLLECTION), notificationData);

      // In a real application, you would integrate with an email service here
      // For now, we'll simulate the email sending process
      const emailPromises = subscribers.map(subscriber => 
        this.sendEmailNotification(subscriber.email, blogData)
      );

      await Promise.all(emailPromises);

      return {
        success: true,
        message: `Notification sent to ${subscribers.length} subscribers.`,
        sentCount: subscribers.length
      };

    } catch (error) {
      console.error('Error sending notifications:', error);
      return {
        success: false,
        message: 'Failed to send notifications.',
        sentCount: 0
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
      return await EmailService.sendBlogNotification(email, blogData);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
      return false;
    }
  }

  /**
   * Get notification history
   * @returns {Promise<Array>}
   */
  static async getNotificationHistory() {
    try {
      const querySnapshot = await getDocs(collection(fireDb, NOTIFICATIONS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.sentAt?.toDate() - a.sentAt?.toDate());
    } catch (error) {
      console.error('Error getting notification history:', error);
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
}

export default NewsletterService; 