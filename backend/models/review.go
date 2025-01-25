package models

import "gorm.io/gorm"

type Review struct {
	gorm.Model
	Rating     int    `json:"rating"`
	Content    string `json:"content"`
	UserID     string `json:"user_id"`
	Movie      string `json:"movie"`
	Spoiler    bool   `json:"spoiler"`
	MovieTitle string `json:"movie_title"` // Add the MovieTitle field
}
