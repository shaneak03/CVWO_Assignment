package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/controllers"
	"github.com/shaneak03/CVWO_Assignment/backend/utils"
)

func init() {
	// Un-comment this if hosting on localhost
	// initialisers.LoadEnvVariables()
	utils.ConnectToDb()
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

	//unprotected routes
	r.GET("/user/:user_id", controllers.GetUserDetails)
	r.POST("/signup", controllers.HandleUserSignUp)
	r.POST("/api/signup", controllers.SignUp)

	r.GET("/post/:post_id", controllers.GetPost)
	r.GET("/posts", controllers.GetPosts)

	//Like handlers
	r.POST("likes", controllers.CreateLike)
	r.DELETE("likes", controllers.DeleteLike)

	// Protected routes
	authRequired := r.Group("/auth_req")
	authRequired.Use(middleware.AuthMiddleware())

	authRequired.POST("/create_post", controllers.CreatePost)
	authRequired.DELETE("/delete_post/:post_id", controllers.DeletePost)
	authRequired.PUT("/edit_post/:post_id", controllers.EditPost)

	authRequired.POST("/create_comment", controllers.CreateComment)
	authRequired.DELETE("/delete_comment", controllers.DeleteComment)
	authRequired.PUT("/edit_user/:user_id", controllers.ChangeUserDetails)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not set
	}

	r.Run(":" + port)
}
