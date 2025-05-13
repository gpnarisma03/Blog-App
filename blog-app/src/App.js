import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogView from './components/BlogView';
import Login from './pages/Login';
import RegistrationPage from './pages/RegistrationPage';
import CreatePost from './pages/CreatePost';
import MyProfile from './pages/MyProfile';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';
import Footer from './components/FooterSection';

import { UserProvider } from './context/UserContext';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin,
              username: data.user.username,
            });
          }
        })
        .catch(() => {
          setUser({
            id: null,
            isAdmin: null
          });
        })
        .finally(() => {
          setLoading(false); // Done loading regardless of success or error
        });
    } else {
      setLoading(false); // No token, done loading
    }
  }, []);

  const unsetUser = () => {
    setUser({
      id: null,
      isAdmin: null
    });
    localStorage.removeItem('token');
  };

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />

        {loading ? (
          <div className="text-center mt-5">Loading...</div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/posts/:id" element={<BlogView />} />
            <Route path="/login" element={user.id ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user.id ? <Navigate to="/" /> : <RegistrationPage />} />
            <Route path="/myProfile" element={user.id? <MyProfile /> : <Navigate to="/login" /> } />
            <Route path="/create-post" element={user.id ? <CreatePost /> : <Navigate to="/login" />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}

        <ToastContainer position="top-center" autoClose={2000} />
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
