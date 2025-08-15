import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
  setDoc 
} from 'firebase/firestore';
import { fireDb } from '../firebase/FirebaseConfig';

// Collections
const USERS_COLLECTION = 'users';
const LOGIN_SESSIONS_COLLECTION = 'login_sessions';
const NEWSLETTER_SUBSCRIBERS_COLLECTION = 'newsletter_subscribers';

export class UserService {
  
  /**
   * Track user login/registration
   * @param {Object} userData - User data
   * @returns {Promise<{success: boolean, message: string}>}
   */
  static async trackUserLogin(userData) {
    try {
      const { uid, email, displayName, photoURL, provider = 'email' } = userData;
      
      // Check if user exists
      const userRef = doc(fireDb, USERS_COLLECTION, uid);
      const userDoc = await getDoc(userRef);
      
      const now = serverTimestamp();
      const userInfo = {
        uid,
        email: email?.toLowerCase(),
        displayName: displayName || email?.split('@')[0],
        photoURL: photoURL || null,
        provider,
        lastLogin: now,
        isActive: true,
        updatedAt: now
      };
      
      if (!userDoc.exists()) {
        // New user - first login
        userInfo.createdAt = now;
        userInfo.loginCount = 1;
        userInfo.firstLogin = now;
      } else {
        // Existing user - update login info
        const existingData = userDoc.data();
        userInfo.createdAt = existingData.createdAt;
        userInfo.loginCount = (existingData.loginCount || 0) + 1;
        userInfo.firstLogin = existingData.firstLogin || now;
      }
      
      // Update user document
      await setDoc(userRef, userInfo, { merge: true });
      
      // Track login session
      await addDoc(collection(fireDb, LOGIN_SESSIONS_COLLECTION), {
        uid,
        email: email?.toLowerCase(),
        loginTime: now,
        provider,
        userAgent: navigator.userAgent,
        ip: await this.getUserIP()
      });
      
      console.log('✅ User login tracked successfully:', email);
      return {
        success: true,
        message: 'User login tracked successfully'
      };
      
    } catch (error) {
      console.error('❌ Error tracking user login:', error);
      return {
        success: false,
        message: 'Failed to track user login'
      };
    }
  }
  
  /**
   * Get user's IP address
   * @returns {Promise<string>}
   */
  static async getUserIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'Unknown';
    }
  }
  
  /**
   * Get all registered users
   * @returns {Promise<Array>}
   */
  static async getAllUsers() {
    try {
      console.log('📊 Fetching all users...');
      
      const q = query(
        collection(fireDb, USERS_COLLECTION),
        orderBy('lastLogin', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`✅ Found ${users.length} registered users`);
      return users;
    } catch (error) {
      console.error('❌ Error getting users:', error);
      return [];
    }
  }
  
  /**
   * Get users with newsletter subscription status
   * @returns {Promise<Array>}
   */
  static async getUsersWithNewsletterStatus() {
    try {
      console.log('📊 Fetching users with newsletter status...');
      
      // Get all users
      const users = await this.getAllUsers();
      
      // Get newsletter subscribers
      const subscribersQuery = query(collection(fireDb, NEWSLETTER_SUBSCRIBERS_COLLECTION));
      const subscribersSnapshot = await getDocs(subscribersQuery);
      const subscribers = subscribersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Create a map of subscriber emails for quick lookup
      const subscriberMap = new Map();
      subscribers.forEach(sub => {
        subscriberMap.set(sub.email, {
          subscribed: sub.isActive,
          subscribedAt: sub.subscribedAt,
          lastNotificationSent: sub.lastNotificationSent
        });
      });
      
      // Merge user data with newsletter status
      const usersWithNewsletter = users.map(user => {
        const newsletterInfo = subscriberMap.get(user.email) || {
          subscribed: false,
          subscribedAt: null,
          lastNotificationSent: null
        };
        
        return {
          ...user,
          newsletter: newsletterInfo
        };
      });
      
      console.log(`✅ Found ${usersWithNewsletter.length} users with newsletter status`);
      return usersWithNewsletter;
    } catch (error) {
      console.error('❌ Error getting users with newsletter status:', error);
      return [];
    }
  }
  
  /**
   * Get user login sessions
   * @param {number} limit - Number of sessions to fetch
   * @returns {Promise<Array>}
   */
  static async getLoginSessions(limit = 100) {
    try {
      console.log('📊 Fetching login sessions...');
      
      const q = query(
        collection(fireDb, LOGIN_SESSIONS_COLLECTION),
        orderBy('loginTime', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const sessions = querySnapshot.docs.slice(0, limit).map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`✅ Found ${sessions.length} login sessions`);
      return sessions;
    } catch (error) {
      console.error('❌ Error getting login sessions:', error);
      return [];
    }
  }
  
  /**
   * Update user's newsletter subscription preference
   * @param {string} email - User email
   * @param {boolean} allowNewsletter - Newsletter preference
   * @returns {Promise<{success: boolean, message: string}>}
   */
  static async updateNewsletterPreference(email, allowNewsletter) {
    try {
      console.log(`📧 Updating newsletter preference for ${email}: ${allowNewsletter}`);
      
      if (allowNewsletter) {
        // Subscribe user to newsletter
        const subscriberData = {
          email: email.toLowerCase().trim(),
          subscribedAt: serverTimestamp(),
          isActive: true,
          lastNotificationSent: null
        };
        
        await addDoc(collection(fireDb, NEWSLETTER_SUBSCRIBERS_COLLECTION), subscriberData);
      } else {
        // Unsubscribe user from newsletter
        const q = query(
          collection(fireDb, NEWSLETTER_SUBSCRIBERS_COLLECTION),
          where('email', '==', email.toLowerCase().trim())
        );
        
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.forEach(async (docSnapshot) => {
          await updateDoc(doc(fireDb, NEWSLETTER_SUBSCRIBERS_COLLECTION, docSnapshot.id), {
            isActive: false
          });
        });
      }
      
      console.log('✅ Newsletter preference updated successfully');
      return {
        success: true,
        message: 'Newsletter preference updated successfully'
      };
    } catch (error) {
      console.error('❌ Error updating newsletter preference:', error);
      return {
        success: false,
        message: 'Failed to update newsletter preference'
      };
    }
  }
  
  /**
   * Get user analytics
   * @returns {Promise<Object>}
   */
  static async getUserAnalytics() {
    try {
      console.log('📊 Generating user analytics...');
      
      const users = await this.getAllUsers();
      const sessions = await this.getLoginSessions();
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Calculate metrics
      const totalUsers = users.length;
      const activeUsers = users.filter(user => user.isActive).length;
      
      const newUsersToday = users.filter(user => {
        const createdAt = user.createdAt?.toDate();
        return createdAt && createdAt >= today;
      }).length;
      
      const newUsersThisWeek = users.filter(user => {
        const createdAt = user.createdAt?.toDate();
        return createdAt && createdAt >= thisWeek;
      }).length;
      
      const newUsersThisMonth = users.filter(user => {
        const createdAt = user.createdAt?.toDate();
        return createdAt && createdAt >= thisMonth;
      }).length;
      
      const loginsToday = sessions.filter(session => {
        const loginTime = session.loginTime?.toDate();
        return loginTime && loginTime >= today;
      }).length;
      
      const uniqueLoginsToday = new Set(
        sessions.filter(session => {
          const loginTime = session.loginTime?.toDate();
          return loginTime && loginTime >= today;
        }).map(session => session.email)
      ).size;
      
      const subscribedUsers = users.filter(user => user.newsletter?.subscribed).length;
      
      // Provider breakdown
      const providerBreakdown = users.reduce((acc, user) => {
        acc[user.provider] = (acc[user.provider] || 0) + 1;
        return acc;
      }, {});
      
      const analytics = {
        totalUsers,
        activeUsers,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        loginsToday,
        uniqueLoginsToday,
        subscribedUsers,
        providerBreakdown,
        generatedAt: now
      };
      
      console.log('✅ User analytics generated successfully');
      return analytics;
    } catch (error) {
      console.error('❌ Error generating user analytics:', error);
      return {};
    }
  }
  
  /**
   * Ban/Unban user
   * @param {string} uid - User ID
   * @param {boolean} banned - Ban status
   * @returns {Promise<{success: boolean, message: string}>}
   */
  static async updateUserStatus(uid, banned) {
    try {
      console.log(`👤 Updating user status: ${uid}, banned: ${banned}`);
      
      const userRef = doc(fireDb, USERS_COLLECTION, uid);
      await updateDoc(userRef, {
        isActive: !banned,
        bannedAt: banned ? serverTimestamp() : null,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ User status updated successfully');
      return {
        success: true,
        message: `User ${banned ? 'banned' : 'unbanned'} successfully`
      };
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      return {
        success: false,
        message: 'Failed to update user status'
      };
    }
  }
}

export default UserService;
