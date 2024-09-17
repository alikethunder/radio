package cookies

import (
	//"fmt"

	"github.com/gofiber/fiber/v2"
)

func SetAuthCookie(u fiber.Map, c *fiber.Ctx) *fiber.Cookie {
	cookie := new(fiber.Cookie)

	cookie.Name = AuthCookieName

	cookie.Value = SignCookie(u)

	cookie.HTTPOnly = true

	cookie.SameSite = "Strict"

	cookie.Path = "/"

	if u["rememberme"].(bool) {
		cookie.MaxAge = MaxAge
	}

	//fmt.Println("[SetAuthCookie] cookie value : ", cookie.Value)

	//fmt.Println("[SetAuthCookie] cookie : ", cookie)

	c.Cookie(cookie)

	return cookie
}
