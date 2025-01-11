package routes

import (
	"encoding/json"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/shaneak03/CVWO_Assignment/tree/main/backend/models"
	"github.com/shaneak03/CVWO_Assignment/tree/main/backend/utils"
)

func AuthRoutes(app fiber.App) {
	app.Post("/api/login", func(c fiber.Ctx) error {
		body := c.Body()
		req := models.LoginRequest{}
		if err := json.Unmarshal(body, &req); err != nil {
			return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
		}

		if req.Username == "admin" && req.Password == "password" {
			token, err := utils.GenerateJWT(req.Username)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).SendString("Could not generate token")
			}

			c.Cookie(&fiber.Cookie{
				Name:     "auth_token",
				Value:    token,
				Expires:  time.Now().Add(24 * time.Hour),
				HTTPOnly: true,
				SameSite: "Strict",
			})

			return c.JSON(fiber.Map{"message": "Login successful"})
		}

		return c.Status(fiber.StatusUnauthorized).SendString("Invalid credentials")
	})

	app.Post("/api/logout", func(c fiber.Ctx) error {
		c.ClearCookie("auth_token")
		return c.JSON(fiber.Map{"message": "Logged out successfully"})
	})
}
