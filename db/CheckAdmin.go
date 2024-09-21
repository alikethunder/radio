package db

import (
	"web_project/cookies"

	"github.com/gofiber/fiber/v2"
)

func CheckRootAdmin(ctx *fiber.Ctx) bool {

	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))

		db_user, _ := SelectRow("users", fiber.Map{"id": cookie_user["id"]}, "admin")

		return db_user["admin"].(bool)

	}
	return false
}
