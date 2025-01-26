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
  TextField,
} from "@mui/material";
import { red } from "@mui/material/colors";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useUser } from "../hooks/User";
import Comment from "./Comment";

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
  comments = [],
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
  comments: { user_id: string; content: string }[];
}) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [upvoted, setUpvoted] = useState(hasUpvoted);
  const [downvoted, setDownvoted] = useState(hasDownvoted);
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [showCommentField, setShowCommentField] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState(comments);

  const { userId } = useUser();

  useEffect(() => {
    setUpvoted(hasUpvoted);
    setDownvoted(hasDownvoted);
  }, [hasUpvoted, hasDownvoted]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`${ENDPOINT}/api/webposts/${id}/comments`);
        const data = await response.json();
        setPostComments(data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    fetchComments();
  }, [id]);

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

  function handleShowCommentField() {
    setShowCommentField(!showCommentField); 
  }

  function handleCommentChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewComment(event.target.value);
  }

  async function handleAddComment() {
    if (newComment.trim() === "") return;

    try {
      const response = await fetch(`${ENDPOINT}/api/webposts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, content: newComment })
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setPostComments([...postComments, newCommentData]);
        setNewComment("");
        setShowCommentField(false);
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
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

      {showFullContent && (
        <>
          <CardContent>
            <Typography variant="h6" sx={{ marginTop: "1rem" }}>
              Comments
            </Typography>
            {postComments.length > 0 ? (
              postComments.map((comment, index) => (
                <Comment key={index} user_id={comment.user_id} content={comment.content} />
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No comments yet.
              </Typography>
            )}
          </CardContent>
          <CardActions sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button size="small" variant="outlined" onClick={handleShowCommentField}>
              {showCommentField ? "Cancel" : "Add Comment"}
            </Button>
            {showCommentField && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 1 }}>
                <TextField
                  label="Write a comment"
                  variant="outlined"
                  fullWidth
                  value={newComment}
                  onChange={handleCommentChange}
                />
                <Button size="small" variant="contained" onClick={handleAddComment}>
                  Submit
                </Button>
              </Box>
            )}
          </CardActions>
        </>
      )}
    </Card>
  );
}

export default PostCard;
