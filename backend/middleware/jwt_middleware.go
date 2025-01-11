package middleware

import (
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/shaneak03/CVWO_Assignment/tree/main/backend/utils"
)

func JWTMiddleware(c fiber.Ctx) error {
	cookie := c.Cookies("auth_token")
	if cookie == "" {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized: No token provided")
	}

	token, err := utils.ParseJWT(cookie)
	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized: Invalid token")
	}

	claims := token.Claims.(jwt.MapClaims)
	c.Locals("username", claims["username"])
	return c.Next()
}
