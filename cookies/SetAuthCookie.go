package cookies

import (
	//"fmt"

	"go_react_starter/Users"

	"github.com/gofiber/fiber/v2"
)

func SetAuthCookie(u Users.UserMap, c *fiber.Ctx) {
	cookie := new(fiber.Cookie)

	cookie.Name = "auth"

	cookie.Value = SignCookie(u)

	cookie.HTTPOnly = true

	cookie.SameSite = "Strict"

	if u["rememberme"].(bool) {
		cookie.MaxAge = MaxAge
	}

	c.Cookie(cookie)
}
