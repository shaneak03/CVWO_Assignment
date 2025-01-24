import React, { useState } from "react";
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

function PostCard({
  title,
  content,
  tags,
  spoiler,
  creator,
  votes,
}: {
  title: string;
  content: string;
  tags: string[];
  spoiler: boolean;
  creator: string;
  votes: number;
}) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const netVotes = upvoted ? 1 : downvoted ? -1 : 0;

  function handleShowMore() {
    setShowFullContent(!showFullContent);
  }

  function handleUpvote() {
    if (upvoted) {
      setUpvoted(false);
    } else {
      setUpvoted(true);
      setDownvoted(false);
    }
  }

  function handleDownvote() {
    if (downvoted) {
      setDownvoted(false);
    } else {
      setDownvoted(true);
      setUpvoted(false);
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
            {creator[0].toUpperCase()}
          </Avatar>
        }
        title={creator}
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
          <Typography variant="body2">{votes + netVotes}</Typography>
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
