package controllers

import (
	"fmt"

	"web_project/cookies"
	Users "web_project/db/Users"
	Types "web_project/types"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {

	authCookie := c.Cookies(cookies.AuthCookieName)
	//fmt.Println("[Index] auth cookie : ", authCookie, authCookie == "")

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(c.Cookies(cookies.AuthCookieName))

		//fmt.Println("[Index] cookie_user: ", cookie_user, cookie_user["id"] == nil)

		if cookie_user["id"] != nil {

			user, err := Users.GetUserFields(Types.Map{"email": cookie_user["email"]}, "id", "name", "email", "subscription_plan")

			if err != nil {
				fmt.Println("[Index] GetUserFields error : ", err)

				cookies.ClearAuthCookies(c)

			} else {

				user["created"] = user["id"].(gocql.UUID).Time()

				cookies.SetUserCookie(user, c)

				cookies.SetAuthCookie(cookie_user, c)
			}

		} else {
			//fmt.Println("[Index] ClearAuthCookies : ", cookie_user)

			cookies.ClearAuthCookies(c)
		}

	}

	return c.Render("index", fiber.Map{})
}
