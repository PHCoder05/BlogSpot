// context/authContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase/FirebaseConfig'; // Your Firebase authentication import
import { onAuthStateChanged } from 'firebase/auth';
import UserService from '../utils/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // Track user login when user authenticates
      if (user) {
        try {
          await UserService.trackUserLogin({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: user.providerData[0]?.providerId || 'email'
          });
          console.log('✅ User login tracked successfully');
        } catch (error) {
          console.error('❌ Error tracking user login:', error);
        }
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
