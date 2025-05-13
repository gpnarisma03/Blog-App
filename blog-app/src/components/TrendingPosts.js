import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function TrendingPosts() {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/posts`)
      .then((res) => res.json())
      .then((data) => {
        // Assuming the API returns the number of comments for each post, e.g., data.blogPosts[i].comments.length
        const sortedPosts = data.blogPosts.sort((a, b) => b.comments.length - a.comments.length);
        setTrendingPosts(sortedPosts || []);
      })
      .catch((err) => console.error('Error fetching trending posts:', err));
  }, []);

  if (!Array.isArray(trendingPosts) || trendingPosts.length === 0) {
    return <div className='text-muted text-center'>Loading trending posts...</div>;
  }

  return (
    <section className="section posts-entry" id="posts-entry">
      <div className="container">
        <div className="row mb-4">
          <div className="col-sm-6">
            <h2 className="posts-entry-title mt-5">Trending Post</h2>
          </div>
          <div className="col-sm-6 text-sm-end mt-5">
            <Link to="/blogs" className="view-all">View All</Link>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md-9">
            <div className="row g-3">
              {trendingPosts.slice(0, 2).map((post) => (
                <div key={post._id} className="col-md-6">
                  <div className="blog-entry-trending">
                    <Link to={`/posts/${post._id}`} className="img-link-trending">
                      <div className="trending-image-container">
                        <img
                          src={`${post.imageUrl}`}
                          alt="Blog Visual"
                          className="img-fluid custom-img"
                        />
                      </div>
                    </Link>

                    <span className="date text-muted">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                      })}
                    </span>

                    <h2>
                      <Link to={`/posts/${post._id}`}>{post.title}</Link>
                    </h2>
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

          {/* Sidebar with smaller list of trending posts */}
          <div className="col-md-3">
            <ul className="list-unstyled blog-entry-sm">
              {trendingPosts.slice(0, 3).map((post) => (
                <li key={post._id}>
                  <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                  <h3><Link to={`/posts/${post._id}`}>{post.title}</Link></h3>
                  <p className='text-muted'>{post.content.slice(0, 100)}...</p>
                  <p>
                    <Link to={`/posts/${post._id}`} className="continue-reading-btn">
                      Continue Reading
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrendingPosts;
