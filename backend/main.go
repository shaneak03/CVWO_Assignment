package main

import (
	"encoding/json"
	"log"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/golang-jwt/jwt/v5"
)

type WebPost struct {
	ID      int    `json:"id"`
	Author  string `json:"author"`
	Title   string `json:"title"`
	Date    string `json:"date"`
	Content string `json:"content"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

var jwtSecret = []byte("your-secret-key")

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	webposts := []WebPost{}

	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("OK")
	})

	app.Post("/api/login", func(c fiber.Ctx) error {
		body := c.Body()
		req := LoginRequest{}
		if err := json.Unmarshal(body, &req); err != nil {
			return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
		}

		// Replace with actual user authentication logic
		if req.Username == "admin" && req.Password == "password" {
			token := jwt.New(jwt.SigningMethodHS256)
			claims := token.Claims.(jwt.MapClaims)
			claims["username"] = req.Username
			claims["exp"] = time.Now().Add(24 * time.Hour).Unix()

			t, err := token.SignedString(jwtSecret)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).SendString("Could not generate token")
			}

			// Set token in HTTP-only cookie
			c.Cookie(&fiber.Cookie{
				Name:     "auth_token",
				Value:    t,
				Expires:  time.Now().Add(24 * time.Hour),
				HTTPOnly: true,
				SameSite: "Strict",
			})

			return c.JSON(fiber.Map{"message": "Login successful"})
		}

		return c.Status(fiber.StatusUnauthorized).SendString("Invalid credentials")
	})

	// JWT Middleware
	app.Use(func(c fiber.Ctx) error {
		cookie := c.Cookies("auth_token")
		if cookie == "" {
			return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized: No token provided")
		}

		// Parse token
		token, err := jwt.Parse(cookie, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(fiber.StatusUnauthorized, "Unexpected signing method")
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized: Invalid token")
		}

		// Store user info in locals
		claims := token.Claims.(jwt.MapClaims)
		c.Locals("username", claims["username"])
		return c.Next()
	})

	app.Post("/api/webposts", func(c fiber.Ctx) error {
		webpost := &WebPost{}

		if err := json.Unmarshal(c.Body(), webpost); err != nil {
			return c.Status(400).SendString("Invalid request body")
		}

		webpost.ID = len(webposts) + 1

		webposts = append(webposts, *webpost)

		return c.JSON(webposts)
	})

	app.Patch("/api/webposts/:id", func(c fiber.Ctx) error {
		idStr := c.Params("id")

		id, err := strconv.Atoi(idStr)
		if err != nil {
			return c.Status(401).SendString("Invalid id")
		}

		for i, t := range webposts {
			if t.ID == id {
				updatedPost := WebPost{}
				if err := json.Unmarshal(c.Body(), &updatedPost); err != nil {
					return c.Status(400).SendString("Failed to parse request body")
				}
				if updatedPost.Author != "" {
					webposts[i].Author = updatedPost.Author
				}
				if updatedPost.Title != "" {
					webposts[i].Title = updatedPost.Title
				}
				if updatedPost.Date != "" {
					webposts[i].Date = updatedPost.Date
				}
				if updatedPost.Content != "" {
					webposts[i].Content = updatedPost.Content
				}
			}
		}

		return c.JSON(webposts)
	})

	app.Get("/api/webposts", func(c fiber.Ctx) error {
		return c.JSON(webposts)
	})

	// Logout route
	app.Post("/api/logout", func(c fiber.Ctx) error {
		c.ClearCookie("auth_token")
		return c.JSON(fiber.Map{"message": "Logged out successfully"})
	})

	log.Fatal(app.Listen(":3000"))
}
