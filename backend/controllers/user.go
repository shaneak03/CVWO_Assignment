package controllers

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/models"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

// get user details
func GetUserDetails(c *gin.Context) {
	// Log the request
	log.Println("GetUserDetails called")

	// Get user ID from request parameters
	userId := c.Param("id")

	// Validate user ID
	if userId == "" {
		c.JSON(400, gin.H{"error": "user_id is required"})
		return
	}

	// Find user by ID in the custom `users` table
	var user models.User
	res := initialisers.DB.First(&user, "id = ?", userId)

	// Check for errors
	if res.Error != nil {
		if res.Error.Error() == "record not found" {
			c.JSON(404, gin.H{"error": "User not found"})
		} else {
			c.JSON(500, gin.H{"error": res.Error.Error()})
		}
		return
	}

	// Return username and email
	c.JSON(200, gin.H{
		"username": user.Username,
		"email":    user.Email,
	})
}

// change user details
func ChangeUserDetails(c *gin.Context) {
	userId := c.Param("user_id")
	// Get data off request body
	var body struct {
		ProfilePic string
		Username   string
		Email      string
	}
	c.Bind(&body)

	// Create user
	user := models.User{ID: userId}
	res := initialisers.DB.Model(&user)

	if body.ProfilePic == "" {
		res = res.Updates(models.User{Username: body.Username, Email: body.Email})
	} else {
		res = res.Updates(models.User{Username: body.Username, Email: body.Email})
	}

	if res.Error != nil {
		c.JSON(400, gin.H{
			"error": res.Error.Error(),
		})
		return
	}

	// Return it
	c.JSON(200, gin.H{
		"new_user": user,
	})
}
