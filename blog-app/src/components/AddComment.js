import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddComment = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in to comment.');

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to post comment');

      // On success, show toast and clear form
      toast.success('Comment added successfully!');
      setContent('');

      // Trigger parent function to refresh post data
      onCommentAdded(data.blogPost);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-form-wrap pt-5">
      <h3 className="leave-comment">Leave a comment</h3>
      <form className="p-5" onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="message">Comment</label>
          <textarea
            id="message"
            className="form-control"
            rows="5"
            style={{ resize: 'none', width: '100%' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <input
            type="submit"
            value={loading ? 'Posting...' : 'Post Comment'}
            className="comment-btn"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddComment;
