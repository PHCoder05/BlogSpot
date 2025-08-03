import React, { useState, useContext, useEffect } from 'react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import myContext from '../../../context/data/myContext';
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { fireDb, storage } from '../../../firebase/FirebaseConfig';
import DynamicQuillEditor from '../../../components/QuillEditor/DynamicQuill';
import { Helmet } from 'react-helmet';





// Add custom styles for ReactQuill
const quillStyles = `
  /* Dark mode styles */
  .quill-dark .ql-editor {
    background-color: #374151 !important;
    color: white !important;
    min-height: 200px !important;
  }
  .quill-dark .ql-toolbar {
    background-color: #4B5563 !important;
    border-color: #6B7280 !important;
  }
  .quill-dark .ql-container {
    border-color: #6B7280 !important;
  }
  .quill-dark .ql-toolbar button {
    color: white !important;
  }
  .quill-dark .ql-toolbar button:hover {
    color: #10B981 !important;
  }
  .quill-dark .ql-toolbar .ql-active {
    color: #10B981 !important;
  }
  .quill-dark .ql-editor p {
    color: white !important;
  }
  .quill-dark .ql-editor h1,
  .quill-dark .ql-editor h2,
  .quill-dark .ql-editor h3,
  .quill-dark .ql-editor h4,
  .quill-dark .ql-editor h5,
  .quill-dark .ql-editor h6 {
    color: white !important;
  }
  .quill-dark .ql-editor strong {
    color: white !important;
  }
  .quill-dark .ql-editor em {
    color: white !important;
  }
  .quill-dark .ql-editor blockquote {
    color: #E5E7EB !important;
    border-left: 4px solid #10B981 !important;
    padding-left: 1rem !important;
    margin: 1rem 0 !important;
  }
  .quill-dark .ql-editor code {
    color: #F3F4F6 !important;
    background-color: #1F2937 !important;
    padding: 0.25rem 0.5rem !important;
    border-radius: 0.25rem !important;
    font-family: 'Courier New', monospace !important;
  }
  .quill-dark .ql-editor pre {
    background-color: #1F2937 !important;
    color: #F3F4F6 !important;
    padding: 1rem !important;
    border-radius: 0.5rem !important;
    margin: 1rem 0 !important;
    overflow-x: auto !important;
  }
  .quill-dark .ql-editor pre code {
    background-color: transparent !important;
    padding: 0 !important;
  }
  
  /* Light mode styles */
  .quill-light .ql-editor {
    background-color: white !important;
    color: black !important;
    min-height: 200px !important;
  }
  .quill-light .ql-toolbar {
    background-color: #F9FAFB !important;
    border-color: #D1D5DB !important;
  }
  .quill-light .ql-container {
    border-color: #D1D5DB !important;
  }
  .quill-light .ql-editor p {
    color: black !important;
  }
  .quill-light .ql-editor h1,
  .quill-light .ql-editor h2,
  .quill-light .ql-editor h3,
  .quill-light .ql-editor h4,
  .quill-light .ql-editor h5,
  .quill-light .ql-editor h6 {
    color: black !important;
  }
  .quill-light .ql-editor blockquote {
    color: #374151 !important;
    border-left: 4px solid #10B981 !important;
    padding-left: 1rem !important;
    margin: 1rem 0 !important;
    font-style: italic !important;
  }
  .quill-light .ql-editor code {
    color: #DC2626 !important;
    background-color: #F3F4F6 !important;
    padding: 0.25rem 0.5rem !important;
    border-radius: 0.25rem !important;
    font-family: 'Courier New', monospace !important;
  }
  .quill-light .ql-editor pre {
    background-color: #F3F4F6 !important;
    color: #1F2937 !important;
    padding: 1rem !important;
    border-radius: 0.5rem !important;
    margin: 1rem 0 !important;
    overflow-x: auto !important;
  }
  .quill-light .ql-editor pre code {
    background-color: transparent !important;
    padding: 0 !important;
    color: #DC2626 !important;
  }
  
  /* Table styles */
  .ql-editor table {
    border-collapse: collapse !important;
    width: 100% !important;
    margin: 1rem 0 !important;
  }
  .ql-editor table td,
  .ql-editor table th {
    border: 1px solid #D1D5DB !important;
    padding: 0.5rem !important;
    text-align: left !important;
  }
  .quill-dark .ql-editor table td,
  .quill-dark .ql-editor table th {
    border-color: #6B7280 !important;
  }
  .ql-editor table th {
    background-color: #F9FAFB !important;
    font-weight: bold !important;
  }
  .quill-dark .ql-editor table th {
    background-color: #4B5563 !important;
  }
  
  /* Placeholder styles */
  .ql-editor.ql-blank::before {
    color: #9CA3AF !important;
    font-style: italic !important;
  }
  .quill-dark .ql-editor.ql-blank::before {
    color: #9CA3AF !important;
  }
  
  /* Focus styles */
  .ql-editor:focus {
    outline: none !important;
    border-color: #10B981 !important;
  }
  
  /* Code block line numbers */
  .ql-editor pre {
    position: relative !important;
  }
  
  /* Enhanced toolbar spacing */
  .ql-toolbar.ql-snow {
    padding: 0.5rem !important;
  }
  
  /* Better button spacing */
  .ql-toolbar.ql-snow .ql-formats {
    margin-right: 0.75rem !important;
  }
`;

function CreateBlog() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();
    


    const [blogs, setBlogs] = useState({
        title: '',
        content: '',
        category: '',
        author: 'Pankaj Hadole',
        date: '',
        imageUrl: '',
        tags: [],
        wordCount: 0,
        readingTime: 0
    });

    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const quillRef = React.useRef(null);

    // ReactQuill modules configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
        keyboard: {
            bindings: {
                tab: {
                    key: 9,
                    handler: function() {
                        return true;
                    }
                }
            }
        },
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
        }
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'blockquote', 'code-block',
        'list', 'bullet', 'indent',
        'direction', 'align',
        'link', 'image', 'video'
    ];

    // Function to get word count from HTML content
    const getWordCount = (htmlContent) => {
        if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === '<p></p>') return 0;
        const textContent = htmlContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        const words = textContent.split(/\s+/).filter(word => word.length > 0);
        return words.length;
    };

    // Function to get reading time
    const getReadingTime = (htmlContent) => {
        const wordCount = getWordCount(htmlContent);
        return Math.max(1, Math.ceil(wordCount / 200));
    };

    // Handle content change
    const handleContentChange = (content) => {
        setBlogs(prev => ({
            ...prev,
            content: content,
            wordCount: getWordCount(content),
            readingTime: getReadingTime(content)
        }));
    };

    // Test function to add sample content
    const addSampleContent = () => {
        const sampleContent = `
            <h2>Welcome to Your Advanced Blog Editor!</h2>
            <p>This is a sample paragraph to test the enhanced editor. You can now use:</p>
            
            <h3>Text Formatting</h3>
            <ul>
                <li><strong>Bold text</strong> for emphasis</li>
                <li><em>Italic text</em> for subtle emphasis</li>
                <li><u>Underlined text</u> for highlighting</li>
                <li><s>Strikethrough text</s> for corrections</li>
                <li><sub>Subscript</sub> and <sup>Superscript</sup> for formulas</li>
            </ul>
            
            <h3>Code Snippets</h3>
            <p>You can add inline code like <code>console.log('Hello World')</code> or code blocks:</p>
            <pre><code>function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet('World'));</code></pre>
            
            <h3>Blockquotes</h3>
            <blockquote>
                <p>This is a blockquote. Use it to highlight important quotes or call attention to specific content.</p>
            </blockquote>
            
            <h3>Advanced Features</h3>
            <p>You can use various advanced formatting options:</p>
            <ul>
                <li>Different font sizes and families</li>
                <li>Text colors and background colors</li>
                <li>Text alignment (left, center, right, justify)</li>
                <li>Indentation and list formatting</li>
                <li>Links, images, and video embedding</li>
            </ul>
            
            <h3>Colors and Styling</h3>
            <p>You can use <span style="color: #DC2626;">red text</span>, <span style="background-color: #FEF3C7;">highlighted text</span>, and different font sizes.</p>
            
            <p>Start writing your amazing blog post with all these powerful features!</p>
        `;
        setBlogs(prev => ({
            ...prev,
            content: sampleContent,
            wordCount: getWordCount(sampleContent),
            readingTime: getReadingTime(sampleContent)
        }));
    };

    const handleTagInputChange = (event) => {
        setTagInput(event.target.value);
    };

    const handleAddTag = (event) => {
        event.preventDefault();
        const trimmedTag = tagInput.trim();
        
        if (trimmedTag === '') {
            toast.error("Tag cannot be empty");
            return;
        }
        
        if (tags.includes(trimmedTag)) {
            toast.error("Tag already added");
            return;
        }
        
        if (tags.length >= 15) {
            toast.error("Maximum 15 tags allowed");
            return;
        }
        
        setTags([...tags, trimmedTag]);
        setTagInput('');
    };

    const handleRemoveTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Image size should be less than 10MB");
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file");
                return;
            }
            
            setImage(file);
        }
    };

    const clearDraft = () => {
        setBlogs({
            title: '',
            content: '',
            category: '',
            author: 'Pankaj Hadole',
            date: '',
            imageUrl: '',
            tags: [],
            wordCount: 0,
            readingTime: 0
        });
        setTags([]);
        setImage(null);
        setImageUrl('');
        toast.success('Draft cleared!');
    };

    const addPost = async () => {
        if (blogs.title.trim() === "") {
            return toast.error("Title is required");
        }
        if (blogs.category === "") {
            return toast.error("Category is required");
        }
        if (blogs.content.trim() === "" || blogs.content === "<p><br></p>") {
            return toast.error("Content is required");
        }
        if (!image && !imageUrl.trim()) {
            return toast.error("Thumbnail is required");
        }
        
        setLoading(true);
        try {
            await uploadImage();
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error(error.message || "Error creating post");
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async () => {
        let thumbnailUrl = "";
        
        if (image) {
            const imageRef = ref(storage, `blogimage/${Date.now()}_${image.name}`);
            const snapshot = await uploadBytes(imageRef, image);
            thumbnailUrl = await getDownloadURL(snapshot.ref);
        } else if (imageUrl.trim()) {
            thumbnailUrl = imageUrl.trim();
        }
        
        const productRef = collection(fireDb, "blogPost");
        await addDoc(productRef, {
            blogs: { 
                ...blogs, 
                tags: tags,
                title: blogs.title.trim(),
                content: blogs.content.trim(),
                readingTime: `${blogs.readingTime} min read`
            },
            thumbnail: thumbnailUrl,
            time: Timestamp.now(),
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
        });
        
        navigate('/dashboard');
        toast.success('Blog post created successfully!');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);



    function createMarkup(c) {
        return { __html: c };
    }

    return (
        <>
            <Helmet>
                <title>Create New Blog Post - PHcoder05 Blog</title>
                <meta name="description" content="Create and publish new blog posts with advanced formatting options" />
                <style>{quillStyles}</style>
            </Helmet>

            <div className={`min-h-screen ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className='container mx-auto max-w-7xl py-6 px-4'>
                    
                    {/* Header */}
                    <Card className={`mb-6 ${
                        mode === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <CardBody className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex gap-3 items-center">
                                    <Link to={'/dashboard'}>
                                        <BsFillArrowLeftCircleFill 
                                            size={25} 
                                            className={`hover:scale-110 transition-transform ${
                                                mode === 'dark' ? 'text-white' : 'text-gray-800'
                                            }`}
                                        />
                                    </Link>
                                    <Typography
                                        variant="h4"
                                        className={`font-bold ${
                                            mode === 'dark' ? 'text-white' : 'text-gray-800'
                                        }`}
                                    >
                                        Create New Blog Post
                                    </Typography>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Title Input */}
                            <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                                <CardBody className="p-6">
                                    <Typography
                                        variant="h6"
                                        className="mb-3 font-semibold flex items-center gap-2"
                                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                                    >
                                        Blog Title
                                    </Typography>
                                    <input
                                        className={`w-full rounded-lg p-4 border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg ${
                                            mode === 'dark' 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="Enter your compelling blog title..."
                                        name="title"
                                        value={blogs.title}
                                        onChange={(e) => setBlogs({ ...blogs, title: e.target.value })}
                                        maxLength={100}
                                    />
                                </CardBody>
                            </Card>

                            {/* Thumbnail Upload Section */}
                            <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                                <CardBody className="p-6">
                                    <Typography
                                        variant="h6"
                                        className="mb-3 font-semibold flex items-center gap-2"
                                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                                    >
                                        Blog Thumbnail
                                    </Typography>
                                    
                                    {image && (
                                        <div className="mb-4 relative">
                                            <img 
                                                className="w-full max-h-64 object-cover rounded-lg border-2 border-gray-300"
                                                src={URL.createObjectURL(image)}
                                                alt="thumbnail preview"
                                            />
                                            <button
                                                onClick={() => setImage(null)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="thumbnail-upload"
                                            onChange={handleThumbnailChange}
                                            accept="image/*"
                                        />
                                        <label 
                                            htmlFor="thumbnail-upload" 
                                            className="cursor-pointer block"
                                        >
                                            <div className="text-gray-600 mb-4">
                                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                            <p className="text-lg font-medium text-gray-700 mb-2">
                                                {image ? 'Click to change image' : 'Click to upload thumbnail'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </label>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Content Editor */}
                            <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                                <CardBody className="p-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <Typography
                                            variant="h6"
                                            className="font-semibold flex items-center gap-2"
                                            style={{ color: mode === 'dark' ? 'white' : 'black' }}
                                        >
                                            Blog Content
                                        </Typography>
                                        <button
                                            onClick={addSampleContent}
                                            className="px-3 py-1 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                                        >
                                            Add Sample Content
                                        </button>
                                    </div>
                                    
                                    <div className={`rounded-lg border-2 ${
                                        mode === 'dark' ? 'border-gray-600' : 'border-gray-300'
                                    }`}>
                                        <DynamicQuillEditor
                                            ref={quillRef}
                                            value={blogs.content}
                                            onChange={handleContentChange}
                                            modules={modules}
                                            formats={formats}
                                            theme="snow"
                                            className={`${mode === 'dark' ? 'quill-dark' : 'quill-light'}`}
                                            placeholder="Start writing your amazing blog post..."
                                        />
                                    </div>
                                    
                                    {/* Word count and reading time */}
                                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                                        <span>
                                            Words: {blogs.wordCount}
                                        </span>
                                        <span>
                                            Reading time: ~{blogs.readingTime} min
                                        </span>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Submit Button */}
                            <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                                <CardBody className="p-6">
                                    <Button 
                                        className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                                        onClick={addPost}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Publishing Post...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                Publish Blog Post
                                            </div>
                                        )}
                                    </Button>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            
                            {/* Category Selection */}
                            <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                                <CardBody className="p-6">
                                    <Typography
                                        variant="h6"
                                        className="mb-3 font-semibold flex items-center gap-2"
                                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                                    >
                                        Category
                                    </Typography>
                                    <select
                                        className={`w-full rounded-lg p-3 border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                            mode === 'dark' 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        name="category"
                                        value={blogs.category}
                                        onChange={(e) => setBlogs({ ...blogs, category: e.target.value })}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Programming">Programming</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Mobile Development">Mobile Development</option>
                                        <option value="AI/ML">AI/ML</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="Cybersecurity">Cybersecurity</option>
                                        <option value="Tutorials">Tutorials</option>
                                        <option value="Reviews">Reviews</option>
                                        <option value="News">News</option>
                                        <option value="Opinion">Opinion</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </CardBody>
                            </Card>

                            {/* Tags Section */}
                            <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                                <CardBody className="p-6">
                                    <Typography
                                        variant="h6"
                                        className="mb-3 font-semibold flex items-center gap-2"
                                        style={{ color: mode === 'dark' ? 'white' : 'black' }}
                                    >
                                        Tags ({tags.length}/15)
                                    </Typography>
                                    
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={handleTagInputChange}
                                            placeholder="Add tags..."
                                            className={`flex-1 rounded-lg p-3 border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                                mode === 'dark' 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddTag(e);
                                                }
                                            }}
                                            disabled={tags.length >= 15}
                                        />
                                        <Button 
                                            onClick={handleAddTag} 
                                            size="sm"
                                            disabled={tags.length >= 15 || !tagInput.trim()}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    {/* Tags Display */}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag, index) => (
                                                <span 
                                                    key={index} 
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white`}
                                                >
                                                    #{tag}
                                                    <button 
                                                        onClick={() => handleRemoveTag(index)} 
                                                        className="ml-1 hover:text-red-200 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Clear Draft */}
                            <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                                <CardBody className="p-6">
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        onClick={clearDraft}
                                        className="w-full"
                                    >
                                        Clear Draft
                                    </Button>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateBlog;
