import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Container, Grid, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import ReviewCard from "../components/ReviewCard";

const ENDPOINT = import.meta.env.VITE_SERVER_API_URL;

interface Movie {
  title: string;
  year: string;
  runtime: string;
  genre: string;
  director: string;
  actors: string;
  plot: string;
  poster: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user_id: string;
  movie: string;
  tags: string[];
  spoiler: boolean;
  votes: number;
}

interface Review {
  id: number;
  content: string;
  user_id: string;
  movie: string;
  spoiler: boolean;
  rating: number;
}

const MovieDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state.movie as Movie;
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchPostsAndReviews() {
      try {
        const encodedTitle = encodeURIComponent(movie.title);
        const postsResponse = await fetch(`${ENDPOINT}/api/webposts/movie/${encodedTitle}`);
        if (!postsResponse.ok) {
          throw new Error(`Error fetching posts: ${postsResponse.statusText}`);
        }
        const postsData = await postsResponse.json();
        setPosts(postsData);

        const reviewsResponse = await fetch(`${ENDPOINT}/api/reviews/movie/${encodedTitle}`);
        if (!reviewsResponse.ok) {
          throw new Error(`Error fetching reviews: ${reviewsResponse.statusText}`);
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);

        const userIDs = [...new Set([...postsData.map((post: Post) => post.user_id), ...reviewsData.map((review: Review) => review.user_id)])];
        const usernamePromises = userIDs.map(async (userID) => {
          const response = await fetch(`${ENDPOINT}/api/users/${userID}`);
          const data = await response.json();
          return { userID, username: data.username };
        });
        const usernameResults = await Promise.all(usernamePromises);
        const usernameMap = usernameResults.reduce((acc, { userID, username }) => {
          acc[userID] = username;
          return acc;
        }, {} as { [key: string]: string });
        setUsernames(usernameMap);
      } catch (error) {
        console.error("Error fetching posts and reviews:", error);
      }
    }
    fetchPostsAndReviews();
  }, [movie.title]);

  const handleAddPost = () => {
    navigate("/addwebpost", { state: { movieTitle: movie.title } });
  };

  const handleAddReview = () => {
    navigate("/addreview", { state: { movieTitle: movie.title } });
  };

  return (
    <Container sx={{ padding: 3 }} >
      <Card sx={{ boxShadow: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              height="100%"
              image={movie.poster}
              alt={movie.title}
              sx={{ objectFit: "cover" }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {movie.title}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {movie.year} • {movie.runtime}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Genre: {movie.genre}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Director: {movie.director}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Actors: {movie.actors}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Plot: {movie.plot}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
                <Button variant="contained" onClick={handleAddPost}>
                  Add Post
                </Button>
                <Button variant="contained" onClick={handleAddReview}>
                  Add Review
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      <Box sx={{ marginTop: 4, width: "100%" }}>
        <Typography variant="h5" gutterBottom>
          Posts
        </Typography>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              content={post.content}
              tags={post.tags}
              spoiler={post.spoiler}
              username={usernames[post.user_id] || post.user_id}
              votes={post.votes}
            />
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No posts found.
          </Typography>
        )}
        <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
          Reviews
        </Typography>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              content={review.content}
              spoiler={review.spoiler}
              username={usernames[review.user_id] || review.user_id}
              rating={review.rating}
            />
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No reviews found.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default MovieDetails;
