import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);  // State for image preview
  const token = localStorage.getItem('token');

  // Fetch user details when the component mounts
  useEffect(() => {
    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user);
          } else {
            toast.error('Failed to load user details');
          }
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error('Error fetching user details');
          setIsLoading(false);
        });
    } else {
      toast.error('No token found');
      setIsLoading(false);
    }
  }, [token]);

  // Loading state or error state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  // Handle image file change and update the preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    // Update preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle image update submit
  const handleImageUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/updateUserImage`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('Profile image updated successfully');
          setUser(data.user); // Update user with new image URL
          setImagePreview(null);  // Reset image preview after successful upload
        } else {
          toast.error(data.message || 'Error updating image');
        }
      })
      .catch((err) => {
        toast.error('Error uploading image');
        console.error(err);
      });
  };

  return (
    <Container style={{ padding: '50px' }}>
      <Row>
        <Col md={4}>
          {/* Profile Picture and Details */}
          <Card style={{ width: '100%' }}>
            <Card.Img
              variant="top"
              src={imagePreview || user.imageUrl || '/uploads/default-user-image.png'} 
              alt="Profile"
              style={{ objectFit: 'cover', height: '250px' }}
            />
            
            {/* Image Update Form inside Card */}
            <Card.Body>
              <h5>Update Profile Image</h5>
              <Form onSubmit={handleImageUpdate}>
                <Form.Group>
                  <Form.Label>Choose a new profile image</Form.Label>
                  <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
                <Button variant="success" type="submit" disabled={!image}>
                  Update Image
                </Button>
              </Form>
            </Card.Body>
            <Card.Body>
              <Card.Title>{user.username}</Card.Title>
              <Card.Text>
                <strong>Email: </strong>{user.email}
              </Card.Text>
              <Card.Text>
                <strong>Joined: </strong>{new Date(user.createdAt).toLocaleDateString()}
              </Card.Text>
              <Button variant="primary" onClick={() => alert('Edit Profile functionality not yet implemented')}>
                Edit Profile
              </Button>
            </Card.Body>

          </Card>
        </Col>
        <Col md={8}>
          {/* Additional Profile Information */}
          <h3>Profile Information</h3>
          {/* You can add more information about the user here */}
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
