package controllers

import (
	"web_project/cookies"
	"web_project/db"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {

	authCookie := c.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(c.Cookies(cookies.AuthCookieName))

		if cookie_user["id"] != nil {

			user, err := db.SelectRow("users", fiber.Map{"email": cookie_user["email"]}, "id", "name", "email", "subscription_plan")

			if err != nil {

				cookies.ClearAuthCookies(c)

			} else {

				user["created"] = user["id"].(gocql.UUID).Time()

				cookies.SetUserCookie(user, c)

				cookies.SetAuthCookie(cookie_user, c)
			}

		} else {
			cookies.ClearAuthCookies(c)
		}

	} else {
		cookies.ClearAuthCookies(c)
	}

	return c.Render("index", fiber.Map{})
}
