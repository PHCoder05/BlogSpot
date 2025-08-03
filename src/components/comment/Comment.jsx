import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';

function Comment({ addComment, commentText, setcommentText, allComment, fullName, setFullName }) {
  const context = useContext(myContext);
  const { mode } = context;

  return (
    <section className={`py-8 lg:py-16 shadow-lg rounded-lg mx-4 md:mx-8 lg:mx-12 ${
      mode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-lg lg:text-2xl font-bold ${
            mode === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Make a Comment
          </h2>
        </div>

        {/* Comment Form */}
        <form className="space-y-6">
          {/* Full Name Input */}
          <div className={`rounded-lg shadow-md ${
            mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type='text'
              placeholder='Enter Full Name'
              className={`w-full px-4 py-3 text-sm border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                mode === 'dark' 
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                  : 'bg-gray-200 text-gray-900 placeholder-gray-500 border-gray-300'
              }`}
            />
          </div>

          {/* Text Area */}
          <div className={`rounded-lg shadow-md ${
            mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea
              value={commentText}
              onChange={(e) => setcommentText(e.target.value)}
              id="comment"
              rows={6}
              className={`w-full px-4 py-3 text-sm border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                mode === 'dark' 
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                  : 'bg-gray-200 text-gray-900 placeholder-gray-500 border-gray-300'
              }`}
              placeholder="Write a comment..."
              required
            />
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button
              onClick={addComment}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                mode === 'dark' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              }`}
            >
              Post Comment
            </button>
          </div>
        </form>

        {/* Bottom Item */}
        <article className="mt-8 space-y-4">
          {allComment.length > 0 ? (
            allComment.map((item, index) => {
              const { fullName, commentText, date } = item;
              return (
                <div key={index} className={`p-4 rounded-lg shadow-md ${
                  mode === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-200 border border-gray-300'
                }`}>
                  <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <p className={`text-lg font-semibold ${
                        mode === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {fullName}
                      </p>
                      <p className={`text-sm ${
                        mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {date}
                      </p>
                    </div>
                  </footer>
                  <p className={`${
                    mode === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    ↳ {commentText}
                  </p>
                </div>
              );
            })
          ) : (
            <p className={`text-center ${
              mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No comments yet.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}

export default Comment;
