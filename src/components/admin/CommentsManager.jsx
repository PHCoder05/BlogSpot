import React, { useState, useEffect, useContext } from 'react';
import {
  FaComments, FaCheck, FaTimes, FaEye, FaUser, FaCalendar,
  FaSearch, FaFilter, FaThumbsUp, FaThumbsDown, FaReply,
  FaSpinner, FaTrash, FaFlag, FaBan, FaCheckCircle, FaClock, FaSync
} from 'react-icons/fa';
import myContext from '../../context/data/myContext';
import toast from 'react-hot-toast';

const CommentsManager = () => {
  const { mode } = useContext(myContext);
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedComments, setSelectedComments] = useState([]);

  // Mock comments data - in real implementation, this would come from Firebase
  const mockComments = [
    {
      id: 1,
      author: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=teal&color=fff',
      content: 'Great article! Very informative and well-written. Looking forward to more content like this.',
      blogTitle: 'Getting Started with React',
      blogId: 'blog1',
      status: 'approved',
      createdAt: '2024-01-15T10:30:00Z',
      likes: 5,
      replies: 2,
      isSpam: false,
      ip: '192.168.1.1'
    },
    {
      id: 2,
      author: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=blue&color=fff',
      content: 'I have a question about the implementation. Could you provide more details about the state management part?',
      blogTitle: 'Advanced React Patterns',
      blogId: 'blog2',
      status: 'pending',
      createdAt: '2024-01-14T15:45:00Z',
      likes: 0,
      replies: 0,
      isSpam: false,
      ip: '192.168.1.2'
    },
    {
      id: 3,
      author: 'Spam User',
      email: 'spam@badsite.com',
      avatar: 'https://ui-avatars.com/api/?name=Spam+User&background=red&color=fff',
      content: 'Check out my amazing product at cheapstuff.com! Buy now and get 90% off!!!',
      blogTitle: 'JavaScript Best Practices',
      blogId: 'blog3',
      status: 'spam',
      createdAt: '2024-01-13T08:20:00Z',
      likes: 0,
      replies: 0,
      isSpam: true,
      ip: '192.168.1.3'
    },
    {
      id: 4,
      author: 'Tech Enthusiast',
      email: 'tech@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Tech+Enthusiast&background=purple&color=fff',
      content: 'This is exactly what I was looking for! Thanks for sharing your knowledge.',
      blogTitle: 'Modern CSS Techniques',
      blogId: 'blog4',
      status: 'approved',
      createdAt: '2024-01-12T14:15:00Z',
      likes: 3,
      replies: 1,
      isSpam: false,
      ip: '192.168.1.4'
    },
    {
      id: 5,
      author: 'Anonymous',
      email: 'anon@temp.com',
      avatar: 'https://ui-avatars.com/api/?name=Anonymous&background=gray&color=fff',
      content: 'Not sure about this approach. Have you considered alternative solutions?',
      blogTitle: 'Database Design Patterns',
      blogId: 'blog5',
      status: 'rejected',
      createdAt: '2024-01-11T09:10:00Z',
      likes: 1,
      replies: 0,
      isSpam: false,
      ip: '192.168.1.5'
    }
  ];

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(() => {
    filterComments();
  }, [comments, searchTerm, filterStatus]);

  const loadComments = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 1000);
  };

  const filterComments = () => {
    let filtered = comments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(comment =>
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.blogTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(comment => comment.status === filterStatus);
    }

    setFilteredComments(filtered);
  };

  const handleCommentAction = (commentId, action) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        switch (action) {
          case 'approve':
            toast.success('Comment approved');
            return { ...comment, status: 'approved' };
          case 'reject':
            toast.success('Comment rejected');
            return { ...comment, status: 'rejected' };
          case 'spam':
            toast.success('Comment marked as spam');
            return { ...comment, status: 'spam', isSpam: true };
          case 'delete':
            toast.success('Comment deleted');
            return null;
          default:
            return comment;
        }
      }
      return comment;
    }).filter(Boolean));
  };

  const handleBulkAction = (action) => {
    if (selectedComments.length === 0) {
      toast.error('Please select comments first');
      return;
    }

    selectedComments.forEach(commentId => {
      handleCommentAction(commentId, action);
    });

    setSelectedComments([]);
    toast.success(`${action} applied to ${selectedComments.length} comment(s)`);
  };

  const handleSelectComment = (commentId) => {
    setSelectedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedComments(
      selectedComments.length === filteredComments.length
        ? []
        : filteredComments.map(comment => comment.id)
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'spam':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-8 h-8 animate-spin text-teal-500" />
        <span className="ml-3 text-lg">Loading comments...</span>
      </div>
    );
  }

  const stats = {
    total: comments.length,
    approved: comments.filter(c => c.status === 'approved').length,
    pending: comments.filter(c => c.status === 'pending').length,
    spam: comments.filter(c => c.status === 'spam').length,
    rejected: comments.filter(c => c.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Comments Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Moderate and manage blog comments</p>
        </div>
        <button
          onClick={loadComments}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          <FaSync />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className={`p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center gap-3">
            <FaComments className="text-2xl text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-2xl text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center gap-3">
            <FaClock className="text-2xl text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center gap-3">
            <FaFlag className="text-2xl text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.spam}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Spam</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center gap-3">
            <FaBan className="text-2xl text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Comments</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="spam">Spam</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedComments.length > 0 && (
            <div className="flex gap-2 w-full lg:w-auto">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <FaCheck />
                Approve ({selectedComments.length})
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <FaTimes />
                Reject
              </button>
              <button
                onClick={() => handleBulkAction('spam')}
                className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <FaFlag />
                Spam
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <FaTrash />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className={`rounded-lg shadow-lg overflow-hidden ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedComments.length === filteredComments.length && filteredComments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="p-4 text-left font-semibold">Author</th>
                <th className="p-4 text-left font-semibold">Comment</th>
                <th className="p-4 text-left font-semibold">Blog Post</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Date</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment) => (
                <tr key={comment.id} className={`border-t ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.id)}
                      onChange={() => handleSelectComment(comment.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{comment.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="text-sm line-clamp-3">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaThumbsUp />
                        {comment.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaReply />
                        {comment.replies}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-sm">{comment.blogTitle}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                      {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <FaCalendar />
                      {formatDate(comment.createdAt)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {comment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleCommentAction(comment.id, 'approve')}
                            className="p-2 text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleCommentAction(comment.id, 'reject')}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleCommentAction(comment.id, 'spam')}
                        className="p-2 text-orange-600 hover:text-orange-800"
                        title="Mark as Spam"
                      >
                        <FaFlag />
                      </button>
                      <button
                        onClick={() => handleCommentAction(comment.id, 'delete')}
                        className="p-2 text-gray-600 hover:text-gray-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <FaComments className="mx-auto text-6xl text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">No comments found</p>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Comments will appear here when users start commenting on your posts'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsManager;
