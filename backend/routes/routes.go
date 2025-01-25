package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/controllers"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

func SetupRoutes(router *gin.Engine) {
	// Apply CORS middleware
	router.Use(initialisers.SetupCORS())

	// Authentication routes (with JWT middleware)
	router.POST("/api/register", initialisers.JWTMiddleware(), controllers.Register)
	router.POST("/api/login", initialisers.JWTMiddleware(), controllers.Login)
	router.POST("/api/logout", initialisers.JWTMiddleware(), controllers.Logout)

	// WebPost routes (no JWT middleware)
	router.GET("/api/webposts", controllers.GetWebPosts)
	router.POST("/api/webposts", controllers.CreateWebPost)
	router.PATCH("/api/webposts/:id", controllers.UpdateWebPost)
	router.GET("/api/webposts/movie/:movieTitle", controllers.GetWebPostsByMovie)

	// Review routes (no JWT middleware)
	router.GET("/api/reviews", controllers.GetReviews)
	router.POST("/api/reviews", controllers.AddReview)
	router.PATCH("/api/reviews/:id", controllers.UpdateReview)
	router.GET("/api/reviews/movie/:movieTitle", controllers.GetReviewsByMovie)

	// Movie details route (no JWT middleware)
	router.GET("/api/movies", controllers.GetMovies)

	// User details route (no JWT middleware)
	router.GET("/api/users/:id", controllers.GetUserDetails)
}
