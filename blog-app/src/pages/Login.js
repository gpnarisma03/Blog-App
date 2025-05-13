import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import UserContext from '../context/UserContext';

export default function Login() {
  const { user, setUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

// Inside your Login.js component
function authenticate(e) {
  e.preventDefault();

  fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('token', data.token);
        retrieveUserDetails(data.token);
        setUsername('');
        setPassword('');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    });
}

function retrieveUserDetails(token) {
  fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.user) {
        setUser({
          id: data.user._id,
          isAdmin: data.user.isAdmin,
          username: data.user.username,
        });
      } else {
        toast.error('Failed to retrieve user details.');
      }
    })
    .catch(() => {
      toast.error('Error fetching user details.');
    });
}


  useEffect(() => {
    if (username !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [username, password]);


  return (
    user.id !== null ? 
      <Navigate to="/blogs" /> :
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <Card className="p-4 shadow-lg">
              <h1 className="text-center mb-4">Login</h1>
              <Form onSubmit={authenticate}>
                    <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter username" 
                        required
                        value={username}  // Update this to use the username state
                        onChange={(e) => setUsername(e.target.value)}  // Update this to handle username input
                    />
                    </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  { 
                    isActive ? 
                      <Button variant="primary" type="submit" block="true">
                        Login
                      </Button>
                    : 
                      <Button variant="danger" type="submit" block="true" disabled>
                        Login
                      </Button>
                  }

                  <Button 
                    variant="outline-secondary" 
                    onClick={() => toast.info('Reset password functionality coming soon!')}
                  >
                    Forgot Password?
                  </Button>
                </div>

                <hr />

                <Button 
                  variant="outline-danger" 
                  className="w-100 mb-3" 
                  onClick={() => toast.info('Google login coming soon!')}
                >
                  Sign in with Google
                </Button>

                <p className="text-center">
                  Don't have an account? <Link to="/register">Sign up</Link>
                </p>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
  );
}
