import { Button } from '@material-tailwind/react';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import myContext from '../../context/data/myContext';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet';
import { debounce } from 'lodash';

function BlogPostCard() {
  const context = useContext(myContext);
  const { mode, getAllBlog } = context;
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [shuffledBlogs, setShuffledBlogs] = useState([]);

  useEffect(() => {
    // Debounced shuffle function
    const debouncedShuffleBlogs = debounce(() => shuffleBlogs(), 300);
    debouncedShuffleBlogs();
    return () => {
      debouncedShuffleBlogs.cancel();
    };
  }, [getAllBlog, selectedCategory, sortOption, searchTerm, selectedTag]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const shuffleBlogs = () => {
    let blogs = selectedCategory === 'All'
      ? getAllBlog
      : getAllBlog.filter(blog => blog.blogs.category === selectedCategory);

    if (searchTerm) {
      blogs = blogs.filter(blog => blog.blogs.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedTag !== 'All') {
      blogs = blogs.filter(blog => blog.blogs.tags && blog.blogs.tags.includes(selectedTag));
    }

    if (sortOption === 'Oldest') {
      blogs = blogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      blogs = blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setShuffledBlogs(shuffleArray(blogs));
  };

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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = useMemo(() => shuffledBlogs.slice(indexOfFirstPost, indexOfLastPost), [shuffledBlogs, indexOfFirstPost, indexOfLastPost]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="text-gray-600 body-font">
      <Helmet>
        <title>Blog Posts</title>
        <meta name="description" content="Read our latest blog posts on various topics including technology, sports, news, and more." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Blog",
            "name": "Blog Posts",
            "description": "Read our latest blog posts on various topics including technology, sports, news, and more."
          })}
        </script>
      </Helmet>
      <div className="container px-4 py-10 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:space-x-4 mb-5">
          <div className="mb-4 md:mb-0 w-full md:w-1/4">
            <label htmlFor="category-select" className="sr-only">Select Category</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className={`border ${mode === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300'} p-2 rounded-md w-full`}
              aria-label="Select Category"
            >
              <option value="All">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Farming">Farming</option>
              <option value="Programming">Programming</option>
              <option value="Sports">Sports</option>
              <option value="News">News</option>
              <option value="Personal">Personal</option>
              <option value="Trending">Trending</option>
              <option value="Other..">Other..</option>
            </select>
          </div>

          <div className="mb-4 md:mb-0 w-full md:w-1/4">
            <label htmlFor="sort-select" className="sr-only">Sort By</label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={handleSortChange}
              className={`border ${mode === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300'} p-2 rounded-md w-full`}
              aria-label="Sort By"
            >
              <option value="Latest">Latest Post</option>
              <option value="Oldest">Oldest Post</option>
            </select>
          </div>

          <div className="mb-4 md:mb-0 w-full md:w-1/4">
            <label htmlFor="tag-select" className="sr-only">Select Tag</label>
            <select
              id="tag-select"
              value={selectedTag}
              onChange={handleTagChange}
              className={`border ${mode === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300'} p-2 rounded-md w-full`}
              aria-label="Select Tag"
            >
              <option value="All">All Tags</option>
              <option value="Tech">Tech</option>
              <option value="Life">Life</option>
              <option value="Health">Health</option>
              <option value="Travel">Travel</option>
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label htmlFor="search-input" className="sr-only">Search Blogs</label>
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search Blogs"
              className={`border ${mode === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300'} p-2 rounded-md w-full`}
              aria-label="Search Blogs"
            />
          </div>
        </div>

        <div className="flex flex-wrap -m-4 mb-5">
          {currentPosts.length > 0 ? (
            currentPosts.map((item) => {
              const { thumbnail, date, id, blogs } = item;
              return (
                <article className="p-4 md:w-1/2 lg:w-1/3" key={id}>
                  <div
                    style={{
                      background: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white',
                      borderBottom: mode === 'dark' ? '4px solid rgb(226, 232, 240)' : '4px solid rgb(30, 41, 59)'
                    }}
                    className={`h-full shadow-lg hover:-translate-y-1 cursor-pointer hover:shadow-gray-400 ${mode === 'dark' ? 'shadow-gray-700' : 'shadow-xl'} rounded-xl`}
                    onClick={() => navigate(`/bloginfo/${id}`)}
                    aria-label={`Read ${blogs.title}`}
                  >
                    <img
                      className="w-full h-48 object-cover object-top rounded-t-xl"
                      src={thumbnail}
                      alt={blogs.title}
                    />
                    <div className="p-6">
                      <time className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)' }}>
                        {new Date(date).toLocaleDateString()}
                      </time>
                      <h2 className="title-font text-lg font-bold mb-3" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)' }}>
                        {blogs.title}
                      </h2>
                      <p className="leading-relaxed mb-3" style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)' }}>
                        {truncateText(blogs.content, 150, id)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <h1 className="text-center w-full">No Blogs Found</h1>
          )}
        </div>

        <div className="flex justify-center my-5">
          <ul className="flex flex-wrap space-x-2">
            {Array.from({ length: Math.ceil(shuffledBlogs.length / postsPerPage) }, (_, index) => (
              <li key={index} className="cursor-pointer">
                <button
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-md ${mode === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'} ${currentPage === index + 1 ? 'font-bold' : ''}`}
                  aria-label={`Go to page ${index + 1}`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center my-5">
          <Link to="/allblogs">
            <Button
              style={{
                background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
              }}
              aria-label="See More Blogs"
            >
              See More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BlogPostCard;
