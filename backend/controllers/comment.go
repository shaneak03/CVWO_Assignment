package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/models"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

func AddComment(c *gin.Context) {
	var request CommentRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	postID := c.Param("id")
	log.Printf("Adding comment to post ID: %s", postID)

	comment := models.Comment{
		Content: request.Content,
		UserID:  request.UserID,
		PostID:  postID,
	}

	if err := initialisers.DB.Create(&comment).Error; err != nil {
		log.Printf("Error creating comment: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Comment added successfully: %+v", comment)
	c.JSON(http.StatusOK, gin.H{"message": "Comment added successfully"})
}

func GetComments(c *gin.Context) {
	postID := c.Param("id")
	log.Printf("Fetching comments for post ID: %s", postID)

	var comments []models.Comment
	if err := initialisers.DB.Where("post_id = ?", postID).Find(&comments).Error; err != nil {
		log.Printf("Error fetching comments: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []CommentResponse
	for _, comment := range comments {
		response = append(response, CommentResponse{
			ID:      comment.ID,
			Content: comment.Content,
			UserID:  comment.UserID,
		})
	}

	log.Printf("Comments fetched successfully: %+v", response)
	c.JSON(http.StatusOK, response)
}

func EditComment(c *gin.Context) {
	commentID := c.Param("commentID")
	log.Printf("Editing comment ID: %s", commentID)

	var request CommentRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var comment models.Comment
	if err := initialisers.DB.First(&comment, "id = ?", commentID).Error; err != nil {
		log.Printf("Comment not found: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	comment.Content = request.Content
	if err := initialisers.DB.Save(&comment).Error; err != nil {
		log.Printf("Error updating comment: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Comment updated successfully: %+v", comment)
	c.JSON(http.StatusOK, gin.H{"message": "Comment updated successfully"})
}

func DeleteComment(c *gin.Context) {
	commentID := c.Param("commentID")
	log.Printf("Deleting comment ID: %s", commentID)

	var comment models.Comment
	if err := initialisers.DB.First(&comment, "id = ?", commentID).Error; err != nil {
		log.Printf("Comment not found: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	if err := initialisers.DB.Delete(&comment).Error; err != nil {
		log.Printf("Error deleting comment: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Comment deleted successfully: %+v", comment)
	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}
