package AuthEndpoints

import (
	"sale_platform/cookies"

	"github.com/gofiber/fiber/v2"
)

func Logout(c *fiber.Ctx) error {

	cookies.ClearAuthCookies(c)

	return c.Redirect("/signin")
}
