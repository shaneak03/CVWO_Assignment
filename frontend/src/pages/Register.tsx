import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Box, Alert } from "@mui/material";
import { Link } from "react-router-dom"; 

const ENDPOINT = "http://localhost:3000";

interface RegisterProps {
  onRegisterSuccess: () => void; 
}

function Register({ onRegisterSuccess }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = fetch(`${ENDPOINT}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }), 
      });

      response.then((res) => {
        if (res.ok) {
          onRegisterSuccess();
        } else {
          res.text().then((errorText) => {
            setError(errorText);
          });
        }
      });
    } catch (err) {
      setError("An error occurred while registering. Please try again.");
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
        onSubmit={handleRegister}
        style={{
          width: "30%",
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
          style={{ marginTop: "1rem" }}
        >
          Register
        </Button>
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Button
            variant="text"
            color="primary"
            component={Link} 
            to="/login"
            style={{ textDecoration: "none" }}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}

export default Register;