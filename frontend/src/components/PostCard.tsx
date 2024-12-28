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
} from "@mui/material";
import { red } from "@mui/material/colors";

function PostCard({
  title,
  content,
  tags,
  spoiler,
  creator,
}: {
  title: string;
  content: string;
  tags: string[];
  spoiler: boolean;
  creator: string;
}) {
  const [showFullContent, setShowFullContent] = useState(false);

  function handleShowMore() {
    setShowFullContent(!showFullContent);
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
        <Button size="small" variant="contained" onClick={handleShowMore}>
          {showFullContent ? "Show Less" : "Show More"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default PostCard;
