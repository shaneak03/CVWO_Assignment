package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/models"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

type WebPostRequest struct {
	Title   string   `json:"title"`
	Content string   `json:"content"`
	UserID  string   `json:"user_id"`
	Movie   string   `json:"movie"`
	Tags    []string `json:"tags"`
	Spoiler bool     `json:"spoiler"`
}

func CreateWebPost(c *gin.Context) {
	var request WebPostRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	webPost := models.WebPost{
		Title:   request.Title,
		Content: request.Content,
		UserID:  request.UserID,
		Movie:   request.Movie,
		Tags:    request.Tags,
		Spoiler: request.Spoiler,
	}

	if err := initialisers.DB.Create(&webPost).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Web post submitted successfully"})
}

func GetWebPosts(c *gin.Context) {
	var webPosts []models.WebPost
	if err := initialisers.DB.Find(&webPosts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, webPosts)
}

func UpdateWebPost(c *gin.Context) {
	id := c.Param("id")
	var request WebPostRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var webPost models.WebPost
	if err := initialisers.DB.First(&webPost, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Web post not found"})
		return
	}

	webPost.Title = request.Title
	webPost.Content = request.Content
	webPost.UserID = request.UserID
	webPost.Movie = request.Movie
	webPost.Tags = request.Tags
	webPost.Spoiler = request.Spoiler

	if err := initialisers.DB.Save(&webPost).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Web post updated successfully"})
}
