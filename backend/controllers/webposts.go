package controllers

import (
	"net/http"
	"strconv"

	"github.com/shaneak03/CVWO_Assignment/backend/models"

	"github.com/gin-gonic/gin"
)

func GetWebPosts(c *gin.Context) {
	posts, err := models.FetchWebPosts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch webposts"})
		return
	}
	c.JSON(http.StatusOK, posts)
}

func CreateWebPost(c *gin.Context) {
	var post models.WebPost
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := models.CreateWebPost(&post); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create webpost"})
		return
	}

	c.JSON(http.StatusCreated, post)
}

func UpdateWebPost(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var post models.WebPost
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := models.UpdateWebPost(id, &post); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update webpost"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "WebPost updated"})
}
