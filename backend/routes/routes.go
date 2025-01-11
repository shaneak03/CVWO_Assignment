package routes

import (
	"backend/controllers"
	"backend/utils"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	router.Use(utils.JWTMiddleware())

	// Authentication routes
	router.POST("/api/login", controllers.Login)
	router.POST("/api/logout", controllers.Logout)

	// WebPost routes
	router.GET("/api/webposts", controllers.GetWebPosts)
	router.POST("/api/webposts", controllers.CreateWebPost)
	router.PATCH("/api/webposts/:id", controllers.UpdateWebPost)
}
