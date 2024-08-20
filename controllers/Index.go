package controllers

import (
	"fmt"

	"web_project/cookies"
	Users "web_project/db/Users"
	"web_project/types"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {

	authCookie := c.Cookies(cookies.AuthCookieName)
	//fmt.Println("[Index] auth cookie : ", authCookie, authCookie == "")

	if authCookie != "" {

		u := cookies.ParseAuthCookie(c.Cookies(cookies.AuthCookieName))

		user, err := Users.GetUserFields(Types.Map{"email": u["email"]}, "id", "name", "email", "subscription_plan")

		if err != nil {
			fmt.Println("[Index] GetUserFields error : ", err)

			cookies.ClearAuthCookies(c)

		} else {

			user["created"] = user["id"].(gocql.UUID).Time()

			cookies.SetUserCookie(user, c)

			cookies.SetAuthCookie(u, c)
		}

	}

	return c.Render("index", fiber.Map{})
}
