package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/shaneak03/CVWO_Assignment/backend/models"
	"github.com/shaneak03/CVWO_Assignment/backend/routes"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

func init() {
	// Load environment variables
	initialisers.LoadEnvVariables()
	initialisers.ConnectToDb()

	// Run migrations
	initialisers.DB.AutoMigrate(&models.Movie{}, &models.Review{}, &models.WebPost{})
}

func main() {
	// Ensure Gin logger is configured to print logs to the console
	gin.SetMode(gin.DebugMode)
	gin.DefaultWriter = os.Stdout

	r := gin.Default()

	// Apply CORS middleware
	r.Use(initialisers.SetupCORS())

	// Setup routes
	routes.SetupRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not set
	}

	// Log server start
	log.Println("Starting server on port " + port)

	err := r.Run("0.0.0.0:" + port)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
