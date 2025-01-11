package models

import (
	"errors"
)

type WebPost struct {
	ID      int    `json:"id"`
	Author  string `json:"author"`
	Title   string `json:"title"`
	Date    string `json:"date"`
	Content string `json:"content"`
}

var webPosts = []WebPost{}

func FetchWebPosts() ([]WebPost, error) {
	return webPosts, nil
}

func CreateWebPost(post *WebPost) error {
	post.ID = len(webPosts) + 1
	webPosts = append(webPosts, *post)
	return nil
}

func UpdateWebPost(id int, post *WebPost) error {
	for i, p := range webPosts {
		if p.ID == id {
			if post.Author != "" {
				webPosts[i].Author = post.Author
			}
			if post.Title != "" {
				webPosts[i].Title = post.Title
			}
			if post.Date != "" {
				webPosts[i].Date = post.Date
			}
			if post.Content != "" {
				webPosts[i].Content = post.Content
			}
			return nil
		}
	}
	return errors.New("WebPost not found")
}
