package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/controllers"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

func SetupRoutes(router *gin.Engine) {
	// Apply CORS middleware
	router.Use(initialisers.SetupCORS())

	// Authentication routes (no JWT middleware)
	router.POST("/api/register", controllers.Register)
	router.POST("/api/login", controllers.Login)
	router.POST("/api/logout", controllers.Logout)

	// Apply JWT middleware to protect routes
	router.Use(initialisers.JWTMiddleware())

	// WebPost routes
	router.GET("/api/webposts", controllers.GetWebPosts)
	router.POST("/api/webposts", controllers.CreateWebPost)
	router.PATCH("/api/webposts/:id", controllers.UpdateWebPost)

	// Movie details route
	router.GET("/api/movies/:id", controllers.GetMovieDetails)

	// User details route
	router.GET("/api/users/:id", controllers.GetUserDetails)
}
