package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/routes"
	"github.com/shaneak03/CVWO_Assignment/backend/utils"
)

func main() {
	r := gin.Default()

	// Use CORS middleware from utils
	r.Use(utils.SetupCORS())

	routes.SetupRoutes(r)

	log.Fatal(r.Run(":3000"))
}
