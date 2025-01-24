package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/shaneak03/CVWO_Assignment/backend/routes"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

func init() {
	// Load environment variables
	initialisers.LoadEnvVariables()
	initialisers.ConnectToDb()
}

func main() {

	r := gin.Default()

	//middleware

	//CORS configuration to allow Authorization header
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Authorization"},
		AllowCredentials: true,
	}))

	// Setup routes
	routes.SetupRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not set
	}

	// Log server start
	log.Println("Starting server on port " + port)

	err := r.Run(":" + port)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
