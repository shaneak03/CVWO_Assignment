import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
} from "@mui/material";

// Define the interface for movies
interface Movie {
  title: string;
  date: number;
  duration: string;
  image: string;
  tag?: string; // e.g., HD, CAM
}

// Example movies list
const moviesList: Movie[] = [
  {
    title: "Sonic the Hedgehog 3",
    date: 2024,
    duration: "110m",
    image: "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/sonic-the-hedgehog-3/images/regions/us/updates1/onesheet.jpg", // Replace with actual image URLs
    tag: "CAM",
  },
  {
    title: "Gladiator II",
    date: 2024,
    duration: "148m",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDW7KlflpfkA6h6yNVGer-0wdrygFb9R7BIQ&s",
    tag: "HD",
  },
  {
    title: "Avatar 3",
    date: 2025,
    duration: "192m",
    image: "https://via.placeholder.com/150",
    tag: "HD",
  },
  {
    title: "The Batman 2",
    date: 2025,
    duration: "150m",
    image: "https://via.placeholder.com/150",
    tag: "HD",
  },
  {
    title: "Gladiator II",
    date: 2024,
    duration: "148m",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDW7KlflpfkA6h6yNVGer-0wdrygFb9R7BIQ&s",
    tag: "HD",
  },
  {
    title: "Gladiator II",
    date: 2024,
    duration: "148m",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDW7KlflpfkA6h6yNVGer-0wdrygFb9R7BIQ&s",
    tag: "HD",
  },
  // Add more movie objects
];

// Define the MovieCard component as a normal function
function MovieCard(props: Movie) {
  const { title, date, duration, image, tag } = props;

  return (
    <Card sx={{ maxWidth: 200, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="300"
        image={image}
        alt={title}
        sx={{ position: "relative" }}
      />
      <CardContent>
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {date} • {duration}
        </Typography>
        {tag && (
          <Chip
            label={tag}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "black",
              color: "white",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Define the MovieGrid component as a normal function
function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>(moviesList);

  const sortByDate = () => {
    const sorted = [...movies].sort((a, b) => b.date - a.date);
    setMovies(sorted);
  };

  const sortAlphabetically = () => {
    const sorted = [...movies].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setMovies(sorted);
  };

  return (
    <Box
      sx={{
        padding: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box>
        <Typography variant="h4" gutterBottom>
          Movie Gallery
        </Typography>
        <Box sx={{ display: "flex", gap: 2, marginBottom: 3 }}>
          <Button variant="contained" onClick={sortByDate}>
            Sort by Date
          </Button>
          <Button variant="contained" onClick={sortAlphabetically}>
            Sort Alphabetically
          </Button>
        </Box>
        <Grid
          container
          columnSpacing={3}
          rowSpacing={3}
        >
          {movies.map(function (movie, index) {
            return (
              <Grid item xs={6} sm={4} md={3} lg={3} key={index}>
                <MovieCard
                  title={movie.title}
                  date={movie.date}
                  duration={movie.duration}
                  image={movie.image}
                  tag={movie.tag}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}

export default MovieGrid;