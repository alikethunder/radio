package cookies

import (
	//"fmt"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
)

func SetUserCookie(u fiber.Map, c *fiber.Ctx) {
	cookie := new(fiber.Cookie)

	cookie.Name = UserCookieName

	j, _ := json.Marshal(u)

	cookie.Value = string(j)

	c.Cookie(cookie)
}
