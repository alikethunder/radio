package cookies

import (
	//"fmt"

	"github.com/gofiber/fiber/v2"
	"web_project/types"
)

func SetAuthCookie(u Types.Map, c *fiber.Ctx) {
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
