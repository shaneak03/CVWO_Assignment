import {
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

interface Movie {
  title: string;
  year: string;
  runtime: string;
  genre: string;
  director: string;
  actors: string;
  plot: string;
  poster: string;
  onClick?: () => void; 
}

const MovieCard = ({ title, year, runtime, genre, poster, onClick }: Movie) => {
  return (
    <div onClick={onClick}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default MovieCard;