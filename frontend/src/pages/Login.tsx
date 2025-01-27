import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography, Box, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import { useUser } from "../hooks/User";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.status === 400) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(error.message);
      }
    } else {
      navigate("/");
    }
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ height: "100vh", padding: "0 1rem" }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: { xs: "100%", sm: "75%", md: "50%", lg: "30%" },
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          Login to Start Posting and Reviewing
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(event) => setEmail(event.target.value.trim())}
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
          sx={{ marginTop: "1rem" }}
        >
          Login
        </Button>
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Button
            variant="text"
            color="primary"
            component={Link}
            to="/register"
            sx={{ textDecoration: "none" }}
          >
            Don't have an account? Register
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Button
            variant="text"
            color="primary"
            component={Link}
            to="/"
            sx={{ textDecoration: "none" }}
          >
            Back to Homepage
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}

export default Login;