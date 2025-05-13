import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import UserContext from '../context/UserContext'; // Ensure correct import

function NavbarComponent() {
  const { user } = useContext(UserContext);
  return (
    <Navbar expand="lg" className="site-nav">
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo text-light">
          SupaBlog<span className="text-light">.</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto d-flex justify-content-center">
            <Nav.Item>
              <Nav.Link as={Link} to="/" className="text-light">
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/blogs" className="text-light">
                Blogs
              </Nav.Link>
            </Nav.Item>

            {user.id !== null ? (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/create-post" className="text-light">
                    Post
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/myprofile" className="text-light">
                    My Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/logout" className="text-light">
                    Logout
                  </Nav.Link>
                </Nav.Item>
              </>
            ) : (
              <>
              <Nav.Item>
                <Nav.Link as={Link} to="/login" className="text-light">
                  Login
                </Nav.Link>
              </Nav.Item>
                <Nav.Item>
                <Nav.Link as={Link} to="/register" className="text-light">
                  Register
                </Nav.Link>
              </Nav.Item>
              </>

            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default NavbarComponent;
