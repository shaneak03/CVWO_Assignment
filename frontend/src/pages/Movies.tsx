import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";

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

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genreFilter, setGenreFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovies() {
      try {
        // Log the ENDPOINT value
        console.log("API Endpoint:", ENDPOINT);

        const response = await fetch(`${ENDPOINT}/api/movies`);
        const data = await response.json();
        console.log("Fetched movies:", data);
        if (Array.isArray(data)) {
          setMovies(data);
          // Log the fetched movies
          console.log("Movies data:", data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const sortByDate = () => {
    const sorted = [...movies].sort((a, b) => parseInt(b.year) - parseInt(a.year));
    setMovies(sorted);
    console.log("Sorted movies by date:", sorted);
  };

  const sortAlphabetically = () => {
    const sorted = [...movies].sort((a, b) => a.title.localeCompare(b.title));
    setMovies(sorted);
    console.log("Sorted movies alphabetically:", sorted);
  };

  const handleCardClick = (movie: Movie) => {
    navigate(`/movie/${movie.title}`, { state: { movie } });
  };

  const handleGenreFilterChange = (event: SelectChangeEvent) => {
    setGenreFilter(event.target.value as string);
  };

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.genre.toLowerCase().includes(genreFilter.toLowerCase()) &&
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <Box sx={{ paddingTop: 2 }}>
        {loading ? (
          <Typography variant="h4" align="center">
            Loading movies...
          </Typography>
        ) : (
          <>
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
              <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Genre</InputLabel>
                <Select
                  value={genreFilter}
                  onChange={handleGenreFilterChange}
                  label="Filter by Genre"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Action">Action</MenuItem>
                  <MenuItem value="Comedy">Comedy</MenuItem>
                  <MenuItem value="Drama">Drama</MenuItem>
                  <MenuItem value="Horror">Horror</MenuItem>
                  <MenuItem value="Romance">Romance</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Search by Title"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                sx={{ minWidth: 200 }}
              />
            </Box>
            <Grid container columnSpacing={3} rowSpacing={3} justifyContent={filteredMovies.length <= 4 ? "center" : "flex-start"}>
              {filteredMovies.map((movie, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                  <MovieCard
                    title={movie.title}
                    year={movie.year}
                    runtime={movie.runtime}
                    genre={movie.genre}
                    director={movie.director}
                    actors={movie.actors}
                    plot={movie.plot}
                    poster={movie.poster}
                    onClick={() => handleCardClick(movie)}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
  );
}

export default Movies;