import { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
  Box,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { ENDPOINT } from "../App";

function AddWebPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(5);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleTagChange = (event: SelectChangeEvent<string[]>) => {
    setTags(event.target.value as string[]);
  };

  const handleSpoilerChange = (_: Event, value: number | number[]) => {
    setSpoiler(value === 1);
  };

  const handleRatingChange = (_: Event, value: number | number[]) => {
    setRating(value as number);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const webpost = {
      author: "me",
      title,
      content,
      spoiler,
      tags,
      rating,
      date: new Date(),
    };

    try {
      const response = await fetch(`${ENDPOINT}/api/webposts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webpost),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);

      // Reset Form
      setTitle("");
      setContent("");
      setSpoiler(false);
      setTags([]);
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
          Add a New Post
        </Typography>
        <form style={{ width: "50%", textAlign: "center" }} onSubmit={submit}>
          <TextField
            label="Post Title"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleTitle}
            value={title}
          />
          <TextField
            label="Post Content"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={5}
            onChange={handleContent}
            value={content}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              id="tags"
              multiple
              value={tags}
              onChange={handleTagChange}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="Horror">Horror</MenuItem>
              <MenuItem value="Fantasy">Fantasy</MenuItem>
              <MenuItem value="Action">Action</MenuItem>
              <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
              <MenuItem value="Romance">Romance</MenuItem>
            </Select>
          </FormControl>
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

export default AddWebPost;
