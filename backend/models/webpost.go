package models

type WebPost struct {
	ID      int    `json:"id"`
	Author  string `json:"author"`
	Title   string `json:"title"`
	Date    string `json:"date"`
	Content string `json:"content"`
}
