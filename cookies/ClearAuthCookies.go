package cookies

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func ClearAuthCookies(c *fiber.Ctx) {

	c.Cookie(&fiber.Cookie{
		Name:     AuthCookieName,
		Value:    "",
		HTTPOnly: true,
		SameSite: "Strict",
		Expires:  time.Now().Add(-time.Second),
	})

	c.Cookie(&fiber.Cookie{
		Name:    UserCookieName,
		Value:   "",
		Expires: time.Now().Add(-time.Second),
	})

}
