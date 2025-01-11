package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/routes"
)

func main() {
	r := gin.Default()

	routes.SetupRoutes(r)

	log.Fatal(r.Run(":3000"))
}
