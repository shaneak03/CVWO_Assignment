import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Rating,
  Button,
  CardHeader,
  Avatar,
} from "@mui/material";
import { red } from "@mui/material/colors";

function ReviewCard({
  content,
  rating,
  spoiler,
  username,
}: {
  content: string;
  rating: number;
  spoiler: boolean;
  username: string;
}) {
  const [showFullContent, setShowFullContent] = useState(false);

  function handleShowMore() {
    setShowFullContent(!showFullContent);
  }

  return (
    <Card
      sx={{
        maxWidth: { xs: "100%", sm: "75%", md: "50%" },
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
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ marginRight: 1 }}>
            {rating}
          </Typography>
          <Rating name="read-only" value={rating} readOnly max={10} />
        </Box>

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
      </CardContent>

      <CardActions sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button size="small" variant="contained" onClick={handleShowMore}>
          {showFullContent ? "Show Less" : "Show More"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default ReviewCard;
