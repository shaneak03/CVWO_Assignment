package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/shaneak03/CVWO_Assignment/backend/models"
	initialisers "github.com/shaneak03/CVWO_Assignment/backend/utils"
	"gorm.io/gorm/clause"
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
	var movies []models.Movie
	if err := initialisers.DB.Find(&movies).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movies)
}

func GetMovies(c *gin.Context) {
	genre := c.Query("genre")

	imdbIDs := []string{
		"tt0371746",
		"tt0800080",
		"tt1228705",
		"tt0800369",
		"tt0458339",
		"tt0848228",
		"tt1300854",
		"tt1981115",
		"tt1843866",
		"tt2015381",
		"tt2395427",
		"tt0478970",
		"tt3498820",
		"tt1211837",
		"tt3896198",
		"tt2250912",
		"tt3501632",
		"tt1825683",
		"tt4154756",
		"tt5095030",
		"tt4154664",
		"tt4154796",
		"tt6320628",
		"tt6791350",
		"tt3480822",
		"tt9376612",
		"tt9114286",
		"tt9419884",
		"tt9032400",
		"tt10648342",
		"tt10872600",
		"tt10954600",
		"tt10676048",
		"tt10676052",
		"tt10671440",
		"tt20969586",
		"tt14513804",
		"tt6263850",
		"tt21357150",
		"tt21361444",
		"tt29347085"}

	apiKey := os.Getenv("OMDB_API_KEY")

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

		if movieDetails.Title == "" {
			continue // Skip movies with an empty title
		}

		movie := models.Movie{
			Title:    movieDetails.Title,
			Year:     movieDetails.Year,
			Runtime:  movieDetails.Runtime,
			Genre:    movieDetails.Genre,
			Director: movieDetails.Director,
			Actors:   movieDetails.Actors,
			Plot:     movieDetails.Plot,
			Poster:   movieDetails.Poster,
		}

		// Upsert movie into the database
		if err := initialisers.DB.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "title"}},
			DoUpdates: clause.AssignmentColumns([]string{"year", "runtime", "genre", "director", "actors", "plot", "poster"}),
		}).Create(&movie).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upsert movie"})
			return
		}
	}

	// Retrieve movies from the database
	var movies []models.Movie
	query := initialisers.DB
	if genre != "" {
		query = query.Where("genre LIKE ?", "%"+genre+"%")
	}
	if err := query.Find(&movies).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movies)
}
