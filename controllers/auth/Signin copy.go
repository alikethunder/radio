package Auth

import (
	"github.com/gofiber/fiber/v2"
)

func Logout(c *fiber.Ctx) error {

	c.ClearCookie("auth")

	c.ClearCookie("user")

	c.Status(fiber.StatusOK)

	return nil
}
