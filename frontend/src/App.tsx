import './App.css';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import AddWebPost from './pages/AddWebPost';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar'

export const ENDPOINT = "http://localhost:3000";

const API = (url: string) => fetch(`${ENDPOINT}/${url}`,  {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', 
}).then((r) => r.json());

function App() {
  const [webposts, setWebposts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      API('api/webposts').then((data) => {
        setWebposts(data);
      }).catch((error) => {
        console.error('Error fetching web posts:', error);
      });
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);  
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? (
            <>
              <Box>{JSON.stringify(webposts)}</Box>
              <Navbar />
              <Home />
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/addwebpost"
          element={isLoggedIn ? (
            <>
              <Box>{JSON.stringify(webposts)}</Box>
              <Navbar />
              <AddWebPost />
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={<Register onRegisterSuccess={handleRegisterSuccess} />}
        />
      </Routes>
      <Box display="flex" justifyContent="center" marginTop="1rem">
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/register">Register</Link>
      </Box>
    </Router>
  );
}

export default App;
