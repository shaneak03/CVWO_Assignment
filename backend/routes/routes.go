package routes

import (
	"github.com/shaneak03/CVWO_Assignment/backend/controllers"
	"github.com/shaneak03/CVWO_Assignment/backend/utils"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// Apply CORS middleware
	router.Use(utils.SetupCORS())

	// Apply JWT middleware to protect routes
	router.Use(utils.JWTMiddleware())

	// Authentication routes
	router.POST("/api/signup", controllers.SignUp)
	router.POST("/api/login", controllers.Login)
	router.POST("/api/logout", controllers.Logout)

	// WebPost routes
	router.GET("/api/webposts", controllers.GetWebPosts)
	router.POST("/api/webposts", controllers.CreateWebPost)
	router.PATCH("/api/webposts/:id", controllers.UpdateWebPost)
}
