package HistoryEndpoints

import (
	"fmt"
	"web_project/cookies"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func DeleteRecord(ctx *fiber.Ctx) error {
	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))
		station_id := ctx.Params("station_id")

		fmt.Println("[HistoryEndpoints.Add] :", cookie_user["id"], station_id)

		if station_id != "" && cookie_user["id"] != "" {

			err := db.Delete("history", fiber.Map{"id": station_id, "user_id": cookie_user["id"]})

			if err == nil {
				return ctx.SendStatus(fiber.StatusOK)
			}
		}

		return ctx.SendStatus(fiber.StatusBadRequest)

	}
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
