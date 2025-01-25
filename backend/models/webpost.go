package models

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type WebPost struct {
	gorm.Model
	Title       string         `json:"title"`
	Content     string         `json:"content"`
	UserID      string         `json:"user_id"`
	Movie       string         `json:"movie"`
	Tags        pq.StringArray `json:"tags" gorm:"type:text[]"`
	Spoiler     bool           `json:"spoiler"`
	Votes       int            `json:"votes"`
	Upvotes     int            `json:"upvotes"`
	Downvotes   int            `json:"downvotes"`
	UpvotedBy   pq.StringArray `json:"upvoted_by" gorm:"type:text[]"`
	DownvotedBy pq.StringArray `json:"downvoted_by" gorm:"type:text[]"`
}

func (WebPost) TableName() string {
	return "posts"
}

func (webPost *WebPost) HasUserUpvoted(userID string) bool {
	for _, id := range webPost.UpvotedBy {
		if id == userID {
			return true
		}
	}
	return false
}

func (webPost *WebPost) HasUserDownvoted(userID string) bool {
	for _, id := range webPost.DownvotedBy {
		if id == userID {
			return true
		}
	}
	return false
}
