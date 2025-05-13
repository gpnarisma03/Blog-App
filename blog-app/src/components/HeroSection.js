import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';  // Import UserContext

function HeroSection() {
  const { user } = useContext(UserContext);  // Access the user context

  return (
    <section className="section bg-light py-5">
      <div className="container">
        <div className="row align-items-center mb-5">
          <div className="col-md-7">
            <h1 className="display-4 fw-bold">Welcome to SupaBlog</h1>
            <p className="lead text-muted mb-5">
              A community-driven platform where anyone can share ideas, stories, and knowledge.
            </p>

            {user.id !== null ? (
              // Only show this button if user is logged in
              <Link to="/create-post" className="create-post-btn mt-5">
                + Create New Post
              </Link>
            ) : (
              // Show Log In and Sign Up links if user is not logged in
              <div className="mt-5">
                <Link to="/login" className="login-btn">Log In</Link>
                <Link to="/register" className="signup-btn m-3">Register</Link>
              </div>
            )}

          </div>

          <div className="col-md-5">
            <img
              src="https://img.freepik.com/free-vector/blogging-concept-illustration_114360-1038.jpg"
              alt="Blogging Concept Illustration"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
