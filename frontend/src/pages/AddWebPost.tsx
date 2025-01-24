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
  Box,
  Chip,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { ENDPOINT } from "../App";

function AddWebPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  function handleTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleContent(event: React.ChangeEvent<HTMLInputElement>) {
    setContent(event.target.value);
  }

  function handleTagChange(event: SelectChangeEvent<string[]>) {
    setTags(event.target.value as string[]);
  }

  function handleSpoilerChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSpoiler(event.target.checked);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const webpost = {
      author: "me",
      title,
      content,
      spoiler,
      tags,
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
    } catch (error) {
      console.error("Error posting web post:", error);
    }
  }

  return (
    <>
      <div>
        <Grid
          container
          direction="column"
          style={{ height: "100vh", padding: "0 1rem" }}
          alignItems="center"
          justifyContent="center"
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
              Add a New Post
            </Typography>
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
              rows={20}
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
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ marginTop: "1rem" }}
            >
              Submit Post
            </Button>
          </Box>
        </Grid>
      </div>
    </>
  );
}

export default AddWebPost;

