import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { red } from "@mui/material/colors";

const ENDPOINT = import.meta.env.VITE_SERVER_API_URL;

function Comment({ user_id, content }: { user_id: string; content: string }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchUsername() {
      try {
        const response = await fetch(`${ENDPOINT}/api/users/${user_id}`);
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    }
    fetchUsername();
  }, [user_id]);

  return (
    <Card sx={{ margin: "0.5rem 0", padding: "0.5rem", boxShadow: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
        <Avatar sx={{ bgcolor: red[500], marginRight: "0.5rem" }}>
          {username ? username[0]?.toUpperCase() : ""}
        </Avatar>
        <Typography variant="subtitle1">{username}</Typography>
      </Box>
      <CardContent>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Comment;
