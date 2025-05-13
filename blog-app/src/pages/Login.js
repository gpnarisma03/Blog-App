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
    <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 shadow-lg" style={{ border: 'none', borderRadius: '1rem', fontFamily: 'Lora, serif' }}>
            <h1 className="text-center mb-4" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Login</h1>
            <Form onSubmit={authenticate}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'var(--text-color1)' }}>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter username" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ fontFamily: 'Lora, serif' }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'var(--text-color1)' }}>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ fontFamily: 'Lora, serif' }}
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                  <Button
                    type="submit"
                    disabled={!isActive}
                    className="flex-grow-1 me-2"
                    style={{
                      backgroundColor: isActive ? 'var(--primary-color)' : 'white',
                      borderColor: 'var(--primary-color)',
                      color: isActive ? 'white' : 'var(--primary-color)',
                      fontFamily: 'Lora, serif',
                      cursor: isActive ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Login
                  </Button>

                <Button 
                  variant="outline-secondary" 
                  onClick={() => toast.info('Reset password functionality coming soon!')}
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  Forgot Password?
                </Button>
              </div>

              <hr />

                <Button
                  variant="outline-primary"
                  className="w-100 mb-3 d-flex align-items-center justify-content-center"
                  onClick={() => toast.info('Google login coming soon!')}
                  style={{
                    fontFamily: 'Lora, serif',
                    borderColor: 'var(--primary-color)',
                    color: 'var(--primary-color)',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--primary-color)';
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.color = 'var(--primary-color)';
                  }}
                >
                  <img
                    src="/google-icon.png" // Local image path from the public folder
                    alt="Google Logo"
                    style={{ width: '20px', marginRight: '10px' }}
                  />
                                  Sign in with Google
                </Button>


              <p className="text-center" style={{ color: 'var(--text-color2)', fontFamily: 'Lora, serif' }}>
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
);

}
