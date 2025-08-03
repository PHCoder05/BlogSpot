// Access code utilities for personal blog protection
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fireDb } from '../firebase/FirebaseConfig';

// Default access code - you can change this
const DEFAULT_ACCESS_CODE = 'personal2024';

// Store access code in localStorage for session persistence
const ACCESS_CODE_KEY = 'personal_blog_access_code';

export const verifyAccessCode = async (inputCode) => {
    try {
        // First check if the code is already verified in this session
        const storedCode = localStorage.getItem(ACCESS_CODE_KEY);
        if (storedCode === inputCode) {
            return { success: true, message: 'Access granted' };
        }

        // Check against the default code
        if (inputCode === DEFAULT_ACCESS_CODE) {
            localStorage.setItem(ACCESS_CODE_KEY, inputCode);
            return { success: true, message: 'Access granted' };
        }

        // Check against stored codes in Firebase (for future use)
        try {
            const accessCodeDoc = await getDoc(doc(fireDb, 'accessCodes', 'personal'));
            if (accessCodeDoc.exists()) {
                const validCodes = accessCodeDoc.data().codes || [];
                if (validCodes.includes(inputCode)) {
                    localStorage.setItem(ACCESS_CODE_KEY, inputCode);
                    return { success: true, message: 'Access granted' };
                }
            }
        } catch (error) {
            console.warn('Could not check Firebase access codes:', error);
        }

        return { success: false, message: 'Invalid access code' };
    } catch (error) {
        console.error('Error verifying access code:', error);
        return { success: false, message: 'Error verifying access code' };
    }
};

export const isAccessCodeVerified = () => {
    return localStorage.getItem(ACCESS_CODE_KEY) !== null;
};

export const clearAccessCode = () => {
    localStorage.removeItem(ACCESS_CODE_KEY);
};

export const getStoredAccessCode = () => {
    return localStorage.getItem(ACCESS_CODE_KEY);
};

// Function to add new access codes (for admin use)
export const addAccessCode = async (newCode) => {
    try {
        const accessCodeDoc = doc(fireDb, 'accessCodes', 'personal');
        const currentDoc = await getDoc(accessCodeDoc);
        
        if (currentDoc.exists()) {
            const currentCodes = currentDoc.data().codes || [];
            if (!currentCodes.includes(newCode)) {
                await setDoc(accessCodeDoc, {
                    codes: [...currentCodes, newCode],
                    updatedAt: new Date()
                }, { merge: true });
                return { success: true, message: 'Access code added successfully' };
            } else {
                return { success: false, message: 'Access code already exists' };
            }
        } else {
            await setDoc(accessCodeDoc, {
                codes: [newCode],
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return { success: true, message: 'Access code added successfully' };
        }
    } catch (error) {
        console.error('Error adding access code:', error);
        return { success: false, message: 'Error adding access code' };
    }
}; 