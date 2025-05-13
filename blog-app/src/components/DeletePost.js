import React from 'react';
import { toast } from 'react-toastify';

const DeletePost = ({ postId, fetchPosts }) => {
  const token = localStorage.getItem('token');

  const handleDelete = () => {
    const confirmToastId = toast.loading('Are you sure you want to delete this post?', {
      position: "top-center",
      autoClose: false,
      closeButton: false,
      draggable: false,
      progress: undefined,
    });

    // Custom confirmation toast
    const handleConfirm = () => {
      toast.update(confirmToastId, {
        render: "Deleting your post...",
        type: "info", // Use string for type
        isLoading: true,
      });

      fetch(`${process.env.REACT_APP_API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetchPosts(); // Refresh the posts
            toast.update(confirmToastId, {
              render: 'Post deleted successfully!',
              type: 'success', // Use string for type
              isLoading: false,
              autoClose: 5000,
            });
          } else {
            toast.update(confirmToastId, {
              render: 'Failed to delete the post',
              type: 'error', // Use string for type
              isLoading: false,
              autoClose: 5000,
            });
          }
        })
        .catch((err) => {
          toast.update(confirmToastId, {
            render: 'Error deleting post',
            type: 'error', // Use string for type
            isLoading: false,
            autoClose: 5000,
          });
          console.error(err);
        });
    };

    // Add buttons to the confirmation toast
    toast.update(confirmToastId, {
      render: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: '0', paddingRight: '10px' }}>Are you sure you want to delete this post?</p>
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
                whiteSpace: 'nowrap',  // Prevent text from wrapping
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
                whiteSpace: 'nowrap',  // Prevent text from wrapping
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      type: 'warning', // Use string for type
      isLoading: false,
      closeButton: false,
      draggable: false,
    });
  };

  return (
    <div onClick={handleDelete} className="dropdown-item">
      Delete
    </div>
  );
};

export default DeletePost;
