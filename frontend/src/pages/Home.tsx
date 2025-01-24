import React from "react";
import { Box, Typography } from "@mui/material";

function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: 3,
      }}
    >
      <img
        src="https://img.freepik.com/free-vector/editable-vector-grunge-film-frame-nice-element-your-projects_460848-12205.jpg?t=st=1737723270~exp=1737726870~hmac=79f14a624bd082b9d4863350a2faf823c0e24447bab19f201423ae9697039b4e&w=1380"
        alt="Logo"
        style={{ marginBottom: 20, width: "30%", height: "auto" }}
      />
      <Typography variant="h2" gutterBottom>
        Welcome to the Movie Forum
      </Typography>
      <Typography variant="h5" color="textSecondary">
        Discuss and Review a wide range of movies from different genres and eras to your heart's content!
      </Typography>
    </Box>
  );
}

export default Home;