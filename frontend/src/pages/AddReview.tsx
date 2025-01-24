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

function AddReview() {
  const [content, setContent] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [rating, setRating] = useState<number>(5);

  function handleContent(event: React.ChangeEvent<HTMLInputElement>) {
    setContent(event.target.value);
  }

  function handleSpoilerChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSpoiler(event.target.checked);
  }

  function handleRatingChange(event: React.ChangeEvent<{}>, value: number | null) {
    setRating(value ?? 5);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const review = {
      author: "me",
      content,
      spoiler,
      rating,
      date: new Date(),
    };

    try {
      const response = await fetch(`${ENDPOINT}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);

      setContent("");
      setSpoiler(false);
      setRating(5);
    } catch (error) {
      console.error("Error posting review:", error);
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

