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

  useEffect(() => {
    async function fetchPostsAndReviews() {
      try {
        const postsResponse = await fetch(`${ENDPOINT}/api/webposts?movie=${movie.title}`);
        const postsData = await postsResponse.json();
        setPosts(postsData);

        const reviewsResponse = await fetch(`${ENDPOINT}/api/reviews?movie=${movie.title}`);
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
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
        {posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            content={post.content}
            tags={post.tags}
            spoiler={post.spoiler}
            user_id={post.user_id}
            votes={post.votes}
          />
        ))}
        <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
          Reviews
        </Typography>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            content={review.content}
            spoiler={review.spoiler}
            user_id={review.user_id}
            rating={review.rating}
          />
        ))}
      </Box>
    </Container>
  );
};

export default MovieDetails;
