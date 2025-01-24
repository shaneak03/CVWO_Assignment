package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/models"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
)

// get user details
func GetUserDetails(c *gin.Context) {
	// Get user ID from request parameters
	userId := c.Param("user_id")

	// Find user by ID
	var user models.User
	res := initialisers.DB.First(&user, "id = ?", userId)

	if res.Error != nil {
		c.JSON(400, gin.H{
			"error": res.Error.Error(),
		})
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
