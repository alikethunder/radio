package cookies

import (
	"fmt"

	"go_react_starter/Users"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

func SetAuthCookie(u Users.UserMap, c *fiber.Ctx) {
	auth := new(fiber.Cookie)

	auth.Name = "auth"

	auth.Value = SignCookie(u)

	auth.HTTPOnly = true

	auth.SameSite = "Strict"

	if u["rememberme"].(bool) {
		auth.MaxAge = MaxAge
	}

	c.Cookie(auth)
}
