package controllers

import (
	"log"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/models"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

func AddReview(c *gin.Context) {
	var review models.Review
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := initialisers.DB.Create(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, review)
}

func GetReviews(c *gin.Context) {
	var reviews []models.Review
	if err := initialisers.DB.Where("deleted_at IS NULL").Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, reviews)
}

func UpdateReview(c *gin.Context) {
	id := c.Param("id")
	var request struct {
		Movie   string `json:"movie"`
		Content string `json:"content"`
		Rating  int    `json:"rating"`
		Spoiler bool   `json:"spoiler"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var review models.Review
	if err := initialisers.DB.First(&review, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	review.Movie = request.Movie
	review.Content = request.Content
	review.Rating = request.Rating
	review.Spoiler = request.Spoiler

	if err := initialisers.DB.Save(&review).Error; err != nil {
		log.Println("Error updating review:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review updated successfully"})
}

func DeleteReview(c *gin.Context) {
	id := c.Param("id")

	if err := initialisers.DB.Delete(&models.Review{}, id).Error; err != nil {
		log.Println("Error deleting review:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review deleted successfully"})
}

func GetReviewsByMovie(c *gin.Context) {
	movieTitle, err := url.QueryUnescape(c.Param("movieTitle"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie title"})
		return
	}
	var reviews []models.Review
	if err := initialisers.DB.Where("movie = ? AND deleted_at IS NULL", movieTitle).Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, reviews)
}
