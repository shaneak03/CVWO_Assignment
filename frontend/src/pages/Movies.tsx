import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import PostCard from "../components/PostCard";
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

const test = "Lorem ipsum odor amet, consectetuer adipiscing elit. Potenti elit mauris aptent pellentesque accumsan placerat. Condimentum porttitor semper luctus tellus ad volutpat interdum cras. Nunc justo ligula gravida eget class sodales cras finibus. Accumsan tincidunt fermentum est duis laoreet urna suscipit. Magnis luctus commodo nec massa mattis fames. Convallis gravida auctor pharetra congue fermentum finibus. Nunc amet urna tempor cras orci, euismod duis malesuada. Adipiscing congue dapibus habitasse sapien tortor tristique eros vivamus? Litora sapien duis est ultricies praesent praesent ac. Purus arcu litora per senectus orci. Nec rutrum a sagittis commodo lacus pulvinar volutpat dictumst luctus. Diam fermentum torquent imperdiet parturient odio blandit mi dictum class. Fringilla sapien quis eget faucibus pellentesque sapien quis. Inceptos nulla bibendum penatibus mi fames duis. Luctus purus ac laoreet condimentum dignissim mi eleifend. Magna ex litora ex interdum neque ex suspendisse interdum varius. Odio nec mus habitant scelerisque netus ad. Rhoncus ornare sem varius, varius dictum tristique magnis. Dolor primis risus himenaeos mi habitant turpis. Morbi felis inceptos volutpat parturient lacinia hac integer. Fringilla morbi aliquam tincidunt parturient duis et mauris nisl. Dapibus maecenas malesuada montes facilisis sagittis eleifend varius ridiculus. Turpis lectus pharetra lobortis dignissim auctor rhoncus ac at quam. Phasellus in dictum turpis erat nisl habitant. Nullam dignissim malesuada class facilisis lectus; malesuada ante? Per lacinia hac aliquet sit, pellentesque magna! Eget id ultricies felis elementum turpis. Fringilla condimentum suspendisse vel turpis suscipit interdum aliquet dui vulputate. Curabitur cras feugiat lorem parturient penatibus malesuada integer. Sagittis maximus hac ut donec natoque; inceptos blandit. Orci lobortis senectus turpis auctor aliquam. Augue dui litora tristique elit aenean fermentum odio ante ad. Sem dapibus felis viverra enim proin. Aeleifend condimentum adipiscing pharetra nunc laoreet ante mi. Luctus conubia convallis duis mus nulla scelerisque phasellus lectus nostra. Ipsum nam quis phasellus molestie litora. Dolor taciti class mauris ipsum sapien placerat! Gravida ridiculus integer id aliquam accumsan inceptos. Porttitor congue sapien hendrerit nam, lectus morbi dignissim pulvinar lectus. Suspendisse quam ex justo libero amet vel."

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
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
      <ReviewCard content={test} rating={7} spoiler={false} creator="me"/>
      <PostCard title="blah" content={test} tags={["none"]} spoiler={true} creator="me" votes={4}/>
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
        <Grid container columnSpacing={3} rowSpacing={3}>
          {movies.map((movie, index) => (
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
      </Box>
    </Box>
  );
}

export default Movies;