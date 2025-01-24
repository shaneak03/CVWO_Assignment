import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import AddWebPost from './pages/AddWebPost';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddReview from './pages/AddReview';
import Movies from './pages/Movies';
import SearchPage from './pages/SearchPage';
import Profile from './pages/Profile';
import MovieDetails from './pages/MovieDetails';
import { UserProvider, useUser } from './hooks/User';
import Navbar from './components/Navbar';

export const ENDPOINT = import.meta.env.VITE_SERVER_API_URL;

const API = (url: string) => fetch(`${ENDPOINT}/${url}`,  {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', 
}).then((r) => r.json());

function AppContent() {
  const [webposts, setWebposts] = useState([]);
  const { isLoggedIn, userId } = useUser();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      API('api/webposts').then((data) => {
        setWebposts(data);
      }).catch((error) => {
        console.error('Error fetching web posts:', error);
      });
    }
  }, [isLoggedIn]);

  const hideNavbarRoutes = ["/login", "/register"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addwebpost" element={isLoggedIn ? <AddWebPost /> : <Navigate to="/login" />} />
        <Route path="/addreview" element={isLoggedIn ? <AddReview /> : <Navigate to="/login" />} />
        <Route path="/searchpage" element={<SearchPage />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movie/:imdbID" element={<MovieDetails />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
