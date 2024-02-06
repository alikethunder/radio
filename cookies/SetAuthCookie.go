package cookies

import (
	//"fmt"

	"sale_platform/Users"

	"github.com/gofiber/fiber/v2"
)

func SetAuthCookie(u Users.UserMap, c *fiber.Ctx) {
	cookie := new(fiber.Cookie)

	cookie.Name = AuthCookieName

	cookie.Value = SignCookie(u)

	cookie.HTTPOnly = true

	cookie.SameSite = "Strict"

	if u["rememberme"].(bool) {
		cookie.MaxAge = MaxAge
	}

	//fmt.Println("[SetAuthCookie] cookie value : ", cookie.Value)

	//fmt.Println("[SetAuthCookie] cookie : ", cookie)

	c.Cookie(cookie)
}
