import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Box, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabase";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const createUser = async (userData: { id: string; username: string; email: string }) => {
    const res = await fetch(`${import.meta.env.VITE_SERVER_API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error creating user");
    }
  };

  const onSignUp = async (formData: any) => {
    let { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (error) throw new Error(error.message);
    await createUser({
      id: data.user?.id || "",
      username: formData.username,
      email: formData.email,
    });
  };

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const formData = {
      username,
      email,
      password,
    };

    try {
      await onSignUp(formData);
      console.log("Registration successful, navigating to homepage...");
      navigate("/");
    } catch (err: any) {
      console.error("Error during registration:", err);
      setError(err.message);
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
        onSubmit={handleRegister}
        sx={{
          width: { xs: "100%", sm: "75%", md: "50%", lg: "30%" },
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
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
        <TextField
          label="Confirm Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value.trim())}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ marginTop: "1rem" }}
        >
          Register
        </Button>
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Button
            variant="text"
            color="primary"
            component={Link}
            to="/login"
            sx={{ textDecoration: "none" }}
          >
            Already have an account? Login
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

export default Register;