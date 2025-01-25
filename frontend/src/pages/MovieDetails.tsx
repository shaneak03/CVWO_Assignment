import React from "react";
import { Box, Typography, Card, CardMedia, CardContent, Container, Grid, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

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

const MovieDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state.movie as Movie;

  const handleAddPost = () => {
    navigate("/addwebpost", { state: { movieTitle: movie.title } });
  };

  const handleAddReview = () => {
    navigate("/addreview", { state: { movieTitle: movie.title } });
  };

  return (
    <Container maxWidth="md" sx={{ padding: 3 }}>
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
    </Container>
  );
};

export default MovieDetails;
