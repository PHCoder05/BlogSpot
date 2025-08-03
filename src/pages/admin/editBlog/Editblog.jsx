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
          
          setCurrentThumbnail(blogData.thumbnail || null);
          // Check if the current thumbnail is a URL (starts with http)
          if (blogData.thumbnail && blogData.thumbnail.startsWith('http')) {
            setThumbnailLink(blogData.thumbnail);
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
      
      setThumbnail(file);
    }
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
          {currentThumbnail && !useThumbnailLink && (
            <div className="mb-3 relative">
              <img 
                className="w-full max-h-64 object-cover rounded-lg border-2 border-gray-300"
                src={currentThumbnail} 
                alt="current thumbnail" 
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
                  />
                  <button
                    onClick={() => setThumbnail(null)}
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
                onChange={(e) => setThumbnailLink(e.target.value)}
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

        {/* Preview Section */}
        {blogs.content && (
          <div className="border-t-2 pt-6" style={{
            borderColor: mode === "dark" ? '#4B5563' : '#E5E7EB'
          }}>
            <Typography
              variant="h5"
              className="text-center mb-4 font-bold"
              style={{ color: mode === "dark" ? "white" : "black" }}
            >
              Preview
            </Typography>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div
                className={`
                prose prose-lg max-w-none
                [&> h1]:text-[32px] [&>h1]:font-bold [&>h1]:mb-2.5 [&>h1]:text-red-600
                [&>h2]:text-[24px] [&>h2]:font-bold [&>h2]:mb-2.5 [&>h2]:text-gray-800
                [&>h3]:text-[18.72px] [&>h3]:font-bold [&>h3]:mb-2.5 [&>h3]:text-gray-800
                [&>h4]:text-[16px] [&>h4]:font-bold [&>h4]:mb-2.5 [&>h4]:text-gray-800
                [&>h5]:text-[13.28px] [&>h5]:font-bold [&>h5]:mb-2.5 [&>h5]:text-gray-800
                [&>h6]:text-[10px] [&>h6]:font-bold [&>h6]:mb-2.5 [&>h6]:text-gray-800
                [&>p]:text-[16px] [&>p]:mb-1.5 [&>p]:text-gray-700
                [&>ul]:list-disc [&>ul]:mb-2 [&>ul]:text-gray-700
                [&>ol]:list-decimal [&>ol]:mb-2 [&>ol]:text-gray-700
                [&>li]:mb-1 [&>li]:text-gray-700
                [&>img]:rounded-lg [&>img]:max-w-full [&>img]:h-auto
                [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic
                [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm
                [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded [&>pre]:overflow-x-auto
                `}
                dangerouslySetInnerHTML={createMarkup(blogs.content)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditBlog;
