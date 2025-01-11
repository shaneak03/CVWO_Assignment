import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
} from "@mui/material";

// Define the interface for movies
interface Movie {
  title: string;
  year: number;
  duration: string;
  image: string;
  tag?: string; // e.g., HD, CAM
}

// Example movies list
const movies: Movie[] = [
  {
    title: "Sonic the Hedgehog 3",
    year: 2024,
    duration: "110m",
    image: "https://via.placeholder.com/150", // Replace with actual image URLs
    tag: "CAM",
  },
  {
    title: "Gladiator II",
    year: 2024,
    duration: "148m",
    image: "https://via.placeholder.com/150",
    tag: "HD",
  },
  {
    title: "Gladiator II",
    year: 2024,
    duration: "148m",
    image: "https://via.placeholder.com/150",
    tag: "HD",
  },
  {
    title: "Gladiator II",
    year: 2024,
    duration: "148m",
    image: "https://via.placeholder.com/150",
    tag: "HD",
  },
  {
    title: "Gladiator II",
    year: 2024,
    duration: "148m",
    image: "https://via.placeholder.com/150",
    tag: "HD",
  },
  {
    title: "Gladiator II",
    year: 2024,
    duration: "148m",
    image: "https://via.placeholder.com/150",
    tag: "HD",
  },

  {
    title: "Gladiator II",
    year: 2024,
    duration: "148m",
    image: "https://via.placeholder.com/150",
    tag: "HD",
  },
  // Add more movie objects
];

// Define the MovieCard component as a normal function
function MovieCard(props: Movie) {
  const { title, year, duration, image, tag } = props;

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
          {year} • {duration}
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
  return (
    <Box sx={{ padding: 3, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Movie Gallery
        </Typography>
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
                  year={movie.year}
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