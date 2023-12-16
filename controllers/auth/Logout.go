package Auth

import (
	"github.com/gofiber/fiber/v2"
)

func Logout(c *fiber.Ctx) error {

	c.ClearCookie("auth")

	c.ClearCookie("user")

	return c.SendStatus(fiber.StatusOK)
}
