import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { useParams } from "react-router-dom";

const ENDPOINT = "http://localhost:3000";

interface MovieDetailsProps {
  imdbID: string;
}

interface Movie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

function MovieDetails() {
  const { imdbID } = useParams<{ imdbID: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function fetchMovieDetails() {
      const response = await fetch(`${ENDPOINT}/movie/${imdbID}`);
      const data = await response.json();
      setMovie(data);
    }

    fetchMovieDetails();
  }, [imdbID]);

  if (!movie) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardMedia
          component="img"
          height="500"
          image={movie.Poster}
          alt={movie.Title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {movie.Title} ({movie.Year})
          </Typography>
          <Typography variant="body1" gutterBottom>
            {movie.Plot}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Director: {movie.Director}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Actors: {movie.Actors}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Genre: {movie.Genre}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            IMDb Rating: {movie.imdbRating}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default MovieDetails;
