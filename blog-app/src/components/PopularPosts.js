import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PopularPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts`);
        const data = await res.json();
        setPosts(data.blogPosts || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="sidebar-box">
      <h3 className="heading">Popular Posts</h3>
      <div className="post-entry-sidebar">
        <ul>
          {posts.slice(0, 3).map((post) => (
            <li key={post._id} className="post-list">
              <Link to={`/posts/${post._id}`}>
                <img
                  src={post.imageUrl}
                  alt={post.title || 'Post thumbnail'}
                  className="side-box-image"
                />
                <div className="text">
                  <h4>{post.title}</h4>
                  <div className="post-meta">
                    <span>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                          })
                        : 'Unknown date'}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PopularPosts;
