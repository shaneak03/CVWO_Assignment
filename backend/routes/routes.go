package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/controllers"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

func SetupRoutes(router *gin.Engine) {
	// Apply CORS middleware
	router.Use(initialisers.SetupCORS())

	// Apply logging middleware
	router.Use(gin.Logger())

	// Authentication routes (with JWT middleware)
	router.POST("/api/register", controllers.Register)
	router.POST("/api/login", initialisers.JWTMiddleware(), controllers.Login)
	router.POST("/api/logout", initialisers.JWTMiddleware(), controllers.Logout)

	// WebPost routes (without JWT middleware for upvote/downvote)
	router.GET("/api/webposts", controllers.GetWebPosts)
	router.POST("/api/webposts", controllers.CreateWebPost)
	router.PUT("/api/webposts/:id", controllers.UpdateWebPost)
	router.DELETE("/api/webposts/:id", controllers.DeleteWebPost)
	router.GET("/api/webposts/movie/:movieTitle", controllers.GetWebPostsByMovie)
	router.GET("/api/webposts/user/:userID", controllers.GetWebPostsByUser)
	router.PUT("/api/webposts/:id/upvote", controllers.UpvoteWebPost)
	router.PUT("/api/webposts/:id/downvote", controllers.DownvoteWebPost)

	// Comment routes (no JWT middleware)
	router.GET("/api/webposts/:id/comments", controllers.GetComments)
	router.POST("/api/webposts/:id/comments", controllers.AddComment)
	router.PUT("/api/comments/:commentID", controllers.EditComment)
	router.DELETE("/api/comments/:commentID", controllers.DeleteComment)

	// Review routes (no JWT middleware)
	router.GET("/api/reviews", controllers.GetReviews)
	router.POST("/api/reviews", controllers.AddReview)
	router.PUT("/api/reviews/:id", controllers.UpdateReview)
	router.DELETE("/api/reviews/:id", controllers.DeleteReview)
	router.GET("/api/reviews/movie/:movieTitle", controllers.GetReviewsByMovie)

	// Movie details route (no JWT middleware)
	router.GET("/api/movies", controllers.GetMovies)

	// User details route (no JWT middleware)
	router.GET("/api/users/:id", controllers.GetUserDetails)
}
