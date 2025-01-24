import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
} from "@mui/material";

// Define the interface for movies
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

// Example movies list
const moviesList: Movie[] = [
  {
    title: "Sonic the Hedgehog 3",
    year: "2024",
    runtime: "110m",
    genre: "Action, Adventure, Comedy",
    director: "Jeff Fowler",
    actors: "Ben Schwartz, Idris Elba, Jim Carrey",
    plot: "Sonic and his friends must stop Dr. Robotnik from taking over the world.",
    poster: "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/sonic-the-hedgehog-3/images/regions/us/updates1/onesheet.jpg",
  },
  {
    title: "Gladiator II",
    year: "2024",
    runtime: "148m",
    genre: "Action, Drama, History",
    director: "Ridley Scott",
    actors: "Russell Crowe, Joaquin Phoenix, Connie Nielsen",
    plot: "The story of a gladiator who seeks revenge for the death of his family.",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDW7KlflpfkA6h6yNVGer-0wdrygFb9R7BIQ&s",
  },
  {
    title: "Avatar 3",
    year: "2025",
    runtime: "192m",
    genre: "Action, Adventure, Fantasy",
    director: "James Cameron",
    actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
    plot: "The continuation of the epic saga of the Na'vi people on Pandora.",
    poster: "https://via.placeholder.com/150",
  },
  {
    title: "The Batman 2",
    year: "2025",
    runtime: "150m",
    genre: "Action, Crime, Drama",
    director: "Matt Reeves",
    actors: "Robert Pattinson, Zoë Kravitz, Paul Dano",
    plot: "Batman faces new challenges and villains in Gotham City.",
    poster: "https://via.placeholder.com/150",
  },
  {
    title: "Gladiator II",
    year: "2024",
    runtime: "148m",
    genre: "Action, Drama, History",
    director: "Ridley Scott",
    actors: "Russell Crowe, Joaquin Phoenix, Connie Nielsen",
    plot: "The story of a gladiator who seeks revenge for the death of his family.",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDW7KlflpfkA6h6yNVGer-0wdrygFb9R7BIQ&s",
  },
  {
    title: "Gladiator II",
    year: "2024",
    runtime: "148m",
    genre: "Action, Drama, History",
    director: "Ridley Scott",
    actors: "Russell Crowe, Joaquin Phoenix, Connie Nielsen",
    plot: "The story of a gladiator who seeks revenge for the death of his family.",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDW7KlflpfkA6h6yNVGer-0wdrygFb9R7BIQ&s",
  },
  // Add more movie objects
];

// Fetch movies from an API
const fetchMovies = async () => {
  try {
    const response = await fetch("https://api.example.com/movies");
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return moviesList; // Fallback to the example movies list
  }
};

const MovieCard = ({ title, year, runtime, genre, director, actors, plot, poster }:Movie) => {
  return (
    <Card sx={{ maxWidth: 200, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="300"
        image={poster}
        alt={title}
        sx={{ position: "relative" }}
      />
      <CardContent>
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {year} • {runtime}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Genre: {genre}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Director: {director}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Actors: {actors}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Plot: {plot}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Define the MovieGrid component as a normal function
function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const loadMovies = async () => {
      const fetchedMovies = await fetchMovies();
      setMovies(fetchedMovies);
    };
    loadMovies();
  }, []);

  const sortByDate = () => {
    const sorted = [...movies].sort((a, b) => parseInt(b.year) - parseInt(a.year));
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
                  year={movie.year}
                  runtime={movie.runtime}
                  genre={movie.genre}
                  director={movie.director}
                  actors={movie.actors}
                  plot={movie.plot}
                  poster={movie.poster}
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