import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import myContext from '../../context/data/myContext';
import { useParams, useNavigate } from 'react-router';
import { Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, getDocs, updateDoc } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import Loader from '../../components/loader/Loader';
import Layout from '../../components/layout/Layout';
import Comment from '../../components/comment/Comment';
import toast from 'react-hot-toast';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share';
import { FaCopy, FaCode, FaEdit } from 'react-icons/fa';

const Ad = ({ position }) => (
  <div className="ad-container">
    <p>Advertisement Space - {position}</p>
  </div>
);

function BlogInfo() {
  const context = useContext(myContext);
  const { mode, loading, setloading, user } = context; // Assuming `user` holds the current user data

  const params = useParams();
  const navigate = useNavigate();

  const [getBlogs, setGetBlogs] = useState();
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [fullName, setFullName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [allComment, setAllComment] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');

  const getAllBlogs = async () => {
    setloading(true);
    try {
      const productTemp = await getDoc(doc(fireDb, "blogPost", params.id));
      if (productTemp.exists()) {
        setGetBlogs(productTemp.data());
        setUpdatedTitle(productTemp.data().blogs.title);
        setUpdatedContent(productTemp.data().blogs.content);
      } else {
        console.log("Document does not exist");
      }
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, [params.id]);

  const getOtherBlogs = async () => {
    try {
      const q = query(
        collection(fireDb, "blogPost"),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      let blogsArray = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== params.id) {
          blogsArray.push({ ...doc.data(), id: doc.id });
        }
      });
      setOtherBlogs(blogsArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOtherBlogs();
  }, [params.id]);

  const addComment = async () => {
    const commentRef = collection(fireDb, "blogPost/" + `${params.id}/` + "comment");
    try {
      await addDoc(
        commentRef, {
          fullName,
          commentText,
          time: Timestamp.now(),
          date: new Date().toLocaleString(
            "en-US",
            {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }
          )
        }
      );
      toast.success('Comment Added Successfully');
      setFullName("");
      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  const getcomment = async () => {
    try {
      const q = query(
        collection(fireDb, "blogPost/" + `${params.id}/` + "comment/"),
        orderBy('time')
      );
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productsArray = [];
        QuerySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });
        setAllComment(productsArray);
      });
      return () => data();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getcomment();
    window.scrollTo(0, 0);
  }, [params.id]);

  const shareUrl = window.location.href;
  const shareTitle = getBlogs?.blogs?.title;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch((error) => {
      console.log('Error copying to clipboard', error);
    });
  };

  const embedCode = `<iframe src="${shareUrl}" width="600" height="400" frameborder="0" allowfullscreen></iframe>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      toast.success('Embed code copied to clipboard!');
    }).catch((error) => {
      console.log('Error copying embed code', error);
    });
  };

  const updateBlog = async () => {
    const blogRef = doc(fireDb, "blogPost", params.id);
    try {
      await updateDoc(blogRef, {
        blogs: {
          title: updatedTitle,
          content: updatedContent
        },
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      });
      toast.success('Blog updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast.error('Error updating blog');
    }
  };

  const createMarkup = (content) => {
    return { __html: content };
  };

  return (
    <Layout>
      <Helmet>
        <title>{getBlogs ? getBlogs.blogs.title : 'Loading...'}</title>
        <meta name="description" content={getBlogs?.blogs?.content.slice(0, 150)} />
        <meta name="keywords" content="blog, article, news, content, Technology, Farmer, Programming, Sports, News, Trending" />
        <meta property="og:title" content={getBlogs?.blogs?.title} />
        <meta property="og:description" content={getBlogs?.blogs?.content.slice(0, 150)} />
        <meta property="og:image" content={getBlogs?.thumbnail} />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getBlogs?.blogs?.title} />
        <meta name="twitter:description" content={getBlogs?.blogs?.content.slice(0, 150)} />
        <meta name="twitter:image" content={getBlogs?.thumbnail} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": "${getBlogs?.blogs?.title}",
              "image": "${getBlogs?.thumbnail}",
              "author": {
                "@type": "Person",
                "name": "Pankaj Hadole"
              },
              "datePublished": "${getBlogs?.date}",
              "articleBody": "${getBlogs?.blogs?.content}"
            }
          `}
        </script>
      </Helmet>
      <section className="rounded-lg h-full overflow-hidden max-w-4xl mx-auto px-4">
        <div className="py-4 lg:py-8">
          {loading
            ? <Loader />
            : <div>
              <Ad position="Top Banner" />
              <img alt="content" className="mb-3 rounded-lg h-full w-full" src={getBlogs?.thumbnail} />
              <div className="flex justify-between items-center mb-3">
                <h1 style={{ color: mode === 'dark' ? 'white' : 'black' }} className='text-xl md:text-2xl lg:text-2xl font-semibold'>
                  {isEditing
                    ? <input
                        type="text"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        className="border p-2 rounded"
                      />
                    : getBlogs?.blogs?.title}
                </h1>
                <p style={{ color: mode === 'dark' ? 'white' : 'black' }}>{getBlogs?.date}</p>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="ml-4 p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Edit Blog"
                  >
                    <FaEdit size={20} />
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="content">
                  <textarea
                    value={updatedContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                    className="w-full border p-2 rounded"
                    rows="10"
                  />
                  <button
                    onClick={updateBlog}
                    className="mt-4 p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Save Changes"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className={`border-b mb-5 ${mode === 'dark' ? 'border-gray-600' : 'border-gray-400'}`} />
              )}
              <div className="content">
                <div className={`[&>h1]:text-[32px] [&>h1]:font-bold [&>h1]:mb-2.5
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
                  dangerouslySetInnerHTML={createMarkup(getBlogs?.blogs?.content)}>
                </div>
              </div>
              <Ad position="Inline" />
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex space-x-2 mb-4">
                  <FacebookShareButton url={shareUrl} quote={shareTitle}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={shareTitle}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <LinkedinShareButton url={shareUrl} title={shareTitle}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <WhatsappShareButton url={shareUrl} title={shareTitle}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Copy Link"
                >
                  <FaCopy size={20} />
                </button>
                <button
                  onClick={copyEmbedCode}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Copy Embed Code"
                >
                  <FaCode size={20} />
                </button>
              </div>
              <Ad position="Bottom Banner" />
            </div>}
        </div>

        <Comment
          addComment={addComment}
          commentText={commentText}
          setcommentText={setCommentText}
          allComment={allComment}
          fullName={fullName}
          setFullName={setFullName}
        />

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">You Can Check Also:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {otherBlogs.map(blog => (
              <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <img
                  className="w-full h-48 object-cover"
                  src={blog.thumbnail}
                  alt={blog.blogs?.title}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{blog.blogs?.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{blog.date}</p>
                  <a href={`/bloginfo/${blog.id}`} className="text-blue-500 hover:underline">Read More</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </Layout>
  );
}

export default BlogInfo;
