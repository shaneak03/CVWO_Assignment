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
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../supabase";

const ENDPOINT = import.meta.env.VITE_SERVER_API_URL;

function AddWebPost() {
  const location = useLocation();
  const movieTitle = location.state?.movieTitle || "";
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      console.error("Error fetching session:", error);
      setError("Failed to fetch session. Please try again.");
      return;
    }

    const webpost = {
      title,
      content,
      user_id: data.session.user.id,
      movie: movieTitle, // Use movie title from state
      tags,
      spoiler,
    };

    try {
      const response = await fetch(`${ENDPOINT}/api/webposts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify(webpost),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit web post");
      }

      const responseData = await response.json();
      console.log(responseData);

      // Reset Form
      setTitle("");
      setContent("");
      setSpoiler(false);
      setTags([]);
      setError(null);

      // Alert user and redirect to home
      alert("Web post submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error posting web post:", err);
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
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
            {error && (
              <Typography variant="body1" color="error" align="center" gutterBottom>
                {error}
              </Typography>
            )}
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
                <MenuItem value="Historical">Historical</MenuItem>
                <MenuItem value="Comedy">Comedy</MenuItem>
                <MenuItem value="Drama">Drama</MenuItem>
                <MenuItem value="Thriller">Thriller</MenuItem>
                <MenuItem value="Mystery">Mystery</MenuItem>
                <MenuItem value="Adventure">Adventure</MenuItem>
                <MenuItem value="Documentary">Documentary</MenuItem>
                <MenuItem value="Crime">Crime</MenuItem>
                <MenuItem value="Animation">Animation</MenuItem>
                <MenuItem value="War">War</MenuItem>
                <MenuItem value="Superhero">Superhero</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Movie"
              value={movieTitle}
              fullWidth
              margin="normal"
              disabled
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

