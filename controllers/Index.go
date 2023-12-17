package controllers

import (
	"fmt"

	"go_react_starter/Users"
	"go_react_starter/cookies"

	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {

	authCookie := c.Cookies("auth")
	fmt.Println("[Index] auth cookie : ", authCookie, authCookie == "")

	if authCookie != "" {

		u := cookies.ParseAuthCookie(c.Cookies("auth"))

		fmt.Println("[Index] user from auth cookie : ", u)

		user, err := Users.GetUserFields(Users.UserMap{"email": u["email"]}, "id", "password", "name")

		if err != nil {
			fmt.Println("[Index] GetUserFields error : ", err)
		}

	}

	return c.Render("index", fiber.Map{})
}
