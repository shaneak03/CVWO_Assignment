import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Box, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; 

const ENDPOINT = "http://localhost:3000";

interface LoginProps {
  onLoginSuccess: () => void; 
}

function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${ENDPOINT}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (response.ok) {
        onLoginSuccess();
        navigate("/");
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
    }
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ height: "100vh" }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        style={{
          width: "30%",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(event) => setUsername(event.target.value.trim())}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value.trim())}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          style={{ marginTop: "1rem" }}
        >
          Login
        </Button>
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Button
            variant="text"
            color="primary"
            component={Link} 
            to="/register"
            style={{ textDecoration: "none" }}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}

export default Login;