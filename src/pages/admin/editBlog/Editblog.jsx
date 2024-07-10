import React, { useState, useContext, useEffect } from 'react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import myContext from "../../../context/data/myContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireDb, storage } from "../../../firebase/FirebaseConfig";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditBlog() {
  const { id } = useParams();
  const context = useContext(myContext);
  const { mode } = context;
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState({
    title: "",
    category: "",
    content: "",
    thumbnail: null,
    time: Timestamp.now(),
    hashtags: []
  });

  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [hashtagInput, setHashtagInput] = useState("");

  const categories = ["Technology", "Farming", "Programming", "Sports", "News", "Trending"];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(fireDb, "blogPost", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const blogData = docSnap.data();
          setBlogs({
            title: blogData.title,
            category: blogData.category,
            content: blogData.content,
            thumbnail: blogData.thumbnail,
            time: Timestamp.now(),
            hashtags: blogData.hashtags || []
          });
          setCurrentThumbnail(blogData.thumbnail);
        } else {
          toast.error("Blog not found");
          navigate("/");
        }
      } catch (error) {
        toast.error("Error fetching blog");
        navigate("/");
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleAddHashtag = () => {
    if (hashtagInput && !blogs.hashtags.includes(hashtagInput.trim())) {
      setBlogs(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim()]
      }));
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (hashtag) => {
    setBlogs(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  const updatePost = async () => {
    if (blogs.title === "" || blogs.category === "" || blogs.content === "") {
      return toast.error("All fields are required");
    }

    try {
      if (thumbnail) {
        await uploadImage();
      } else {
        await updateBlog();
      }
    } catch (error) {
      toast.error("Error updating post");
    }
  };

  const uploadImage = async () => {
    const imageRef = ref(storage, `blogimage/${thumbnail.name}`);
    try {
      const snapshot = await uploadBytes(imageRef, thumbnail);
      const url = await getDownloadURL(snapshot.ref);
      await updateBlog(url);
    } catch (error) {
      toast.error("Error uploading image");
    }
  };

  const updateBlog = async (imageUrl = currentThumbnail) => {
    const blogRef = doc(fireDb, "blogPost", id);
    try {
      await updateDoc(blogRef, {
        ...blogs,
        thumbnail: imageUrl,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      });
      toast.success("Post Updated Successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error updating post");
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-6">
      <div className="p-5" style={{
        background: mode === "dark" ? "#353b48" : "rgb(226, 232, 240)",
        borderBottom: mode === "dark" ? "4px solid rgb(226, 232, 240)" : "4px solid rgb(30, 41, 59)"
      }}>
        <div className="mb-2 flex justify-between">
          <div className="flex gap-2 items-center">
            <Link to={"/dashboard"}>
              <BsFillArrowLeftCircleFill size={25} />
            </Link>
            <Typography variant="h4" style={{ color: mode === "dark" ? "white" : "black" }}>
              Edit Blog
            </Typography>
          </div>
        </div>

        <div className="mb-3">
          {currentThumbnail && <img className="w-full rounded-md mb-3" src={currentThumbnail} alt="thumbnail" />}
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold" style={{ color: mode === "dark" ? "white" : "black" }}>
            {thumbnail ? "Upload New Thumbnail" : "Current Thumbnail"}
          </Typography>
          <input type="file" className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1" style={{ background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)" }} onChange={(e) => setThumbnail(e.target.files[0])} />
        </div>

        <div className="mb-3">
          <input type="text" className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none ${mode === "dark" ? "placeholder-black" : "placeholder-black"}`} placeholder="Enter Your Title" style={{ background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)" }} value={blogs.title} onChange={(e) => setBlogs({ ...blogs, title: e.target.value })} />
        </div>

        <div className="mb-3">
          <select className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none ${mode === "dark" ? "placeholder-black" : "placeholder-black"}`} style={{ background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)" }} value={blogs.category} onChange={(e) => setBlogs({ ...blogs, category: e.target.value })}>
            <option value="" disabled>Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="mb-3 flex items-center">
          <input type="text" className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none ${mode === "dark" ? "placeholder-black" : "placeholder-black"}`} placeholder="Add hashtags (comma-separated)" style={{ background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)" }} value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { handleAddHashtag(); } }} />
          <Button className="ml-2" onClick={handleAddHashtag} style={{ background: mode === "dark" ? "#dcdde1" : "rgb(30, 41, 59)", color: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)" }}>Add Hashtag</Button>
        </div>

        <div className="mb-3">
          {blogs.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blogs.hashtags.map(hashtag => (
                <span key={hashtag} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                  {hashtag} <button className="ml-2" onClick={() => handleRemoveHashtag(hashtag)}>x</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-3">
          <ReactQuill
            value={blogs.content}
            onChange={(value) => setBlogs({ ...blogs, content: value })}
          />
        </div>

        <Button className="w-full mt-5" onClick={updatePost} style={{ background: mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)", color: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)" }}>
          Update
        </Button>

        <div className="">
          <h1 className="text-center mb-3 text-2xl">Preview</h1>
          <div className="content" dangerouslySetInnerHTML={{ __html: blogs.content }} />
        </div>
      </div>
    </div>
  );
}

export default EditBlog;
