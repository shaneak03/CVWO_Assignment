import './App.css';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import AddWebPost from './pages/AddWebPost';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddReview from './pages/AddReview';
import Movies from './pages/Movies';
import SearchPage from './pages/SearchPage';
import Profile from './pages/Profile';
import MovieDetails from './pages/MovieDetails';
import { User } from './hooks/User';

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
  const { isLoggedIn, userId } = User();

  useEffect(() => {
    if (isLoggedIn) {
      API('api/webposts').then((data) => {
        setWebposts(data);
      }).catch((error) => {
        console.error('Error fetching web posts:', error);
      });
    }
  }, [isLoggedIn]);

  return (
    <Router>
      <Box display="flex" justifyContent="center" marginTop="1rem">
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
        {isLoggedIn && <Link to="/profile">Profile</Link>}
      </Box>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? (
            <>
              <Box>{JSON.stringify(webposts)}</Box>
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
              <AddWebPost />
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/addreview"
          element={isLoggedIn ? (
            <>
              <Box>{JSON.stringify(webposts)}</Box>
              <AddReview />
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/searchpage"
          element={isLoggedIn ? (
            <>
              <Box>{JSON.stringify(webposts)}</Box>
              <SearchPage />
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/movies"
          element={isLoggedIn ? (
            <>
              <Box>{JSON.stringify(webposts)}</Box>
              <Movies />
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/movie/:imdbID"
          element={isLoggedIn ? <MovieDetails /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
