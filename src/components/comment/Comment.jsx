import { Button } from '@material-tailwind/react';
import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';

function Comment({ addComment, commentText, setcommentText, allComment, fullName, setFullName }) {
  const context = useContext(myContext);
  const { mode } = context;

  return (
    <section className="py-8 lg:py-16 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
            Make a Comment
          </h2>
        </div>

        {/* Comment Form */}
        <form className="space-y-6">
          {/* Full Name Input */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type='text'
              placeholder='Enter Full Name'
              className="w-full px-4 py-2 text-sm border-0 rounded-t-lg focus:ring-0 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              style={{
                background: mode === 'dark' ? '#353b48' : 'rgb(226, 232, 240)'
              }}
            />
          </div>

          {/* Text Area */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea
              value={commentText}
              onChange={(e) => setcommentText(e.target.value)}
              id="comment"
              rows={6}
              className="w-full px-4 py-2 text-sm border-0 rounded-t-lg focus:ring-0 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Write a comment..."
              required
              style={{ background: mode === 'dark' ? '#353b48' : 'rgb(226, 232, 240)' }}
            />
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <Button
              onClick={addComment}
              style={{
                background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
              }}
            >
              Post Comment
            </Button>
          </div>
        </form>

        {/* Bottom Item */}
        <article className="mt-8 space-y-4">
          {allComment.length > 0 ? (
            allComment.map((item, index) => {
              const { fullName, commentText, date } = item;
              return (
                <div key={index} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
                  <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-semibold" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        {fullName}
                      </p>
                      <p className="text-sm text-gray-500" style={{ color: mode === 'dark' ? 'gray-400' : 'gray-600' }}>
                        {date}
                      </p>
                    </div>
                  </footer>
                  <p className="text-gray-700 dark:text-gray-300" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                    ↳ {commentText}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No comments yet.</p>
          )}
        </article>
      </div>
    </section>
  );
}

export default Comment;
