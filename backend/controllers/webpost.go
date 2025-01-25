package controllers

import (
	"log"
	"net/http"
	"net/url"

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
	Votes   int      `json:"votes"`
}

type WebPostResponse struct {
	ID           uint     `json:"id"`
	Title        string   `json:"title"`
	Content      string   `json:"content"`
	UserID       string   `json:"user_id"`
	Movie        string   `json:"movie"`
	Tags         []string `json:"tags"`
	Spoiler      bool     `json:"spoiler"`
	Votes        int      `json:"votes"`
	Upvotes      int      `json:"upvotes"`
	Downvotes    int      `json:"downvotes"`
	HasUpvoted   bool     `json:"has_upvoted"`
	HasDownvoted bool     `json:"has_downvoted"`
}

type VoteRequest struct {
	UserID string `json:"user_id"`
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
		Votes:   request.Votes,
	}

	if err := initialisers.DB.Create(&webPost).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Web post submitted successfully"})
}

func GetWebPosts(c *gin.Context) {
	var webPosts []models.WebPost
	if err := initialisers.DB.Where("deleted_at IS NULL").Find(&webPosts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetString("userID")

	var response []WebPostResponse
	for _, post := range webPosts {
		response = append(response, WebPostResponse{
			ID:           post.ID,
			Title:        post.Title,
			Content:      post.Content,
			UserID:       post.UserID,
			Movie:        post.Movie,
			Tags:         post.Tags,
			Spoiler:      post.Spoiler,
			Votes:        post.Votes,
			Upvotes:      post.Upvotes,
			Downvotes:    post.Downvotes,
			HasUpvoted:   post.HasUserUpvoted(userID),
			HasDownvoted: post.HasUserDownvoted(userID),
		})
	}

	c.JSON(http.StatusOK, response)
}

func UpdateWebPost(c *gin.Context) {
	id := c.Param("id")
	log.Printf("Updating web post with ID: %s", id)

	var request WebPostRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var webPost models.WebPost
	if err := initialisers.DB.First(&webPost, "id = ?", id).Error; err != nil {
		log.Printf("Web post not found: %s", err.Error())
		c.JSON(http.StatusNotFound, gin.H{"error": "Web post not found"})
		return
	}

	// Use Updates method to update the web post
	if err := initialisers.DB.Model(&webPost).Updates(models.WebPost{
		Title:   request.Title,
		Content: request.Content,
		Movie:   request.Movie,
		Tags:    request.Tags,
		Spoiler: request.Spoiler,
		Votes:   request.Votes,
	}).Error; err != nil {
		log.Printf("Error updating web post: %s", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Web post updated successfully: %+v", webPost)
	c.JSON(http.StatusOK, gin.H{"message": "Web post updated successfully"})
}

func DeleteWebPost(c *gin.Context) {
	id := c.Param("id")

	var webPost models.WebPost
	if err := initialisers.DB.First(&webPost, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Web post not found"})
		return
	}

	if err := initialisers.DB.Delete(&webPost).Error; err != nil {
		log.Println("Error deleting web post:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Web post deleted successfully"})
}

func GetWebPostsByMovie(c *gin.Context) {
	movieTitle, err := url.QueryUnescape(c.Param("movieTitle"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie title"})
		return
	}
	var webPosts []models.WebPost
	if err := initialisers.DB.Where("movie = ? AND deleted_at IS NULL", movieTitle).Find(&webPosts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetString("userID")

	var response []WebPostResponse
	for _, post := range webPosts {
		response = append(response, WebPostResponse{
			ID:           post.ID,
			Title:        post.Title,
			Content:      post.Content,
			UserID:       post.UserID,
			Movie:        post.Movie,
			Tags:         post.Tags,
			Spoiler:      post.Spoiler,
			Votes:        post.Votes,
			Upvotes:      post.Upvotes,
			Downvotes:    post.Downvotes,
			HasUpvoted:   post.HasUserUpvoted(userID),
			HasDownvoted: post.HasUserDownvoted(userID),
		})
	}

	c.JSON(http.StatusOK, response)
}

func GetWebPostsByUser(c *gin.Context) {
	userID := c.Param("userID")
	var webPosts []models.WebPost
	if err := initialisers.DB.Where("user_id = ? AND deleted_at IS NULL", userID).Find(&webPosts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Fetched webPosts by user: %+v", webPosts) // Add logging

	var response []WebPostResponse
	for _, post := range webPosts {
		response = append(response, WebPostResponse{
			ID:           post.ID,
			Title:        post.Title,
			Content:      post.Content,
			UserID:       post.UserID,
			Movie:        post.Movie,
			Tags:         post.Tags,
			Spoiler:      post.Spoiler,
			Votes:        post.Votes,
			Upvotes:      post.Upvotes,
			Downvotes:    post.Downvotes,
			HasUpvoted:   post.HasUserUpvoted(userID),
			HasDownvoted: post.HasUserDownvoted(userID),
		})
	}

	c.JSON(http.StatusOK, response)
}

func UpvoteWebPost(c *gin.Context) {
	var webPost models.WebPost
	id := c.Param("id")

	var request VoteRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID := request.UserID
	log.Printf("Upvote request received for post ID: %s by user ID: %s", id, userID) // Add logging

	if err := initialisers.DB.Where("id = ?", id).First(&webPost).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "WebPost not found"})
		return
	}

	if webPost.HasUserUpvoted(userID) {
		webPost.UpvotedBy = removeUser(webPost.UpvotedBy, userID)
	} else {
		webPost.UpvotedBy = append(webPost.UpvotedBy, userID)
		webPost.DownvotedBy = removeUser(webPost.DownvotedBy, userID)
	}

	webPost.Upvotes = len(webPost.UpvotedBy)
	webPost.Downvotes = len(webPost.DownvotedBy)
	webPost.Votes = webPost.Upvotes - webPost.Downvotes

	if err := initialisers.DB.Model(&webPost).Where("id = ?", id).Updates(map[string]interface{}{
		"upvoted_by":   webPost.UpvotedBy,
		"downvoted_by": webPost.DownvotedBy,
		"upvotes":      webPost.Upvotes,
		"downvotes":    webPost.Downvotes,
		"votes":        webPost.Votes,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update web post"})
		return
	}

	log.Printf("Web post updated successfully: %+v", webPost) // Add logging
	c.JSON(http.StatusOK, webPost)
}

func DownvoteWebPost(c *gin.Context) {
	var webPost models.WebPost
	id := c.Param("id")

	var request VoteRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID := request.UserID
	log.Printf("Downvote request received for post ID: %s by user ID: %s", id, userID) // Add logging

	if err := initialisers.DB.Where("id = ?", id).First(&webPost).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "WebPost not found"})
		return
	}

	if webPost.HasUserDownvoted(userID) {
		webPost.DownvotedBy = removeUser(webPost.DownvotedBy, userID)
	} else {
		webPost.DownvotedBy = append(webPost.DownvotedBy, userID)
		webPost.UpvotedBy = removeUser(webPost.UpvotedBy, userID)
	}

	webPost.Upvotes = len(webPost.UpvotedBy)
	webPost.Downvotes = len(webPost.DownvotedBy)
	webPost.Votes = webPost.Upvotes - webPost.Downvotes

	if err := initialisers.DB.Model(&webPost).Where("id = ?", id).Updates(map[string]interface{}{
		"upvoted_by":   webPost.UpvotedBy,
		"downvoted_by": webPost.DownvotedBy,
		"upvotes":      webPost.Upvotes,
		"downvotes":    webPost.Downvotes,
		"votes":        webPost.Votes,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update web post"})
		return
	}

	log.Printf("Web post updated successfully: %+v", webPost)
	c.JSON(http.StatusOK, webPost)
}

func removeUser(users []string, userID string) []string {
	for i, id := range users {
		if id == userID {
			return append(users[:i], users[i+1:]...)
		}
	}
	return users
}
