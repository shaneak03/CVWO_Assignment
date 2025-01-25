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

function EditWebPost() {
  const location = useLocation();
  const { postId, title, content, tags, spoiler, movie } = location.state || {};
  const [postTitle, setPostTitle] = useState(title || "");
  const [postContent, setPostContent] = useState(content || "");
  const [isSpoiler, setIsSpoiler] = useState(spoiler || false);
  const [postTags, setPostTags] = useState<string[]>(tags || []);
  const [error, setError] = useState<string | null>(null);
  const [movieTitle, setMovieTitle] = useState(movie || "");
  const navigate = useNavigate();

  function handleTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setPostTitle(event.target.value);
  }

  function handleContent(event: React.ChangeEvent<HTMLInputElement>) {
    setPostContent(event.target.value);
  }

  function handleTagChange(event: SelectChangeEvent<string[]>) {
    setPostTags(event.target.value as string[]);
  }

  function handleSpoilerChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsSpoiler(event.target.checked);
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
      title: postTitle,
      content: postContent,
      user_id: data.session.user.id,
      movie: movieTitle,
      tags: postTags,
      spoiler: isSpoiler,
    };

    try {
      const response = await fetch(`${ENDPOINT}/api/webposts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify(webpost),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update web post");
      }

      const responseData = await response.json();
      console.log(responseData);

      setError(null);

      // Alert user and redirect to profile
      alert("Web post updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating web post:", err);
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
              Edit Post
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
              value={postTitle}
            />
            <TextField
              label="Post Content"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={20}
              onChange={handleContent}
              value={postContent}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="tags-label">Tags</InputLabel>
              <Select
                labelId="tags-label"
                id="tags"
                multiple
                value={postTags}
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
                    checked={isSpoiler}
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
              Update Post
            </Button>
          </Box>
        </Grid>
      </div>
    </>
  );
}

export default EditWebPost;