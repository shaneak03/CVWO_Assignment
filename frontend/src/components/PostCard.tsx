import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  CardHeader,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import { red } from "@mui/material/colors";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useUser } from "../hooks/User";

const ENDPOINT = import.meta.env.VITE_SERVER_API_URL;

function PostCard({
  id,
  title,
  content,
  tags,
  spoiler,
  username,
  votes,
  hasUpvoted,
  hasDownvoted,
}: {
  id: number;
  title: string;
  content: string;
  tags: string[];
  spoiler: boolean;
  username: string;
  votes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [upvoted, setUpvoted] = useState(hasUpvoted);
  const [downvoted, setDownvoted] = useState(hasDownvoted);
  const [currentVotes, setCurrentVotes] = useState(votes);

  const { userId } = useUser();

  useEffect(() => {
    setUpvoted(hasUpvoted);
    setDownvoted(hasDownvoted);
  }, [hasUpvoted, hasDownvoted]);

  function handleShowMore() {
    setShowFullContent(!showFullContent);
  }

  async function handleUpvote() {
    try {
      if (upvoted) {
        setUpvoted(false);
        setCurrentVotes(currentVotes - 1);
      } else {
        setUpvoted(true);
        setDownvoted(false);
        setCurrentVotes(currentVotes + 1);
      }
      await fetch(`${ENDPOINT}/api/webposts/${id}/upvote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  }

  async function handleDownvote() {
    try {
      if (downvoted) {
        setDownvoted(false);
        setCurrentVotes(currentVotes + 1);
      } else {
        setDownvoted(true);
        setUpvoted(false);
        setCurrentVotes(currentVotes - 1);
      }
      await fetch(`${ENDPOINT}/api/webposts/${id}/downvote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });
    } catch (error) {
      console.error("Error downvoting post:", error);
    }
  }

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: "75%", md: "50%" },
        margin: "1rem auto",
        padding: "1rem",
        boxShadow: 3,
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {username ? username[0]?.toUpperCase() : ""}
          </Avatar>
        }
        title={username}
      />

      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 1 }}>
          {title}
        </Typography>

        {spoiler && (
          <Typography
            variant="subtitle2"
            color="error"
            sx={{ marginBottom: "0.5rem", fontWeight: "bold", textAlign: "center" }}
          >
            ⚠️ Spoiler Warning
          </Typography>
        )}

        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {showFullContent ? content : spoiler ? "" : `${content.slice(0, 180)}...`}
        </Typography>

        <Box sx={{ marginTop: 1 }}>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
            Tags:
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {tags.map((tag, index) => (
              <Chip key={index} label={tag} size="small" color="primary" />
            ))}
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={handleUpvote}
            color={upvoted ? "primary" : "default"}
          >
            <ArrowUpwardIcon />
          </IconButton>
          <Typography variant="body2">{currentVotes}</Typography>
          <IconButton
            onClick={handleDownvote}
            color={downvoted ? "error" : "default"}
          >
            <ArrowDownwardIcon />
          </IconButton>
        </Box>
        <Button size="small" variant="contained" onClick={handleShowMore}>
          {showFullContent ? "Show Less" : "Show More"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default PostCard;
