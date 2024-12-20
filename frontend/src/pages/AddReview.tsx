import { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Slider,
  Box,
} from "@mui/material";
import { ENDPOINT } from "../App";

function AddReview() {
  const [content, setContent] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [rating, setRating] = useState<number>(5);

  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleSpoilerChange = (_: Event, value: number | number[]) => {
    setSpoiler(value === 1);
  };

  const handleRatingChange = (_: Event, value: number | number[]) => {
    setRating(value as number);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      console.error("Error posting web post:", error);
    }
  };

  return (
    <div>
      <Grid
        container
        direction="column"
        style={{ height: "100vh" }}
        alignItems="center"
      >
        <Typography variant="h2" style={{ marginTop: "4rem", marginBottom: "1rem" }}>
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
            <Typography gutterBottom>Does this post contain spoilers?</Typography>
            <Slider
              value={spoiler ? 1 : 0}
              step={1}
              marks={[
                { value: 0, label: "No Spoilers" },
                { value: 1, label: "Contains Spoilers" },
              ]}
              min={0}
              max={1}
              valueLabelDisplay="auto"
              onChange={handleSpoilerChange}
            />
          </Box>
          <Box marginY={2}>
            <Typography gutterBottom>Movie Rating</Typography>
            <Slider
              value={rating}
              step={1}
              marks
              min={1}
              max={10}
              valueLabelDisplay="on"
              onChange={handleRatingChange}
            />
          </Box>
          <Button variant="contained" color="primary" type="submit" style={{ marginTop: "1rem" }}>
            Submit Post
          </Button>
        </form>
      </Grid>
    </div>
  );
}

export default AddReview;
