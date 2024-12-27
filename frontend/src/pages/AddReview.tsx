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
import Navbar from "../components/Navbar";
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
    <>
      <Navbar />
      <div>
        <Grid
          container
          direction="column"
          style={{ height: "100vh" }}
          alignItems="center"
        >
          <Typography variant="h2" style={{ marginTop: "4rem", marginBottom: "1rem", textAlign: "center"
           }}>
            Add Review
          </Typography>
          <form style={{ width: "50%", textAlign: "center" }} onSubmit={submit}>
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
            <Button variant="contained" color="primary" type="submit" style={{ marginTop: "1rem" }}>
              Submit Post
            </Button>
          </form>
        </Grid>
      </div>
    </>
  );
}

export default AddReview;

