package controller

import (
	"github.com/gofiber/fiber/v2"
)

func createGame(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Game created",
	})
}
