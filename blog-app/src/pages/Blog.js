import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PopularPosts from '../components/PopularPosts';
import TagsSection from '../components/TagSection';
import UserContext from '../context/UserContext';
import { toast } from 'react-toastify';
import EditPost from '../components/EditPost'; // Import the EditPost component

function Blog({ onDataReady }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);
  const dropdownRefs = useRef({});
  const [showEditModal, setShowEditModal] = useState(false); // To control modal visibility
  const [selectedPost, setSelectedPost] = useState(null); // To store selected post for editing

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.blogPosts);
        if (onDataReady) onDataReady(data.blogPosts);
      })
      .catch((err) => console.error('Error fetching posts:', err));
  }, [onDataReady]);

  const handleClickOutside = useCallback((event) => {
    Object.keys(dropdownRefs.current).forEach((postId) => {
      const dropdown = dropdownRefs.current[postId];
      const menu = document.getElementById(`menu-${postId}`);
      if (dropdown && !dropdown.contains(event.target)) {
        menu?.classList.remove('show');
      }
    });
  }, []);

  const refreshPosts = (updatedPost) => {
  setPosts((prevPosts) =>
    prevPosts.map((post) =>
      post._id === updatedPost._id ? { ...post, ...updatedPost } : post
    )
  );
};

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleDelete = (postId) => {
    const toastId = `delete-toast-${postId}`;
    if (toast.isActive(toastId)) return;

    toast.info(
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
        <span>Are you sure you want to delete this post?</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.success) {
                    setPosts((prev) => prev.filter((post) => post._id !== postId));
                    toast.dismiss(toastId);
                    toast.success("Post deleted.");
                  } else {
                    toast.error("Failed to delete post.");
                  }
                })
                .catch((err) => {
                  console.error('Error deleting post:', err);
                  toast.error("Error deleting post.");
                });
              toast.dismiss(toastId);
            }}
            style={deleteBtnStyle}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            style={cancelBtnStyle}
          >
            No
          </button>
        </div>
      </div>,
      {
        toastId,
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  const handleEditClick = (post) => {
    setSelectedPost(post); // Set the selected post for editing
    setShowEditModal(true); // Show the modal
  };

  const closeModal = () => {
    setShowEditModal(false); // Close the modal
    setSelectedPost(null); // Reset the selected post
  };

  const deleteBtnStyle = {
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  };

  const cancelBtnStyle = {
    backgroundColor: '#ccc',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero overlay inner-page py-5">
        <div className="container">
          <div className="row align-items-center justify-content-center text-center pt-5">
            <div className="col-lg-6">
              <h1 className="heading text-white mb-3">Blog</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content Section */}
      <section className="blogs-section search-result-wrap mt-5" id="blog-section">
        <div className="container">
          <div className="row posts-entry">
            <div className="col-lg-8">
              {posts.map((post) => (
                <div key={post._id} className="blog-entry d-flex blog-entry-search-item">
                  <Link to={`/posts/${post._id}`} className="img-link me-4">
                    <div className="image-container">
                      <img
                        src={post.imageUrl}
                        alt="Blog"
                        className="img-fluid custom-image"
                        onError={(e) => { e.target.src = "/default-blog.jpg"; }}
                      />
                    </div>
                  </Link>
                  <div>
                    <div className="d-flex align-items-center mt-2">
                      <img
                        src={post.author.imageUrl}
                        alt={post.author.username}
                        className="rounded-circle me-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/default-user.png'; }}
                      />
                      <span className="text-muted">{post.author.username}</span>
                    </div>
                    <span className="date">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                      })}
                    </span>
                    <h2><Link to={`/posts/${post._id}`}>{post.title}</Link></h2>
                    <p>{post.content.slice(0, 100)}...</p>
                    <p><Link to={`/posts/${post._id}`} className="read-more-btn">Read More</Link></p>
                  </div>

                  {(user && (user.isAdmin || user.username === post.author.username)) && (
                    <div
                      className="custom-dropdown mt-3"
                      ref={(el) => (dropdownRefs.current[post._id] = el)}
                    >
                      <button
                        className="custom-dropdown-toggle btn btn-light"
                        aria-label="Toggle post menu"
                        onClick={() =>
                          document.getElementById(`menu-${post._id}`).classList.toggle('show')
                        }
                      >
                        <span style={{
                          display: 'inline-block',
                          width: '24px',
                          height: '24px',
                          fontSize: '30px',
                          lineHeight: '24px',
                          textAlign: 'center',
                        }}>
                          ⋯
                        </span>
                      </button>
                      <div id={`menu-${post._id}`} className="custom-dropdown-menu">
                        <div onClick={() => handleEditClick(post)} className="dropdown-item">Edit</div>
                        <div onClick={() => handleDelete(post._id)} className="dropdown-item text-danger">Delete</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4 sidebar">
              <div className="sidebar-box search-form-wrap mb-4">
                <form action="#" className="sidebar-search-form">
                  <span className="bi-search"></span>
                  <input
                    type="text"
                    className="form-control"
                    id="s"
                    placeholder="Type a keyword and hit enter"
                  />
                </form>
              </div>

              <PopularPosts
              refreshPosts={refreshPosts}
              />
              <TagsSection />
            </div>
          </div>
        </div>
      </section>

      {/* EditPost Modal */}
      {selectedPost && (
        <EditPost
          show={showEditModal}
          handleClose={closeModal}
          post={selectedPost}
         refreshPosts={refreshPosts}
        />
      )}
    </>
  );
}

export default Blog;
