import React, { useState, useContext, useEffect } from 'react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import myContext from "../../../context/data/myContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireDb, storage } from "../../../firebase/FirebaseConfig";
import DynamicQuillEditor from '../../../components/QuillEditor/DynamicQuill';
import SEOComponent from '../../../components/SEOComponent';

function EditBlog() {
  const { id } = useParams();
  const context = useContext(myContext);
  const { mode } = context;
  const navigate = useNavigate();
  


  const [blogs, setBlogs] = useState({
    title: "",
    category: "",
    categories: [], // For multiple category selection
    content: "",
    time: Timestamp.now(),
  });

  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailLink, setThumbnailLink] = useState("");
  const [useThumbnailLink, setUseThumbnailLink] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [seoData, setSeoData] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    canonicalUrl: ''
  });
  const [publishSettings, setPublishSettings] = useState({
    status: 'draft', // 'draft', 'published', 'scheduled'
    publishDate: '',
    featured: false,
    allowComments: true,
    allowSharing: true
  });
  const [advancedSettings, setAdvancedSettings] = useState({
    readingLevel: 'general', // 'general', 'intermediate', 'advanced'
    estimatedReadTime: 0,
    wordCount: 0,
    characterCount: 0,
    paragraphCount: 0
  });
  const quillRef = React.useRef(null);

  const categories = [
    "Technology", "Farming", "Programming", "Sports", 
    "News", "Trending", "Other..", "Personal"
  ];

  const technologySubcategories = [
    "DevOps", "Development", "Cloud"
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setFetching(true);
        const docRef = doc(fireDb, "blogPost", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const blogData = docSnap.data();
          
          // Handle the nested structure properly
          const blogContent = blogData.blogs || blogData;
          
          setBlogs({
            title: blogContent.title || "",
            category: blogContent.category || "",
            categories: blogContent.categories || [],
            content: blogContent.content || "",
            time: Timestamp.now(),
          });
          
          // Handle thumbnail from both possible locations
          const thumbnailData = blogData.thumbnail || blogContent.thumbnail || null;
          setCurrentThumbnail(thumbnailData);
          
          // Check if the current thumbnail is a URL (starts with http)
          if (thumbnailData && thumbnailData.startsWith('http')) {
            setThumbnailLink(thumbnailData);
            setUseThumbnailLink(true);
          }
          setTags(blogContent.tags || []);
        } else {
          toast.error("Blog not found");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Error fetching blog");
        navigate("/dashboard");
      } finally {
        setFetching(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);



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
    
    if (tags.length >= 10) {
      toast.error("Maximum 10 tags allowed");
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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Set the file immediately for preview
      setThumbnail(file);
      // Clear other thumbnail sources when uploading new file
      setCurrentThumbnail(null);
      setThumbnailLink("");
      setUseThumbnailLink(false);
      
      toast.success("Image uploaded successfully!");
    }
  };

  const clearCurrentThumbnail = () => {
    setCurrentThumbnail(null);
    setThumbnailLink("");
    setUseThumbnailLink(false);
    setThumbnail(null);
  };

  const validateImageUrl = (url) => {
    if (!url.trim()) {
      return false;
    }
    
    try {
      new URL(url.trim());
    } catch (error) {
      toast.error("Please enter a valid URL");
      return false;
    }
    
    // Validate that it's an image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const urlLower = url.trim().toLowerCase();
    const hasImageExtension = imageExtensions.some(ext => urlLower.includes(ext));
    
    if (!hasImageExtension && !urlLower.includes('data:image/')) {
      toast("⚠️ URL might not be an image. Please ensure it's a valid image URL.", {
        icon: '⚠️',
        style: {
          border: '1px solid #f59e0b',
          padding: '16px',
          color: '#92400e',
          backgroundColor: '#fef3c7',
        },
      });
    }
    
    return true;
  };

  const updatePost = async () => {
    if (blogs.title.trim() === "") {
      return toast.error("Title is required");
    }
    if (blogs.category === "") {
      return toast.error("Category is required");
    }
    if (blogs.category === "Technology" && blogs.categories.length === 0) {
      return toast.error("Please select at least one technology subcategory");
    }
    if (blogs.content.trim() === "") {
      return toast.error("Content is required");
    }
    if (!thumbnail && !currentThumbnail && !thumbnailLink.trim()) {
      return toast.error("Thumbnail is required - either upload an image, provide a link, or keep existing thumbnail");
    }
    
    // Validate thumbnail link if provided
    if (thumbnailLink.trim() && !validateImageUrl(thumbnailLink)) {
      return;
    }

    setLoading(true);
    try {
      if (thumbnail) {
        await uploadImage();
      } else if (thumbnailLink.trim()) {
        await updateBlog(thumbnailLink.trim());
      } else {
        await updateBlog();
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Error updating post");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    const imageRef = ref(storage, `blogimage/${Date.now()}_${thumbnail.name}`);
    try {
      const snapshot = await uploadBytes(imageRef, thumbnail);
      const url = await getDownloadURL(snapshot.ref);
      await updateBlog(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    }
  };

  const updateBlog = async (imageUrl = currentThumbnail) => {
    const blogRef = doc(fireDb, "blogPost", id);
    try {
      await updateDoc(blogRef, {
        blogs: {
          ...blogs,
          title: blogs.title.trim(),
          content: blogs.content.trim(),
          tags: tags,
          categories: blogs.categories
        },
        thumbnail: imageUrl,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      });
      toast.success("Blog post updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Error updating post");
    }
  };

  // SEO and Advanced Functions
  const generateSeoData = () => {
    if (!blogs.title.trim()) {
      toast.error("Please enter a blog title first");
      return;
    }
    
    const title = blogs.title.trim();
    const content = blogs.content.replace(/<[^>]*>/g, '').substring(0, 160);
    
    setSeoData({
      metaTitle: title.length > 60 ? title.substring(0, 60) + '...' : title,
      metaDescription: content.length > 160 ? content.substring(0, 160) + '...' : content,
      keywords: tags.join(', '),
      canonicalUrl: `https://blog-phcoder05.vercel.app/blog/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    });
    
    toast.success("SEO data generated successfully!");
  };

  const analyzeContent = () => {
    const content = blogs.content.replace(/<[^>]*>/g, '');
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const characters = content.length;
    const paragraphs = (blogs.content.match(/<p[^>]*>/g) || []).length;
    const readTime = Math.max(1, Math.ceil(words.length / 200));
    
    setAdvancedSettings({
      ...advancedSettings,
      wordCount: words.length,
      characterCount: characters,
      paragraphCount: paragraphs,
      estimatedReadTime: readTime
    });
    
    toast.success("Content analysis completed!");
  };

  const autoGenerateTags = () => {
    if (!blogs.content.trim()) {
      toast.error("Please add some content first");
      return;
    }
    
    const content = blogs.content.replace(/<[^>]*>/g, '').toLowerCase();
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = content.split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 10);
    
    const uniqueWords = [...new Set(words)];
    const newTags = uniqueWords.slice(0, 5);
    
    setTags([...tags, ...newTags.filter(tag => !tags.includes(tag))]);
    toast.success("Auto-generated tags added!");
  };

  const schedulePost = () => {
    if (!publishSettings.publishDate) {
      toast.error("Please select a publish date");
      return;
    }
    
    setPublishSettings({
      ...publishSettings,
      status: 'scheduled'
    });
    
    toast.success("Post scheduled successfully!");
  };

  const toggleFeatured = () => {
    setPublishSettings({
      ...publishSettings,
      featured: !publishSettings.featured
    });
  };

  function createMarkup(c) {
    return { __html: c };
  }

  if (fetching) {
    return (
      <div className="container mx-auto max-w-5xl py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOComponent 
        type="admin"
        currentUrl={window.location.href}
        pageType="edit"
      />
      <div className="container mx-auto max-w-5xl py-6">
      <div className="p-5 rounded-lg shadow-lg" style={{
        background: mode === "dark" ? "#353b48" : "rgb(226, 232, 240)",
        borderBottom: mode === "dark" ? "4px solid rgb(226, 232, 240)" : "4px solid rgb(30, 41, 59)"
      }}>
        <div className="mb-6 flex justify-between">
          <div className="flex gap-2 items-center">
            <Link to={"/dashboard"}>
              <BsFillArrowLeftCircleFill size={25} style={{ color: mode === "dark" ? "white" : "black" }} />
            </Link>
            <Typography 
              variant="h4" 
              style={{ color: mode === "dark" ? "white" : "black" }}
            >
              Edit Blog Post
            </Typography>
          </div>
        </div>

        {/* All Options Overview */}
        <div className="mb-6 p-4 rounded-lg border-2 border-dashed border-gray-300" style={{
          background: mode === "dark" ? "#2d3748" : "#f7fafc"
        }}>
          <Typography
            variant="h6"
            className="mb-3 font-semibold flex items-center gap-2"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            📋 All Available Options
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${blogs.title ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span style={{ color: mode === "dark" ? "white" : "black" }}>Blog Title</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${(currentThumbnail || thumbnail || thumbnailLink) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span style={{ color: mode === "dark" ? "white" : "black" }}>Thumbnail (File/URL)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${blogs.category ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span style={{ color: mode === "dark" ? "white" : "black" }}>Category</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${tags.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span style={{ color: mode === "dark" ? "white" : "black" }}>Tags ({tags.length}/10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${blogs.content && blogs.content !== '<p><br></p>' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span style={{ color: mode === "dark" ? "white" : "black" }}>Content ({blogs.content ? blogs.content.split(' ').length : 0} words)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${showPreview ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span style={{ color: mode === "dark" ? "white" : "black" }}>Preview Mode</span>
            </div>
          </div>
        </div>

        {/* Thumbnail Section */}
        <div className="mb-6">
          <Typography
            variant="h6"
            className="mb-3 font-semibold"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            Blog Thumbnail
          </Typography>
          
          {/* Current Thumbnail Display */}
          {currentThumbnail && (
            <div className="mb-3 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: mode === "dark" ? "white" : "black" }}>
                  Current Thumbnail
                </span>
                <button
                  onClick={clearCurrentThumbnail}
                  className="text-red-500 hover:text-red-700 text-sm"
                  title="Remove current thumbnail"
                >
                  ×
                </button>
              </div>
              <img 
                className="w-full max-h-64 object-cover rounded-lg border-2 border-gray-300"
                src={currentThumbnail} 
                alt="current thumbnail" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  toast.error("Failed to load current thumbnail");
                }}
              />
            </div>
          )}
          
          {/* Thumbnail Option Toggle */}
          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="thumbnailOption"
                  checked={!useThumbnailLink}
                  onChange={() => {
                    setUseThumbnailLink(false);
                    setThumbnailLink("");
                    // Keep current thumbnail if switching back to upload mode
                  }}
                  className="mr-2"
                />
                <span style={{ color: mode === "dark" ? "white" : "black" }}>Upload Image</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="thumbnailOption"
                  checked={useThumbnailLink}
                  onChange={() => {
                    setUseThumbnailLink(true);
                    setThumbnail(null);
                    // Set thumbnail link to current thumbnail if it's a URL
                    if (currentThumbnail && currentThumbnail.startsWith('http')) {
                      setThumbnailLink(currentThumbnail);
                    }
                  }}
                  className="mr-2"
                />
                <span style={{ color: mode === "dark" ? "white" : "black" }}>Use Image Link</span>
              </label>
            </div>
          </div>
          
          {/* Image Upload Option */}
          {!useThumbnailLink && (
            <>
              {thumbnail && (
                <div className="mb-3 relative">
                  <img 
                    className="w-full max-h-64 object-cover rounded-lg border-2 border-gray-300"
                    src={URL.createObjectURL(thumbnail)}
                    alt="thumbnail preview"
                    onError={(e) => {
                      console.error("Error loading uploaded thumbnail:", e);
                      toast.error("Failed to load uploaded image");
                    }}
                  />
                  <button
                    onClick={() => {
                      setThumbnail(null);
                      toast.info("Uploaded image removed");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
                  <div className="text-gray-600 mb-2">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    {thumbnail ? 'Click to change image' : 'Click to upload new thumbnail'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </label>
              </div>
            </>
          )}
          
          {/* Image Link Option */}
          {useThumbnailLink && (
            <div className="space-y-4">
              <input
                className={`w-full rounded-lg p-3 border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  mode === "dark" 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                value={thumbnailLink}
                onChange={(e) => {
                  setThumbnailLink(e.target.value);
                  // Clear uploaded file and current thumbnail when URL is being used
                  if (e.target.value.trim()) {
                    setThumbnail(null);
                    setCurrentThumbnail(null);
                  }
                }}
                onBlur={() => {
                  if (thumbnailLink.trim()) {
                    validateImageUrl(thumbnailLink);
                  }
                }}
              />
              {thumbnailLink && (
                <div className="relative">
                  <img 
                    className="w-full max-h-64 object-cover rounded-lg border-2 border-gray-300"
                    src={thumbnailLink}
                    alt="thumbnail preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      toast.error("Invalid image URL");
                    }}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Thumbnail Preview Section */}
          <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg" style={{
            background: mode === "dark" ? "#2d3748" : "#f7fafc"
          }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: mode === "dark" ? "white" : "black" }}>
                Thumbnail Preview
              </span>
              <div className={`w-2 h-2 rounded-full ${(currentThumbnail || thumbnail || thumbnailLink) ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            </div>
            
            {(currentThumbnail || thumbnail || (thumbnailLink && thumbnailLink.trim())) ? (
              <div className="relative">
                <img 
                  className="w-full max-h-48 object-cover rounded-lg border-2 border-gray-300"
                  src={
                    thumbnail 
                      ? URL.createObjectURL(thumbnail) 
                      : thumbnailLink && thumbnailLink.trim()
                        ? thumbnailLink.trim()
                        : currentThumbnail
                  }
                  alt="thumbnail preview"
                  onError={(e) => {
                    console.log("Thumbnail preview error:", e.target.src);
                    e.target.style.display = 'none';
                    
                    // Show appropriate error message based on source type
                    if (thumbnail) {
                      toast.error("Failed to load uploaded image");
                    } else if (thumbnailLink && thumbnailLink.trim()) {
                      toast.error("Failed to load image from URL - please check the URL");
                    } else if (currentThumbnail) {
                      toast.error("Failed to load existing thumbnail");
                    } else {
                      toast.error("Failed to load thumbnail preview");
                    }
                  }}
                  onLoad={(e) => {
                    // Successfully loaded, ensure it's visible
                    e.target.style.display = 'block';
                  }}
                />
                <div className="mt-2 text-xs text-center" style={{ color: mode === "dark" ? "white" : "black" }}>
                  {thumbnail ? "Uploaded Image Preview" : 
                   thumbnailLink ? "URL Image Preview" : 
                   "Current Thumbnail"}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm text-gray-500 mt-2">No thumbnail selected</p>
                <p className="text-xs text-gray-400 mt-1">Upload an image or provide a link above</p>
              </div>
            )}
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <Typography
            variant="h6"
            className="mb-3 font-semibold"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            Blog Title
          </Typography>
          <input
            type="text"
            className={`w-full rounded-lg p-3 border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === "dark" 
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            placeholder="Enter your blog title..."
            value={blogs.title}
            onChange={(e) => setBlogs({ ...blogs, title: e.target.value })}
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            {blogs.title.length}/100 characters
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <Typography
            variant="h6"
            className="mb-3 font-semibold"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            Category
          </Typography>
          <select
            className={`w-full rounded-lg p-3 border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              mode === "dark" 
                ? "bg-gray-700 border-gray-600 text-white" 
                : "bg-white border-gray-300 text-gray-900"
            }`}
            value={blogs.category}
            onChange={(e) => setBlogs({ ...blogs, category: e.target.value })}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Technology Subcategories */}
        {blogs.category === "Technology" && (
          <div className="mb-6">
            <Typography
              variant="h6"
              className="mb-3 font-semibold"
              style={{ color: mode === "dark" ? "white" : "black" }}
            >
              Technology Subcategories
            </Typography>
            <div className="space-y-2">
              {technologySubcategories.map((subcategory) => (
                <label key={subcategory} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={blogs.categories.includes(subcategory)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBlogs({
                          ...blogs,
                          categories: [...blogs.categories, subcategory]
                        });
                      } else {
                        setBlogs({
                          ...blogs,
                          categories: blogs.categories.filter(cat => cat !== subcategory)
                        });
                      }
                    }}
                  />
                  <span style={{ color: mode === "dark" ? "white" : "black" }}>
                    {subcategory}
                  </span>
                </label>
              ))}
            </div>
            {blogs.categories.length > 0 && (
              <div className="mt-3">
                <Typography
                  variant="small"
                  className="font-semibold"
                  style={{ color: mode === "dark" ? "white" : "black" }}
                >
                  Selected: {blogs.categories.join(', ')}
                </Typography>
              </div>
            )}
          </div>
        )}

        {/* Tags Section */}
        <div className="mb-6">
          <Typography
            variant="h6"
            className="mb-3 font-semibold"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            Tags ({tags.length}/10)
          </Typography>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              placeholder="Add tags (press Enter to add)"
              className={`flex-1 rounded-lg p-3 border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                mode === "dark" 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(e);
                }
              }}
              disabled={tags.length >= 10}
            />
            <Button 
              onClick={handleAddTag} 
              className="px-4 py-3"
              disabled={tags.length >= 10 || !tagInput.trim()}
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
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    mode === "dark" 
                      ? "bg-gray-600 text-white" 
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  #{tag}
                  <button 
                    onClick={() => handleRemoveTag(index)} 
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

                 {/* Advanced Tools */}
         <div className="mb-6 p-4 rounded-lg border-2 border-dashed border-gray-300" style={{
           background: mode === "dark" ? "#2d3748" : "#f7fafc"
         }}>
           <div className="flex justify-between items-center mb-4">
             <Typography
               variant="h6"
               className="font-semibold flex items-center gap-2"
               style={{ color: mode === "dark" ? "white" : "black" }}
             >
               🛠️ Advanced Tools
             </Typography>
             <Button
               size="sm"
               variant={showAdvancedOptions ? "filled" : "outlined"}
               onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
             >
               {showAdvancedOptions ? 'Hide' : 'Show'}
             </Button>
           </div>

           {showAdvancedOptions && (
             <div className="space-y-4">
               {/* SEO Tools */}
               <div className="space-y-2">
                 <Typography
                   variant="small"
                   className="font-semibold"
                   style={{ color: mode === "dark" ? "white" : "black" }}
                 >
                   📈 SEO Tools
                 </Typography>
                 <div className="grid grid-cols-2 gap-2">
                   <Button
                     size="sm"
                     variant="outlined"
                     onClick={generateSeoData}
                     className="text-xs"
                   >
                     Generate SEO
                   </Button>
                   <Button
                     size="sm"
                     variant="outlined"
                     onClick={autoGenerateTags}
                     className="text-xs"
                   >
                     Auto Tags
                   </Button>
                 </div>
               </div>

               {/* Content Analysis */}
               <div className="space-y-2">
                 <Typography
                   variant="small"
                   className="font-semibold"
                   style={{ color: mode === "dark" ? "white" : "black" }}
                 >
                   📊 Content Analysis
                 </Typography>
                 <Button
                   size="sm"
                   variant="outlined"
                   onClick={analyzeContent}
                   className="w-full text-xs"
                 >
                   Analyze Content
                 </Button>
                 <div className="text-xs space-y-1">
                   <div className="flex justify-between">
                     <span style={{ color: mode === "dark" ? "white" : "black" }}>Words:</span>
                     <span>{advancedSettings.wordCount}</span>
                   </div>
                   <div className="flex justify-between">
                     <span style={{ color: mode === "dark" ? "white" : "black" }}>Characters:</span>
                     <span>{advancedSettings.characterCount}</span>
                   </div>
                   <div className="flex justify-between">
                     <span style={{ color: mode === "dark" ? "white" : "black" }}>Paragraphs:</span>
                     <span>{advancedSettings.paragraphCount}</span>
                   </div>
                   <div className="flex justify-between">
                     <span style={{ color: mode === "dark" ? "white" : "black" }}>Read Time:</span>
                     <span>{advancedSettings.estimatedReadTime} min</span>
                   </div>
                 </div>
               </div>

               {/* Publishing Options */}
               <div className="space-y-2">
                 <Typography
                   variant="small"
                   className="font-semibold"
                   style={{ color: mode === "dark" ? "white" : "black" }}
                 >
                   📅 Publishing
                 </Typography>
                 <select
                   className={`w-full p-2 rounded border text-sm ${
                     mode === "dark" 
                       ? "bg-gray-700 border-gray-600 text-white" 
                       : "bg-white border-gray-300 text-gray-900"
                   }`}
                   value={publishSettings.status}
                   onChange={(e) => setPublishSettings({
                     ...publishSettings,
                     status: e.target.value
                   })}
                 >
                   <option value="draft">Draft</option>
                   <option value="published">Published</option>
                   <option value="scheduled">Scheduled</option>
                 </select>
                 
                 {publishSettings.status === 'scheduled' && (
                   <input
                     type="datetime-local"
                     className={`w-full p-2 rounded border text-sm ${
                       mode === "dark" 
                         ? "bg-gray-700 border-gray-600 text-white" 
                         : "bg-white border-gray-300 text-gray-900"
                     }`}
                     value={publishSettings.publishDate}
                     onChange={(e) => setPublishSettings({
                       ...publishSettings,
                       publishDate: e.target.value
                     })}
                   />
                 )}

                 <div className="space-y-2">
                   <label className="flex items-center gap-2">
                     <input
                       type="checkbox"
                       checked={publishSettings.featured}
                       onChange={toggleFeatured}
                       className="rounded"
                     />
                     <span className="text-sm" style={{ color: mode === "dark" ? "white" : "black" }}>
                       Featured Post
                     </span>
                   </label>
                   <label className="flex items-center gap-2">
                     <input
                       type="checkbox"
                       checked={publishSettings.allowComments}
                       onChange={(e) => setPublishSettings({
                         ...publishSettings,
                         allowComments: e.target.checked
                       })}
                       className="rounded"
                     />
                     <span className="text-sm" style={{ color: mode === "dark" ? "white" : "black" }}>
                       Allow Comments
                     </span>
                   </label>
                   <label className="flex items-center gap-2">
                     <input
                       type="checkbox"
                       checked={publishSettings.allowSharing}
                       onChange={(e) => setPublishSettings({
                         ...publishSettings,
                         allowSharing: e.target.checked
                       })}
                       className="rounded"
                     />
                     <span className="text-sm" style={{ color: mode === "dark" ? "white" : "black" }}>
                       Allow Sharing
                     </span>
                   </label>
                 </div>
               </div>
             </div>
           )}
         </div>

         {/* SEO Data Section */}
         {seoData.metaTitle && (
           <div className="mb-6 p-4 rounded-lg border-2 border-dashed border-gray-300" style={{
             background: mode === "dark" ? "#2d3748" : "#f7fafc"
           }}>
             <Typography
               variant="h6"
               className="mb-3 font-semibold flex items-center gap-2"
               style={{ color: mode === "dark" ? "white" : "black" }}
             >
               🔍 SEO Data
             </Typography>
             <div className="space-y-3 text-sm">
               <div>
                 <label className="block text-xs font-medium mb-1" style={{ color: mode === "dark" ? "white" : "black" }}>
                   Meta Title
                 </label>
                 <input
                   type="text"
                   value={seoData.metaTitle}
                   onChange={(e) => setSeoData({...seoData, metaTitle: e.target.value})}
                   className={`w-full p-2 rounded border text-xs ${
                     mode === "dark" 
                       ? "bg-gray-700 border-gray-600 text-white" 
                       : "bg-white border-gray-300 text-gray-900"
                   }`}
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium mb-1" style={{ color: mode === "dark" ? "white" : "black" }}>
                   Meta Description
                 </label>
                 <textarea
                   value={seoData.metaDescription}
                   onChange={(e) => setSeoData({...seoData, metaDescription: e.target.value})}
                   rows={3}
                   className={`w-full p-2 rounded border text-xs ${
                     mode === "dark" 
                       ? "bg-gray-700 border-gray-600 text-white" 
                       : "bg-white border-gray-300 text-gray-900"
                   }`}
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium mb-1" style={{ color: mode === "dark" ? "white" : "black" }}>
                   Keywords
                 </label>
                 <input
                   type="text"
                   value={seoData.keywords}
                   onChange={(e) => setSeoData({...seoData, keywords: e.target.value})}
                   className={`w-full p-2 rounded border text-xs ${
                     mode === "dark" 
                       ? "bg-gray-700 border-gray-600 text-white" 
                       : "bg-white border-gray-300 text-gray-900"
                   }`}
                 />
               </div>
             </div>
           </div>
         )}

         {/* Publish Status */}
         <div className="mb-6 p-4 rounded-lg border-2 border-dashed border-gray-300" style={{
           background: mode === "dark" ? "#2d3748" : "#f7fafc"
         }}>
           <Typography
             variant="h6"
             className="mb-3 font-semibold flex items-center gap-2"
             style={{ color: mode === "dark" ? "white" : "black" }}
           >
             📊 Update Status
           </Typography>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between">
               <span style={{ color: mode === "dark" ? "white" : "black" }}>Title:</span>
               <span className={blogs.title ? 'text-green-500' : 'text-red-500'}>
                 {blogs.title ? '✓ Complete' : '✗ Required'}
               </span>
             </div>
             <div className="flex justify-between">
               <span style={{ color: mode === "dark" ? "white" : "black" }}>Thumbnail:</span>
               <span className={(currentThumbnail || thumbnail || thumbnailLink) ? 'text-green-500' : 'text-yellow-500'}>
                 {(currentThumbnail || thumbnail || thumbnailLink) ? '✓ Complete' : '⚠ Optional'}
               </span>
             </div>
             <div className="flex justify-between">
               <span style={{ color: mode === "dark" ? "white" : "black" }}>Category:</span>
               <span className={blogs.category ? 'text-green-500' : 'text-red-500'}>
                 {blogs.category ? '✓ Complete' : '✗ Required'}
               </span>
             </div>
             <div className="flex justify-between">
               <span style={{ color: mode === "dark" ? "white" : "black" }}>Content:</span>
               <span className={blogs.content && blogs.content !== '<p><br></p>' ? 'text-green-500' : 'text-red-500'}>
                 {blogs.content && blogs.content !== '<p><br></p>' ? '✓ Complete' : '✗ Required'}
               </span>
             </div>
             <div className="pt-2 border-t border-gray-300">
               <div className="flex justify-between font-semibold">
                 <span style={{ color: mode === "dark" ? "white" : "black" }}>Overall:</span>
                 <span className={
                   blogs.title && blogs.category && 
                   blogs.content && blogs.content !== '<p><br></p>' 
                     ? 'text-green-500' : 'text-yellow-500'
                 }>
                   {blogs.title && blogs.category && 
                    blogs.content && blogs.content !== '<p><br></p>' 
                     ? '✓ Ready to Update' : '⚠ Needs Completion'}
                 </span>
               </div>
             </div>
           </div>
         </div>

        {/* Content Editor */}
        <div className="mb-6">
          <Typography
            variant="h6"
            className="mb-3 font-semibold"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            Blog Content
          </Typography>
          
                     <div className={`rounded-lg border-2 ${
             mode === "dark" ? "border-gray-600" : "border-gray-300"
           }`}>
             <DynamicQuillEditor
               ref={quillRef}
               value={blogs.content}
               onChange={(content) => setBlogs({ ...blogs, content })}
               modules={{
                 toolbar: [
                   [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                   [{size: []}],
                   ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                   [{'list': 'ordered'}, {'list': 'bullet'}, 
                    {'indent': '-1'}, {'indent': '+1'}],
                   ['link', 'image', 'video', 'code-block'],
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
                 'color', 'background',
                 'table'
               ]}
               theme="snow"
               style={{
                 backgroundColor: mode === "dark" ? '#374151' : 'white',
                 color: mode === "dark" ? 'white' : 'black'
               }}
             />

             {/* Content Tools */}
             <div className="mt-4 p-4 border-t border-gray-200">
               <Typography
                 variant="h6"
                 className="mb-3 font-semibold flex items-center gap-2"
                 style={{ color: mode === "dark" ? "white" : "black" }}
               >
                 🎯 Content Tools
               </Typography>
               <div className="grid grid-cols-2 gap-2">
                 <Button
                   size="sm"
                   variant="outlined"
                   onClick={analyzeContent}
                   className="text-xs"
                 >
                   📊 Analyze
                 </Button>
                 <Button
                   size="sm"
                   variant="outlined"
                   onClick={autoGenerateTags}
                   className="text-xs"
                 >
                   🏷️ Auto Tags
                 </Button>
                 <Button
                   size="sm"
                   variant="outlined"
                   onClick={generateSeoData}
                   className="text-xs"
                 >
                   🔍 SEO Data
                 </Button>
                 <Button
                   size="sm"
                   variant="outlined"
                   onClick={schedulePost}
                   className="text-xs"
                 >
                   📅 Schedule
                 </Button>
               </div>
             </div>
           </div>
        </div>

        {/* Update Button */}
        <div className="mb-6">
          <Button 
            className="w-full py-3 text-lg font-semibold"
            onClick={updatePost}
            disabled={loading}
            style={{
              background: loading 
                ? '#9CA3AF' 
                : mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)",
              color: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)"
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Updating Post...
              </div>
            ) : (
              'Update Blog Post'
            )}
          </Button>
        </div>

        {/* Enhanced Preview Section */}
        <div className="border-t-2 pt-6" style={{
          borderColor: mode === "dark" ? '#4B5563' : '#E5E7EB'
        }}>
          <div className="flex justify-between items-center mb-4">
            <Typography
              variant="h5"
              className="font-bold"
              style={{ color: mode === "dark" ? "white" : "black" }}
            >
              📱 Preview Options
            </Typography>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={showPreview ? "filled" : "outlined"}
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
          </div>

          {showPreview && (
            <div className="space-y-4">
              {/* Preview Mode Selector */}
              <div className="flex gap-2 mb-4">
                <Button
                  size="sm"
                  variant={previewMode === 'desktop' ? "filled" : "outlined"}
                  onClick={() => setPreviewMode('desktop')}
                >
                  Desktop
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'tablet' ? "filled" : "outlined"}
                  onClick={() => setPreviewMode('tablet')}
                >
                  Tablet
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'mobile' ? "filled" : "outlined"}
                  onClick={() => setPreviewMode('mobile')}
                >
                  Mobile
                </Button>
              </div>

              {/* Preview Container */}
              <div className={`border-2 border-gray-300 rounded-lg overflow-hidden ${
                previewMode === 'desktop' ? 'w-full' :
                previewMode === 'tablet' ? 'w-3/4 mx-auto' :
                'w-1/2 mx-auto'
              }`}>
                <div className="bg-gray-100 p-2 border-b border-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {previewMode === 'desktop' ? 'Desktop View' :
                       previewMode === 'tablet' ? 'Tablet View' : 'Mobile View'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-6 min-h-[400px]">
                  {/* Blog Preview Content */}
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {blogs.title || 'Your Blog Title'}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>By Pankaj Hadole</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{blogs.category || 'Category'}</span>
                      <span>•</span>
                      <span>~{Math.ceil((blogs.content || '').split(' ').length / 200)} min read</span>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Preview */}
                  {(currentThumbnail || thumbnail || thumbnailLink) && (
                    <div className="mb-4">
                      <img 
                        className="w-full h-48 object-cover rounded-lg"
                        src={thumbnail ? URL.createObjectURL(thumbnail) : 
                              thumbnailLink || currentThumbnail}
                        alt="blog thumbnail"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Content Preview */}
                  <div className="prose prose-sm max-w-none">
                    <div
                      className={`
                      [&> h1]:text-[24px] [&>h1]:font-bold [&>h1]:mb-2.5 [&>h1]:text-gray-900
                      [&>h2]:text-[20px] [&>h2]:font-bold [&>h2]:mb-2.5 [&>h2]:text-gray-800
                      [&>h3]:text-[18px] [&>h3]:font-bold [&>h3]:mb-2.5 [&>h3]:text-gray-800
                      [&>h4]:text-[16px] [&>h4]:font-bold [&>h4]:mb-2.5 [&>h4]:text-gray-800
                      [&>h5]:text-[14px] [&>h5]:font-bold [&>h5]:mb-2.5 [&>h5]:text-gray-800
                      [&>h6]:text-[12px] [&>h6]:font-bold [&>h6]:mb-2.5 [&>h6]:text-gray-800
                      [&>p]:text-[14px] [&>p]:mb-1.5 [&>p]:text-gray-700
                      [&>ul]:list-disc [&>ul]:mb-2 [&>ul]:text-gray-700
                      [&>ol]:list-decimal [&>ol]:mb-2 [&>ol]:text-gray-700
                      [&>li]:mb-1 [&>li]:text-gray-700
                      [&>img]:rounded-lg [&>img]:max-w-full [&>img]:h-auto
                      [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic
                      [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm
                      [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded [&>pre]:overflow-x-auto
                      `}
                      dangerouslySetInnerHTML={createMarkup(blogs.content || '<p>Start writing your blog content...</p>')}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default EditBlog;
