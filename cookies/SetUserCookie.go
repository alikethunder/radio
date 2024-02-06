package cookies

import (
	//"fmt"

	"sale_platform/Users"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
)

func SetUserCookie(u Users.UserMap, c *fiber.Ctx) {
	cookie := new(fiber.Cookie)

	cookie.Name = UserCookieName

	j, _ := json.Marshal(u)

	cookie.Value = string(j)

	c.Cookie(cookie)
}
