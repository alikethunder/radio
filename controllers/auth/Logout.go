package Auth

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func Logout(c *fiber.Ctx) error {

	c.Cookie(&fiber.Cookie{
		Name:     "auth",
		Value:    "",
		HTTPOnly: true,
		SameSite: "Strict",
		Expires:  time.Now().Add(-time.Second),
	})

	c.Cookie(&fiber.Cookie{
		Name:    "user",
		Value:   "",
		Expires: time.Now().Add(-time.Second),
	})

	//c.SendStatus(fiber.StatusOK)

	return c.Redirect("/signin")
}
