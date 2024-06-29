import React, { useContext, useEffect, useState } from 'react'
import myContext from '../../context/data/myContext'
import { useParams } from 'react-router';
import { Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import Loader from '../../components/loader/Loader';
import Layout from '../../components/layout/Layout';
import Comment from '../../components/comment/Comment';
import toast from 'react-hot-toast';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share';
import { FaCopy, FaCode } from 'react-icons/fa';

function BlogInfo() {
  const context = useContext(myContext);
  const { mode, loading, setloading } = context;

  const params = useParams();

  const [getBlogs, setGetBlogs] = useState();

  const getAllBlogs = async () => {
    setloading(true);
    try {
      const productTemp = await getDoc(doc(fireDb, "blogPost", params.id))
      if (productTemp.exists()) {
        setGetBlogs(productTemp.data());
      } else {
        console.log("Document does not exist")
      }
      setloading(false)
    } catch (error) {
      console.log(error)
      setloading(false)
    }
  }

  useEffect(() => {
    getAllBlogs();
  }, []);

  function createMarkup(c) {
    return { __html: c };
  }

  const [fullName, setFullName] = useState('');
  const [commentText, setCommentText] = useState('');

  const addComment = async () => {
    const commentRef = collection(fireDb, "blogPost/" + `${params.id}/` + "comment")
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
      })
      toast.success('Comment Added Successfully');
      setFullName("")
      setCommentText("")
    } catch (error) {
      console.log(error)
    }
  }

  const [allComment, setAllComment] = useState([]);

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
        setAllComment(productsArray)
        console.log(productsArray)
      });
      return () => data;
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getcomment();
    window.scrollTo(0, 0)
  }, []);

  const shareUrl = window.location.href;
  const shareTitle = getBlogs?.blogs?.title;

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch((error) => {
      console.log('Error copying to clipboard', error);
    });
  }

  // Embed code
  const embedCode = `<iframe src="${shareUrl}" width="600" height="400" frameborder="0" allowfullscreen></iframe>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      toast.success('Embed code copied to clipboard!');
    }).catch((error) => {
      console.log('Error copying embed code', error);
    });
  }

  return (
    <Layout>
      <section className="rounded-lg h-full overflow-hidden max-w-4xl mx-auto px-4 ">
        <div className="py-4 lg:py-8">
          {loading
            ?
            <Loader />
            :
            <div>
              {/* Thumbnail  */}
              <img alt="content" className="mb-3 rounded-lg h-full w-full"
                src={getBlogs?.thumbnail}
              />
              {/* title And date  */}
              <div className="flex justify-between items-center mb-3">
                <h1 style={{ color: mode === 'dark' ? 'white' : 'black' }}
                  className='text-xl md:text-2xl lg:text-2xl font-semibold'>
                  {getBlogs?.blogs?.title}
                </h1>
                <p style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                  {getBlogs?.date}
                </p>
              </div>
              <div
                className={`border-b mb-5 ${mode === 'dark' ?
                  'border-gray-600' : 'border-gray-400'}`}
              />

              {/* blog Content  */}
              <div className="content">
                <div
                  className={`[&> h1]:text-[32px] [&>h1]:font-bold  [&>h1]:mb-2.5
                  ${mode === 'dark' ? '[&>h1]:text-[#ff4d4d]' : '[&>h1]:text-black'}

                  [&>h2]:text-[24px] [&>h2]:font-bold [&>h2]:mb-2.5
                  ${mode === 'dark' ? '[&>h2]:text-white' : '[&>h2]:text-black'}

                  [&>h3]:text-[18.72] [&>h3]:font-bold [&>h3]:mb-2.5
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

              {/* Share Options */}
              <div className="mt-4 flex items-center space-x-2">
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
                  <FaCopy size={32} />
                </button>
                <button
                  onClick={copyEmbedCode}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Copy Embed Code"
                >
                  <FaCode size={32} />
                </button>
              </div>
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
      </section>
    </Layout>
  )
}

export default BlogInfo;
