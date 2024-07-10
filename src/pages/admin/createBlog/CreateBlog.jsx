import React, { useState, useContext, useEffect } from 'react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import myContext from '../../../context/data/myContext';
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { fireDb, storage } from '../../../firebase/FirebaseConfig';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import 'quill-emoji/dist/quill-emoji.js';

function CreateBlog() {
    const context = useContext(myContext);
    const { mode } = context;
    const [blogs, setBlogs] = useState({
        title: "",
        category: "",
        content: "",
        time: Timestamp.now(),
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categories = [
        "Technology", "Farming", "Programming", "Sports", 
        "News", "Trending", "Other..", "Personal"
    ];

    const addPost = async () => {
        if (blogs.title === "" || blogs.category === "" || blogs.content === "" || !thumbnail) {
            return toast.error("All fields are required");
        }
        setLoading(true);
        try {
            await uploadImage();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async () => {
        if (!thumbnail) return;
        const imageRef = ref(storage, `blogimage/${thumbnail.name}`);
        const snapshot = await uploadBytes(imageRef, thumbnail);
        const url = await getDownloadURL(snapshot.ref);
        const productRef = collection(fireDb, "blogPost");
        await addDoc(productRef, {
            blogs: { ...blogs, tags: tags },
            thumbnail: url,
            time: Timestamp.now(),
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
        });
        navigate('/dashboard');
        toast.success('Post Added Successfully');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleTagInputChange = (event) => {
        setTagInput(event.target.value);
    };

    const handleAddTag = (event) => {
        event.preventDefault();
        if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        } else {
            toast.error("Tag already added or empty tag");
        }
    };

    const handleRemoveTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
    };

    function createMarkup(c) {
        return { __html: c };
    }

    return (
        <div className='container mx-auto max-w-5xl py-6'>
            <div className="p-5" style={{
                background: mode === 'dark' ? '#353b48' : 'rgb(226, 232, 240)',
                borderBottom: mode === 'dark' ? '4px solid rgb(226, 232, 240)' : '4px solid rgb(30, 41, 59)'
            }}>
                <div className="mb-2 flex justify-between">
                    <div className="flex gap-2 items-center">
                        <Link to={'/dashboard'}>
                            <BsFillArrowLeftCircleFill size={25} />
                        </Link>
                        <Typography
                            variant="h4"
                            style={{ color: mode === 'dark' ? 'white' : 'black' }}
                        >
                            Create Blog
                        </Typography>
                    </div>
                </div>

                <div className="mb-3">
                    {thumbnail && <img className="w-full rounded-md mb-3"
                        src={URL.createObjectURL(thumbnail)}
                        alt="thumbnail"
                    />}
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-semibold"
                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    >
                        Upload Thumbnail
                    </Typography>
                    <input
                        type="file"
                        className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
                        style={{ background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)' }}
                        onChange={(e) => setThumbnail(e.target.files[0])}
                        accept="image/*" // Added image type validation
                    />
                </div>

                <div className="mb-3">
                    <input
                        className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                        outline-none ${mode === 'dark' ? 'placeholder-black' : 'placeholder-black'}`}
                        placeholder="Enter Your Title"
                        style={{ background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)' }}
                        name="title"
                        value={blogs.title}
                        onChange={(e) => setBlogs({ ...blogs, title: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <select
                        className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                        outline-none ${mode === 'dark' ? 'placeholder-black' : 'placeholder-black'}`}
                        style={{ background: mode === 'dark' ? '#dcdde1' : 'rgb(226, 232, 240)' }}
                        name="category"
                        value={blogs.category}
                        onChange={(e) => setBlogs({ ...blogs, category: e.target.value })}
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        placeholder="Add tags (press Enter to add)"
                        className={`border ${mode === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300'} p-2 rounded-md`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddTag(e);
                            }
                        }}
                    />
                    <Button onClick={handleAddTag} className="ml-2">
                        Add Tag
                    </Button>
                </div>

                <div className="mb-3">
                    {tags.map((tag, index) => (
                        <span key={index} className={`inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {tag}
                            <span onClick={() => handleRemoveTag(index)} className="ml-1 cursor-pointer">
                                &#x2715;
                            </span>
                        </span>
                    ))}
                </div>

                <ReactQuill
                    value={blogs.content}
                    onChange={(content, delta, source, editor) => {
                        setBlogs({ ...blogs, content });
                        setText(editor.getText());
                    }}
                    modules={{
                        toolbar: [
                            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                            [{size: []}],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}, 
                             {'indent': '-1'}, {'indent': '+1'}],
                            ['link', 'image', 'video', 'code-block'],
                            [{ 'emoji': true }],
                            ['clean'],
                            ['color', 'background'],
                            ['table']
                        ],
                        clipboard: {
                            matchVisual: false,
                        },
                    }}
                    formats={[
                        'header', 'font', 'size',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image', 'video', 'code-block',
                        'emoji',
                        'color', 'background',
                        'table'
                    ]}
                    theme="snow"
                />

                <Button 
                    className="w-full mt-5"
                    onClick={addPost}
                    disabled={loading} // Disabled button during loading
                    style={{
                        background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                        color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                    }}
                >
                    {loading ? 'Posting...' : 'Send'}
                </Button>

                <div className="">
                    <h1 className="text-center mb-3 text-2xl">Preview</h1>
                    <div className="content">
                        <div
                            className={`
                            [&> h1]:text-[32px] [&>h1]:font-bold  [&>h1]:mb-2.5
                            ${mode === 'dark' ? '[&>h1]:text-[#ff4d4d]' : '[&>h1]:text-black'}

                            [&>h2]:text-[24px] [&>h2]:font-bold [&>h2]:mb-2.5
                            ${mode === 'dark' ? '[&>h2]:text-white' : '[&>h2]:text-black'}

                            [&>h3]:text-[18.72px] [&>h3]:font-bold [&>h3]:mb-2.5
                            ${mode === 'dark' ? '[&>h3]:text-white' : '[&>h3]:text-black'}

                            [&>h4]:text-[16px] [&>h4]:font-bold [&>h4]:mb-2.5
                            ${mode === 'dark' ? '[&>h4]:text-white' : '[&>h4]:text-black'}

                            [&>h5]:text-[13.28px] [&>h5]:font-bold [&>h5]:mb-2.5
                            ${mode === 'dark' ? '[&>h5]:text-white' : '[&>h5]:text-black'}

                            [&>h6]:text-[10px] [&>h6]:font-bold [&>h6]:mb-2.5
                            ${mode === 'dark' ? '[&>h6]:text-white' : '[&>h6]:text-black'}

                            [&>p]:text-[16px] [&>p]:mb-1.5
                            ${mode === 'dark' ? '[&>p]:text-[#7efff5]' : '[&>p]:text-black'}

                            [&>ul]:list-disc [&>ul]:mb-2
                            ${mode === 'dark' ? '[&>ul]:text-white' : '[&>ul]:text-black'}

                            [&>ol]:list-decimal [&>li]:mb-10
                            ${mode === 'dark' ? '[&>ol]:text-white' : '[&>ol]:text-black'}

                            [&>li]:list-decimal [&>ol]:mb-2
                            ${mode === 'dark' ? '[&>ol]:text-white' : '[&>ol]:text-black'}

                            [&>img]:rounded-lg
                            `}
                            dangerouslySetInnerHTML={createMarkup(blogs.content)}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBlog;
