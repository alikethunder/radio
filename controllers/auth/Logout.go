package Auth

import (
	"go_react_starter/cookies"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Logout(c *fiber.Ctx) error {

	c.Cookie(&fiber.Cookie{
		Name:     cookies.AuthCookieName,
		Value:    "",
		HTTPOnly: true,
		SameSite: "Strict",
		Expires:  time.Now().Add(-time.Second),
	})

	c.Cookie(&fiber.Cookie{
		Name:    cookies.UserCookieName,
		Value:   "",
		Expires: time.Now().Add(-time.Second),
	})

	return c.Redirect("/signin")
}
