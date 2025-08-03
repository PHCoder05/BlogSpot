// Firebase utility functions for better error handling
import { fireDb } from '../firebase/FirebaseConfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Check if Firebase is properly initialized
export const checkFirebaseConnection = async () => {
  try {
    // Try to access Firestore to check connection
    const testQuery = query(collection(fireDb, 'test'), limit(1));
    const testSnapshot = await getDocs(testQuery);
    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    return false;
  }
};

// Safe data fetching with error handling
export const safeFetchData = async (collectionName, options = {}) => {
  try {
    const { orderByField, orderByDirection, limitCount } = options;
    let q = collection(fireDb, collectionName);
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderByDirection || 'desc'));
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const snapshot = await getDocs(q);
    const data = [];
    
    snapshot.forEach((doc) => {
      const docData = doc.data();
      if (docData && typeof docData === 'object') {
        data.push({ ...docData, id: doc.id });
      }
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}:`, error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

// Validate Firebase data before processing
export const validateFirebaseData = (data) => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Check for common Firebase data structure
  if (data.blogs && typeof data.blogs === 'object') {
    return true;
  }
  
  // Check if it's a direct blog object
  if (data.title && data.content) {
    return true;
  }
  
  return false;
};

// Safe JSON parsing for Firebase responses
export const safeJsonParse = (data) => {
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data;
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
}; 