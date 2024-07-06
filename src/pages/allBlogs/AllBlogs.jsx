import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import { useNavigate } from 'react-router';
import DOMPurify from 'dompurify';

function AllBlogs() {
    const context = useContext(myContext);
    const { mode, getAllBlog } = context;
    const [blogs, setBlogs] = useState(getAllBlog);
    const navigate = useNavigate();

    // Helper function to truncate text and remove HTML tags
    const truncateText = (text, limit, id) => {
        const sanitizedText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
        const cleanedText = sanitizedText.replace(/&nbsp;/g, ' ');

        if (cleanedText.length <= limit) return cleanedText;

        return (
            <>
                {cleanedText.substring(0, limit)}
                <span
                    style={{
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/bloginfo/${id}`)}
                >
                    {' read more...'}
                </span>
            </>
        );
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('/api/blogs'); // Adjust the API endpoint as needed
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-10 mx-auto max-w-7xl">
                    {/* Top Heading */}
                    <div className="mb-5">
                        <h1 className='text-center text-2xl font-bold'
                            style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                            All Blogs
                        </h1>
                    </div>
                    {/* Main Content */}
                    <div className="flex flex-wrap justify-center -m-4 mb-5">
                        {/* Blog Cards */}
                        {blogs.length > 0 ? (
                            blogs.map((item) => {
                                const { thumbnail, date, id, blogs } = item;
                                return (
                                    <div key={id} className="p-4 md:w-1/2 lg:w-1/3">
                                        <div
                                            style={{
                                                background: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white',
                                                borderBottom: mode === 'dark' ? '4px solid rgb(226, 232, 240)' : '4px solid rgb(30, 41, 59)'
                                            }}
                                            className={`h-full shadow-lg hover:-translate-y-1 cursor-pointer hover:shadow-gray-400 ${mode === 'dark' ? 'shadow-gray-700' : 'shadow-xl'} rounded-xl overflow-hidden transition-transform transform duration-300`}
                                        >
                                            {/* Blog Thumbnail */}
                                            <img
                                                onClick={() => navigate(`/bloginfo/${id}`)}
                                                className="w-full h-64 object-cover object-top"
                                                src={thumbnail}
                                                alt={blogs.title || "Blog Thumbnail"}
                                                role="button"
                                            />

                                            {/* Top Items */}
                                            <div className="p-6" onClick={() => navigate(`/bloginfo/${id}`)}>
                                                {/* Blog Date */}
                                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)' }}>
                                                    {date}
                                                </h2>

                                                {/* Blog Title */}
                                                <h1 className="title-font text-lg font-bold text-gray-900 mb-3" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)' }}>
                                                    {blogs.title}
                                                </h1>

                                                {/* Blog Description */}
                                                <p className="leading-relaxed mb-3" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)' }}>
                                                    {truncateText(blogs.content, 150, id)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <h1 className="text-center w-full">Not Found</h1>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default AllBlogs;
