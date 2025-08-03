import React, { useEffect, useState } from 'react';
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, getDoc, updateDoc } from 'firebase/firestore';
import { fireDb, auth } from '../../firebase/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

function MyState(props) {
    const [mode, setMode] = useState('light'); // Whether dark mode is enabled or not
    const [searchkey, setSearchkey] = useState('');
    const [loading, setloading] = useState(false);
    const [getAllBlog, setGetAllBlog] = useState([]);
    const [user, setUser] = useState(null);

    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = 'rgb(17, 24, 39)';
        } else {
            setMode('light');
            document.body.style.backgroundColor = 'white';
        }
    };

    const getAllBlogs = () => {
        setloading(true);
        try {
            const q = query(
                collection(fireDb, "blogPost"),
                orderBy('time')
            );
            
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                try {
                    let blogArray = [];
                    QuerySnapshot.forEach((doc) => {
                        const data = doc.data();
                        // Validate data before adding to array
                        if (data && typeof data === 'object') {
                            blogArray.push({ ...data, id: doc.id });
                        }
                    });
                    setGetAllBlog(blogArray);
                } catch (error) {
                    console.error('Error processing blog data:', error);
                    toast.error('Error loading blogs');
                } finally {
                    setloading(false);
                }
            }, (error) => {
                console.error('Firebase snapshot error:', error);
                toast.error('Error connecting to database');
                setloading(false);
            });

            // Return cleanup function
            return unsubscribe;
        } catch (error) {
            console.error('Error setting up blog listener:', error);
            toast.error('Error initializing blog system');
            setloading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = getAllBlogs();
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const deleteBlogs = async (id) => {
        try {
            await deleteDoc(doc(fireDb, "blogPost", id));
            toast.success("Blog deleted successfully");
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error("Error deleting blog");
        }
    };

    const getBlogById = async (id) => {
        try {
            const blogDoc = await getDoc(doc(fireDb, "blogPost", id));
            if (blogDoc.exists()) {
                return { ...blogDoc.data(), id: blogDoc.id };
            }
            return null;
        } catch (error) {
            console.error('Error fetching blog by ID:', error);
            toast.error("Error fetching blog");
            return null;
        }
    };

    const updateBlog = async (id, updatedBlog) => {
        try {
            await updateDoc(doc(fireDb, "blogPost", id), updatedBlog);
            toast.success("Blog updated successfully");
        } catch (error) {
            console.error('Error updating blog:', error);
            toast.error("Error updating blog");
        }
    };

    return (
        <MyContext.Provider value={{ 
            mode, 
            toggleMode,
            searchkey,
            setSearchkey,
            loading,
            setloading,
            getAllBlog,
            deleteBlogs,
            getBlogById,
            updateBlog,
            user
        }}>
            {props.children}
        </MyContext.Provider>
    );
}

export default MyState;
