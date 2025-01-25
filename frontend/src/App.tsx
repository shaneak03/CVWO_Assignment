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
import EditWebPost from './pages/EditWebPost';
import EditReview from './pages/EditReview';
import { UserProvider, useUser } from './hooks/User';
import Navbar from './components/Navbar';

export const ENDPOINT = import.meta.env.VITE_SERVER_API_URL;

interface WebPost {
  id: number;
  title: string;
  content: string;
  user_id: string;
  movie: string;
  tags: string[];
  spoiler: boolean;
  votes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

function AppContent() {
  const [webPosts, setWebPosts] = useState<WebPost[]>([]);
  const { isLoggedIn, userId } = useUser();
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${ENDPOINT}/api/webposts`);
        const data = await response.json();
        const postsWithVoteStatus = data.map((post: any) => ({
          ...post,
          hasUpvoted: post.hasUpvoted || false,
          hasDownvoted: post.hasDownvoted || false,
        }));
        setWebPosts(postsWithVoteStatus);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addwebpost" element={isLoggedIn ? <AddWebPost /> : <Navigate to="/login" />} />
        <Route path="/addreview" element={isLoggedIn ? <AddReview /> : <Navigate to="/login" />} />
        <Route path="/searchpage" element={<SearchPage posts={webPosts} />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movie/:imdbID" element={<MovieDetails />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/edit-webpost" element={<EditWebPost />} />
        <Route path="/edit-review" element={<EditReview />} />
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
