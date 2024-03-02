package AuthEndpoints

import (
	"web_project/cookies"

	"github.com/gofiber/fiber/v2"
)

func Logout(c *fiber.Ctx) error {

	cookies.ClearAuthCookies(c)

	return c.Redirect("/signin")
}
