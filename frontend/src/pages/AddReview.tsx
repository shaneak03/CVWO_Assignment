import { useState } from "react";
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

function AddReview() {
  const location = useLocation();
  const [content, setContent] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useUser();
  const movieTitle = location.state?.movieTitle || "";
  const navigate = useNavigate();

  function handleContent(event: React.ChangeEvent<HTMLInputElement>) {
    setContent(event.target.value);
  }

  function handleSpoilerChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSpoiler(event.target.checked);
  }

  function handleRatingChange(event: React.ChangeEvent<{}>) {
    const value = (event.target as HTMLInputElement).value;
    setRating(Number(value));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const review = {
      movie: movieTitle,
      content,
      spoiler,
      rating,
      user_id: userId
    };

    try {
      const response = await fetch(`${ENDPOINT}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const data = await response.json();
      console.log(data);

      setContent("");
      setSpoiler(false);
      setRating(5);
      setError(null);

      alert("Review submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to submit review:", error);
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
          Add Review
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
                checked={spoiler}
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
            value={rating}
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
          Submit Review
        </Button>
      </Box>
    </Grid>
  );
}

export default AddReview;

