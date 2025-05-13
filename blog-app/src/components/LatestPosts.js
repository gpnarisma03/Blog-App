import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function LatestPosts() {
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setLatestPosts(data.blogPosts || []))
      .catch((err) => console.error('Error fetching latest posts:', err));
  }, []);

  return (
    <>
<section className="section posts-entry" id="posts-entry">
  <div className="container">
    <div className="row mb-4">
      <div className="col-sm-6">
        <h2 className="posts-entry-title mt-5">Latest Posts</h2>
      </div>
    </div>
    <div className="row g-3">
      {latestPosts.slice(0, 4).map((post) => (
        <div key={post._id} className="col-md-3">
          <div className="blog-entry-trending">
            <Link to={`/posts/${post._id}`} className="img-link-trending">
                  <div className="latest-image-container" style={{ height: '30vh', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={`${post.imageUrl.replace(/\\/g, '/')}`}
                      alt="Blog"
                      className="img-fluid mb-4 rounded"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
            </Link>

            <span className="date text-muted">
              {new Date(post.createdAt).toLocaleDateString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
              })}
            </span>

            <h3>
              <Link to={`/posts/${post._id}`}>{post.title}</Link>
            </h3>
            <p className="text-muted">{post.content.slice(0, 100)}...</p>
            <p>
              <Link to={`/posts/${post._id}`} className="read-more-btn">
                Read More
              </Link>
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


    </>
  );
}

export default LatestPosts;
