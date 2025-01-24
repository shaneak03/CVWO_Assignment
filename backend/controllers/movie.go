package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

const OMDB_API_URL = "http://www.omdbapi.com/"

type MovieDetails struct {
	Title    string `json:"Title"`
	Year     string `json:"Year"`
	Rated    string `json:"Rated"`
	Released string `json:"Released"`
	Runtime  string `json:"Runtime"`
	Genre    string `json:"Genre"`
	Director string `json:"Director"`
	Writer   string `json:"Writer"`
	Actors   string `json:"Actors"`
	Plot     string `json:"Plot"`
	Language string `json:"Language"`
	Country  string `json:"Country"`
	Awards   string `json:"Awards"`
	Poster   string `json:"Poster"`
	Ratings  []struct {
		Source string `json:"Source"`
		Value  string `json:"Value"`
	} `json:"Ratings"`
	Metascore  string `json:"Metascore"`
	ImdbRating string `json:"imdbRating"`
	ImdbVotes  string `json:"imdbVotes"`
	ImdbID     string `json:"imdbID"`
	Type       string `json:"Type"`
	DVD        string `json:"DVD"`
	BoxOffice  string `json:"BoxOffice"`
	Production string `json:"Production"`
	Website    string `json:"Website"`
	Response   string `json:"Response"`
}

func GetMovieDetails(c *gin.Context) {
	imdbID := c.Param("imdbID")
	apiKey := os.Getenv("OMDB_API_KEY")

	url := fmt.Sprintf("%s?i=%s&apikey=%s", OMDB_API_URL, imdbID, apiKey)
	resp, err := http.Get(url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movie details"})
		return
	}
	defer resp.Body.Close()

	var movieDetails MovieDetails
	if err := json.NewDecoder(resp.Body).Decode(&movieDetails); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode movie details"})
		return
	}

	c.JSON(http.StatusOK, movieDetails)
}

func GetMovies(c *gin.Context) {
	imdbIDs := []string{"tt1234567", "tt7654321"} // Replace with actual IMDb IDs
	apiKey := os.Getenv("OMDB_API_KEY")

	var movies []MovieDetails
	for _, imdbID := range imdbIDs {
		url := fmt.Sprintf("%s?i=%s&apikey=%s", OMDB_API_URL, imdbID, apiKey)
		resp, err := http.Get(url)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movie details"})
			return
		}
		defer resp.Body.Close()

		var movieDetails MovieDetails
		if err := json.NewDecoder(resp.Body).Decode(&movieDetails); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode movie details"})
			return
		}

		movies = append(movies, movieDetails)
	}

	c.JSON(http.StatusOK, movies)
}
