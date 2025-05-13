import React from 'react';
import { toast } from 'react-toastify'; 
import { Link } from 'react-router-dom';

const TagsSection = () => {
  return (
    <>
      {/* Tags Section */}
      <div className="sidebar-box">
        <h3 className="heading">Tags</h3>
        <ul className="tags">
          <li>
            <Link 
              to="#"
              onClick={() => toast.info('Feature coming soon!')}
              style={{ textDecoration: 'none', color: 'blue' }}
            >
              Travel
            </Link>
          </li>
          <li>
            <Link 
              to="#"
              onClick={() => toast.info('Feature coming soon!')}
              style={{ textDecoration: 'none', color: 'blue' }}
            >
              Lifestyle
            </Link>
          </li>
          <li>
            <Link 
              to="#"
              onClick={() => toast.info('Feature coming soon!')}
              style={{ textDecoration: 'none', color: 'blue' }}
            >
              Food
            </Link>
          </li>
          <li>
            <Link 
              to="#"
              onClick={() => toast.info('Feature coming soon!')}
              style={{ textDecoration: 'none', color: 'blue' }}
            >
              Adventure
            </Link>
          </li>
          <li>
            <Link 
              to="#"
              onClick={() => toast.info('Feature coming soon!')}
              style={{ textDecoration: 'none', color: 'blue' }}
            >
              Work
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TagsSection;
