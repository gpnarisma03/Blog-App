import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DeletePost from '../components/DeletePost';
import EditPost from '../components/EditPost'; // Import EditPost

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false); // For Edit Modal
  const [selectedPost, setSelectedPost] = useState(null); // Post to edit

  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setIsButtonDisabled(!(title && content && image));
  }, [title, content, image]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.data);
        } else {
          toast.error('Failed to load posts');
        }
      })
      .catch((err) => {
        toast.error('Error fetching posts');
        console.error(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('Post created successfully!');
          setTitle('');
          setContent('');
          setImage(null);
          setPreview(null);
          fileInputRef.current.value = null;
          fetchPosts();
        } else {
          toast.error('Failed to create post');
        }
      })
      .catch((err) => alert('Error: ' + err));
  };

  const openEditModal = (post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  return (
    <>
      <Container style={{ padding: '50px' }}>
        <Row>
          {/* Sidebar: Post Form */}
          <Col md={4}>
            <h3>Create a Post</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formContent" className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Write your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formImage" className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    } else {
                      setPreview(null);
                    }
                  }}
                  accept="image/*"
                  required
                />
              </Form.Group>

              {preview && (
                <div className="mb-3">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      maxHeight: '250px',
                    }}
                  />
                </div>
              )}

              <Button variant="primary" type="submit" disabled={isButtonDisabled} className="w-100">
                Post
              </Button>
            </Form>
          </Col>

          {/* Main Feed: Posts */}
          <Col md={8}>
            <h3>Your Posts</h3>
            {posts.length === 0 ? (
              <p>No Posts Yet.</p>
            ) : (
              [...posts]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((post) => (
                  <div
                    key={post._id}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      padding: '15px',
                      marginBottom: '20px',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div
                      style={{
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '1.2rem' }}>{post.title}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#888' }}>
                          {new Date(post.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {/* Triple dot menu aligned to the right */}
                      <div className="custom-dropdown">
                        <button
                          className="custom-dropdown-toggle"
                          onClick={() =>
                            document.getElementById(`menu-${post._id}`).classList.toggle('show')
                          }
                        >
                          <span>⋯</span>
                        </button>

                        <div id={`menu-${post._id}`} className="custom-dropdown-menu">
                          <div onClick={() => openEditModal(post)} className="dropdown-item">
                            Edit
                          </div>
                          <DeletePost postId={post._id} fetchPosts={fetchPosts} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        style={{
                          width: '100%',
                          borderRadius: '8px',
                          maxHeight: '300px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '10px' }}>{post.content}</div>
                  </div>
                ))
            )}
          </Col>
        </Row>
      </Container>

      {/* Edit Modal */}
      {selectedPost && (
        <EditPost
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          post={selectedPost}
          refreshPosts={fetchPosts}
        />
      )}
    </>
  );
};

export default CreatePost;
