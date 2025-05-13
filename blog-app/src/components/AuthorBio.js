// AuthorBio.js
import React from 'react';

const AuthorBio = ({ author }) => {
  if (!author) return null;

  return (
    <div className="sidebar-box text-center">
      <img
            src={author.imageUrl ? author.imageUrl : '/uploads/default-user-image.png'}

        alt={author.username || 'Author'}
        className="img-fluid rounded-circle mb-3"
        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
      />
      <h3>{author.username || 'Unknown Author'}</h3>
      <p>{author.bio || 'No bio available.'}</p>
      <div className="social">
        <a href={author.facebook || '#'} className="p-2">
          <span className="fa fa-facebook"></span>
        </a>
        <a href={author.twitter || '#'} className="p-2">
          <span className="fa fa-twitter"></span>
        </a>
        <a href={author.instagram || '#'} className="p-2">
          <span className="fa fa-instagram"></span>
        </a>
      </div>
    </div>
  );
};

export default AuthorBio;
