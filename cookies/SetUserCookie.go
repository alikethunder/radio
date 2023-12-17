package cookies

import (
	//"fmt"

	"go_react_starter/Users"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
)

// var UserCookie fiber.Cookie
var UserCookie = new(fiber.Cookie)

func SetUserCookie(u Users.UserMap, c *fiber.Ctx) {
	UserCookie := new(fiber.Cookie)

	UserCookie.Name = "user"

	j, _ := json.Marshal(u)

	UserCookie.Value = string(j)

	c.Cookie(UserCookie)
}
