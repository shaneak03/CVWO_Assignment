package models

import "gorm.io/gorm"

type Comment struct {
	gorm.Model
	Content string `json:"content"`
	UserID  string `json:"user_id"`
	PostID  string `json:"post_id"`
}
