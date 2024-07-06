import React, { useEffect, useState } from 'react';
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, getDoc, updateDoc } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';

function MyState(props) {
    const [mode, setMode] = useState('light'); // Whether dark mode is enabled or not
    const [searchkey, setSearchkey] = useState('');
    const [loading, setloading] = useState(false);
    const [getAllBlog, setGetAllBlog] = useState([]);

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
            const data = onSnapshot(q, (QuerySnapshot) => {
                let blogArray = [];
                QuerySnapshot.forEach((doc) => {
                    blogArray.push({ ...doc.data(), id: doc.id });
                });
                setGetAllBlog(blogArray);
                setloading(false);
            });
            return () => data();
        } catch (error) {
            console.log(error);
            setloading(false);
        }
    };

    useEffect(() => {
        getAllBlogs();
    }, []);

    const deleteBlogs = async (id) => {
        try {
            await deleteDoc(doc(fireDb, "blogPost", id));
            getAllBlogs();
            toast.success("Blog deleted successfully");
        } catch (error) {
            console.log(error);
        }
    };

    const getBlogById = async (id) => {
        try {
            const blogDoc = await getDoc(doc(fireDb, "blogPost", id));
            return { ...blogDoc.data(), id: blogDoc.id };
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const updateBlog = async (id, updatedBlog) => {
        try {
            await updateDoc(doc(fireDb, "blogPost", id), updatedBlog);
            getAllBlogs();
            toast.success("Blog updated successfully");
        } catch (error) {
            console.log(error);
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
            updateBlog
        }}>
            {props.children}
        </MyContext.Provider>
    );
}

export default MyState;
