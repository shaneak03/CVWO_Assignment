import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Rating,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { ENDPOINT } from "../App";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from '../hooks/User';

function EditReview() {
  const location = useLocation();
  const { reviewId, comment, rating, spoiler, movie_title } = location.state || {};
  const [content, setContent] = useState(comment || "");
  const [isSpoiler, setIsSpoiler] = useState(spoiler || false);
  const [currentRating, setCurrentRating] = useState<number>(rating || 5);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useUser();
  const [movieTitle, setMovieTitle] = useState(movie_title || "");
  const navigate = useNavigate();

  function handleContent(event: React.ChangeEvent<HTMLInputElement>) {
    setContent(event.target.value);
  }

  function handleSpoilerChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsSpoiler(event.target.checked);
  }

  function handleRatingChange(event: React.ChangeEvent<{}>, value: number | null) {
    setCurrentRating(value ?? 5);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const review = {
      movie: movieTitle,
      comment: content,
      spoiler: isSpoiler,
      rating: currentRating,
      user_id: userId
    };

    try {
      const response = await fetch(`${ENDPOINT}/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update review");
      }

      const data = await response.json();
      console.log(data);

      setError(null);

      // Alert user and redirect to profile
      alert("Review updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ height: "100vh", padding: "0 1rem" }}
    >
      <Box
        component="form"
        onSubmit={submit}
        sx={{
          width: { xs: "100%", sm: "75%", md: "50%", lg: "30%" },
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Edit Review
        </Typography>
        {error && (
          <Typography variant="body1" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          label="Review"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={20}
          onChange={handleContent}
          value={content}
        />
        <Box marginY={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isSpoiler}
                onChange={handleSpoilerChange}
                color="primary"
              />
            }
            label="Contains Spoilers"
          />
        </Box>
        <Box marginY={2}>
          <Typography gutterBottom>Movie Rating</Typography>
          <Rating
            name="movie-rating"
            value={currentRating}
            onChange={handleRatingChange}
            max={10}
            precision={1}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ marginTop: "1rem" }}
        >
          Update Review
        </Button>
      </Box>
    </Grid>
  );
}

export default EditReview;
