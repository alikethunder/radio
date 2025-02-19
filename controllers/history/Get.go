package HistoryEndpoints

import (
	"web_project/cookies"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func Get(ctx *fiber.Ctx) error {
	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))

		records := db.List("history", fiber.Map{"user_id": cookie_user["id"]}, []string{}, "")

		return ctx.Status(fiber.StatusOK).JSON(records)

	}
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
