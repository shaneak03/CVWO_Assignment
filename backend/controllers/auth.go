package controllers

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/shaneak03/CVWO_Assignment/backend/utils"
)

var conn *pgx.Conn

func init() {
	var err error
	conn, err = pgx.Connect(context.Background(), os.Getenv("DB_URL"))
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func Register(c *gin.Context) {
	var req RegisterRequest

	// Log the raw request body
	body, err := c.GetRawData()
	if err != nil {
		log.Println("Error reading request body:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	log.Println("Raw request body:", string(body))

	// Bind JSON to struct
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Check if username already exists
	var existingUsername string
	err = conn.QueryRow(context.Background(), "SELECT username FROM users WHERE username=$1", req.Username).Scan(&existingUsername)
	if err == nil {
		log.Println("Username already exists:", req.Username)
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}

	// Check if email already exists
	var existingEmail string
	err = conn.QueryRow(context.Background(), "SELECT email FROM users WHERE email=$1", req.Email).Scan(&existingEmail)
	if err == nil {
		log.Println("Email already exists:", req.Email)
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	// Insert new user into the database with id, username, and email
	_, err = conn.Exec(context.Background(), "INSERT INTO users (id, username, email) VALUES ($1, $2, $3)", req.ID, req.Username, req.Email)
	if err != nil {
		log.Println("Error inserting new user:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

func Login(c *gin.Context) {
	// Handle OPTIONS request
	if c.Request.Method == http.MethodOptions {
		c.Status(http.StatusNoContent)
		return
	}

	// Debug: Print request method and URL
	log.Println("Request Method:", c.Request.Method)
	log.Println("Request URL:", c.Request.URL)

	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Debug: Print received username and password
	log.Println("Received Username:", req.Username)
	log.Println("Received Password:", req.Password)

	// Authenticate with Supabase
	var userID int
	err := conn.QueryRow(context.Background(), "SELECT id FROM users WHERE username=$1 AND password=$2", req.Username, req.Password).Scan(&userID)
	if err != nil {
		log.Println("Error authenticating with Supabase:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Debug: Print authenticated user ID
	log.Println("Authenticated User ID:", userID)

	token, err := utils.GenerateJWT(req.Username)
	if err != nil {
		log.Println("Error generating token:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	// Debug: Print generated token
	log.Println("Generated Token:", token)

	// Set token in HTTP-only cookie
	c.SetCookie("auth_token", token, int(time.Hour.Seconds()*24), "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}

func Logout(c *gin.Context) {
	// Handle OPTIONS request
	if c.Request.Method == http.MethodOptions {
		c.Status(http.StatusNoContent)
		return
	}

	c.SetCookie("auth_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
