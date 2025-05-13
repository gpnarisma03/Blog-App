import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PopularPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data.blogPosts || []))
      .catch((err) => console.error('Error fetching posts:', err));
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
                  src={`${post.imageUrl}`}
                  alt="Image placeholder"
                  className="side-box-image"
                />
                <div className="text">
                  <h4>{post.title}</h4>
                  <div className="post-meta">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                      })}
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
