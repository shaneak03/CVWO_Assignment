package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/controllers"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

func SetupRoutes(router *gin.Engine) {
	// Apply CORS middleware
	router.Use(initialisers.SetupCORS())

	// Apply JWT middleware to protect routes
	router.Use(initialisers.JWTMiddleware())

	// Authentication routes
	router.POST("/api/register", controllers.Register)
	router.POST("/api/login", controllers.Login)
	router.POST("/api/logout", controllers.Logout)

	// WebPost routes
	router.GET("/api/webposts", controllers.GetWebPosts)
	router.POST("/api/webposts", controllers.CreateWebPost)
	router.PATCH("/api/webposts/:id", controllers.UpdateWebPost)
}
