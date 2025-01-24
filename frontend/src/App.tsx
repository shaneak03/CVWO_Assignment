import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
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

export const ENDPOINT = "http://localhost:3000";

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
        <Route
          path="/"
          element={isLoggedIn ? (
            <>
              <div>{JSON.stringify(webposts)}</div>
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
              <div>{JSON.stringify(webposts)}</div>
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
              <div>{JSON.stringify(webposts)}</div>
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
              <div>{JSON.stringify(webposts)}</div>
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
              <div>{JSON.stringify(webposts)}</div>
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
