import React, { useState, useContext, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import myContext from "../../../context/data/myContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireDb, storage } from "../../../firebase/FirebaseConfig";

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
  });

  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(fireDb, "blogPost", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const blogData = docSnap.data();
          setBlogs(blogData);
          setCurrentThumbnail(blogData.thumbnail);
        } else {
          console.log("No such document!");
          toast.error("Blog not found");
          navigate("/"); // Redirect to homepage or handle as needed
        }
      } catch (error) {
        console.error("Error fetching document:", error.message);
        toast.error("Error fetching blog");
        navigate("/"); // Redirect to homepage or handle as needed
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const updatePost = async () => {
    // Check if required fields are empty
    if (blogs.title === "" || blogs.category === "" || blogs.content === "") {
      return toast.error("All fields are required");
    }

    try {
      // If a new thumbnail is selected, upload it first
      if (thumbnail) {
        await uploadImage();
      } else {
        // Update the blog with the latest state values
        await updateBlog();
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Error updating post");
    }
  };

  const uploadImage = async () => {
    const imageRef = ref(storage, blogimage/${thumbnail.name});
    try {
      const snapshot = await uploadBytes(imageRef, thumbnail);
      const url = await getDownloadURL(snapshot.ref);
      await updateBlog(url); // Pass the URL to update the blog post
    } catch (error) {
      console.error("Error uploading image: ", error);
      toast.error("Error uploading image");
    }
  };

  const updateBlog = async (imageUrl = currentThumbnail) => {
    const blogRef = doc(fireDb, "blogPost", id);
    try {
      await updateDoc(blogRef, {
        title: blogs.title,
        category: blogs.category,
        content: blogs.content,
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
      console.error("Error updating document: ", error);
      toast.error("Error updating post");
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-6">
      <div
        className="p-5"
        style={{
          background: mode === "dark" ? "#353b48" : "rgb(226, 232, 240)",
          borderBottom:
            mode === "dark"
              ? " 4px solid rgb(226, 232, 240)"
              : " 4px solid rgb(30, 41, 59)",
        }}
      >
        {/* Top Item */}
        <div className="mb-2 flex justify-between">
          <div className="flex gap-2 items-center">
            {/* Dashboard Link */}
            <Link to={"/dashboard"}>
              <BsFillArrowLeftCircleFill size={25} />
            </Link>

            {/* Text */}
            <Typography
              variant="h4"
              style={{
                color: mode === "dark" ? "white" : "black",
              }}
            >
              Edit Blog
            </Typography>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-3">
          {/* Thumbnail */}
          {currentThumbnail && (
            <img
              className="w-full rounded-md mb-3"
              src={currentThumbnail}
              alt="thumbnail"
            />
          )}

          {/* Text */}
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-2 font-semibold"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            {thumbnail ? "Upload New Thumbnail" : "Current Thumbnail"}
          </Typography>

          {/* Thumbnail Input */}
          <input
            type="file"
            className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>

        {/* Title Input */}
        <div className="mb-3">
          <input
            type="text"
            className={shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none ${
              mode === "dark" ? "placeholder-black" : "placeholder-black"
            }}
            placeholder="Enter Your Title"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            value={blogs.title}
            onChange={(e) =>
              setBlogs({ ...blogs, title: e.target.value })
            }
          />
        </div>

        {/* Category Input */}
        <div className="mb-3">
          <input
            type="text"
            className={shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 outline-none ${
              mode === "dark" ? "placeholder-black" : "placeholder-black"
            }}
            placeholder="Enter Your Category"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            value={blogs.category}
            onChange={(e) =>
              setBlogs({ ...blogs, category: e.target.value })
            }
          />
        </div>

        {/* Editor */}
        <Editor
          apiKey="7tpqrdfglcn651x8kwliw2run7rze6zzvgvrob6lux0hc7ya"
          initialValue={blogs.content} // Initialize with the current content
          value={blogs.content} // Ensure controlled component behavior
          onEditorChange={(content, editor) => {
            setBlogs({ ...blogs, content }); // Update content in state
          }}
          init={{
            plugins: "a11ychecker advcode advlist advtable anchor autocorrect autolink autoresize autosave casechange charmap checklist code codesample directionality editimage emoticons export footnotes formatpainter fullscreen help image importcss inlinecss insertdatetime link linkchecker lists media mediaembed mentions mergetags nonbreaking pagebreak pageembed permanentpen powerpaste preview quickbars save searchreplace table tableofcontents template  tinydrive tinymcespellchecker typography visualblocks visualchars wordcount",
            toolbar: "YOUR_TOOLBAR_CONFIG",
            height: 400,
            menubar: true,
            branding: false,
            resize: "both",
            paste_data_images: true,
            images_upload_handler: (blobInfo, success, failure) => {
              // Handle image upload here if needed
            },
          }}
        />

        {/* Submit Button */}
        <Button
          className="w-full mt-5"
          onClick={updatePost}
          style={{
            background:
              mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)",
            color:
              mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)",
          }}
        >
          Update
        </Button>

        {/* Preview Section */}
        <div className="">
          <h1 className="text-center mb-3 text-2xl">Preview</h1>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: blogs.content }}
          />
        </div>
      </div>
    </div>
  );
}

export default EditBlog;