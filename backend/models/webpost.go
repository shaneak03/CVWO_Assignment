package models

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type WebPost struct {
	gorm.Model
	Title   string         `json:"title"`
	Content string         `json:"content"`
	UserID  string         `json:"user_id"`
	Movie   string         `json:"movie"`
	Tags    pq.StringArray `json:"tags" gorm:"type:text[]"`
	Spoiler bool           `json:"spoiler"`
	Votes   int            `json:"votes"`
}

func (WebPost) TableName() string {
	return "posts"
}
