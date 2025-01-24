package models

import "gorm.io/gorm"

type User struct {
	ID       string `gorm:"primaryKey" json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func Migrate(db *gorm.DB) {
	db.AutoMigrate(&User{})
}
