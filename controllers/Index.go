package controllers

import (
	"fmt"

	"go_react_starter/Users"
	"go_react_starter/cookies"

	"github.com/gofiber/fiber/v2"
	"github.com/gocql/gocql"
)

func Index(c *fiber.Ctx) error {

	authCookie := c.Cookies("auth")
	fmt.Println("[Index] auth cookie : ", authCookie, authCookie == "")

	if authCookie != "" {

		u := cookies.ParseAuthCookie(c.Cookies("auth"))

		user, err := Users.GetUserFields(Users.UserMap{"email": u["email"]}, "id", "name", "email")

		if err != nil {
			fmt.Println("[Index] GetUserFields error : ", err)
		}

		user["created"] = user["id"].(gocql.UUID).Time()

		cookies.SetUserCookie(user, c)

		cookies.SetAuthCookie(u, c)
		
	} else {
		cookies.ClearAuthCookies(c)
	}

	return c.Render("index", fiber.Map{})
}
