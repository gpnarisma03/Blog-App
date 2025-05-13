import React, { useEffect, useState, useContext, useCallback } from 'react';  // Add useCallback
import { useParams } from 'react-router-dom';
import PopularPosts from './PopularPosts';
import TagsSection from './TagSection';
import AuthorBio from './AuthorBio'; 
import AddComment from './AddComment';
import UserContext from '../context/UserContext'; 
import { toast } from 'react-toastify';

const BlogView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { user } = useContext(UserContext);

  console.log(user);
  // Wrap fetchPostById in useCallback
  const fetchPostById = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      const data = await response.json();
      setPost(data.blogPost);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }, [id]); // Only re-run when 'id' changes

  // Call fetchPostById when component mounts or when 'id' changes
  useEffect(() => {
    fetchPostById();
  }, [fetchPostById]); // Add fetchPostById as a dependency

  const handleDeleteComment = async (commentId) => {
    const confirmToastId = toast.loading('Are you sure you want to delete this comment?', {
      position: 'top-center',
      autoClose: false,
      closeButton: false,
      draggable: false,
      progress: undefined,
    });

    // Custom confirmation toast
    const handleConfirm = () => {
      toast.update(confirmToastId, {
        render: "Deleting your comment...",
        type: "info",
        isLoading: true,
      });

      fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Filter out the deleted comment
            setPost((prev) => ({
              ...prev,
              comments: prev.comments.filter(comment => comment._id !== commentId),
            }));
            toast.update(confirmToastId, {
              render: 'Comment deleted successfully!',
              type: 'success',
              isLoading: false,
              autoClose: 5000,
            });
          } else {
            toast.update(confirmToastId, {
              render: 'Failed to delete the comment',
              type: 'error',
              isLoading: false,
              autoClose: 5000,
            });
          }
        })
        .catch((err) => {
          toast.update(confirmToastId, {
            render: 'Error deleting comment',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
          console.error(err);
        });
    };

    // Add buttons to the confirmation toast
    toast.update(confirmToastId, {
      render: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
          <p style={{ margin: '0', paddingRight: '10px' }}>Are you sure you want to delete this comment?</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                handleConfirm();
                toast.dismiss(confirmToastId);
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ff4757',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(confirmToastId)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ccc',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap',
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      type: 'warning',
      isLoading: false,
      closeButton: false,
      draggable: false,
    });
  };

  if (!post) return <p className='text-muted text-center'>Loading post...</p>;

  return (
    <>
      <section className="blogs-section mt-5">
        <div className="container">
          <div className="row posts-entry">
            <div className="col-lg-8">
              <div className="blog-entry d-flex flex-column p-5">
                {post.imageUrl && (
                  <div className="image-container" style={{ height: '50vh', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={`${post.imageUrl.replace(/\\/g, '/')}`}
                      alt="Blog"
                      className="img-fluid mb-4 rounded"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div className="d-flex align-items-center mb-3">
                  <div>
                    <h1 className="post-title">{post.title}</h1>
                    <p className="mb-0">
                      <span className="text-muted">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: '2-digit',
                        })}
                      </span> By <span className="author-name">{post.author?.username || 'Unknown Author'}</span>
                    </p>
                  </div>
                </div>

                <div className="blog-content mb-4">
                  <p>{post.content}</p>
                </div>

                {/* Comments Section */}
                <div className="comment-wrap">
                  <h3 className="mb-5 heading comment-count">
                    {post.comments?.length || 0} Comments
                  </h3>

                  <ul className="comment-list list-unstyled">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment, index) => (
                        <li className="comment mb-4" key={index}>
                          <div className="vcard d-flex gap-3 align-items-start">
                              <img
                                src={comment.userId?.imageUrl || '/uploads/default-user-image.png'}
                                className="img-fluid rounded-circle"
                                style={{
                                  width: '50px', height: '50px',
                                  objectFit: 'cover', flexShrink: 0,
                                }}
                                alt="User"
                              />

                            <div className="comment-body">
                              <div className="d-flex justify-content-between">
                                <div>
                                  <h3>{comment.userId?.username || 'Anonymous'}</h3>
                                  <span className="text-muted">
                                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric', month: 'long', day: '2-digit',
                                    })}
                                  </span>
                                </div>
                                {(user?.id === comment.userId?._id || user?.isAdmin) && (
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteComment(comment._id)}
                                  >
                                    Delete
                                  </button>
                                )}

                              </div>
                              <p>{comment.content}</p>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>No comments yet. Be the first to comment!</p>
                    )}
                  </ul>

                  {user && <AddComment postId={post._id} onCommentAdded={fetchPostById} />}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <AuthorBio author={post.author} />
              <PopularPosts />

              <TagsSection />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogView;
