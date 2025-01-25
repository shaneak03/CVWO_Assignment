package models

import (
	"gorm.io/gorm"
)

type Movie struct {
	gorm.Model
	Title    string `gorm:"unique" json:"title"`
	Year     string `json:"year"`
	Runtime  string `json:"runtime"`
	Genre    string `json:"genre"`
	Director string `json:"director"`
	Actors   string `json:"actors"`
	Plot     string `json:"plot"`
	Poster   string `json:"poster"`
}
