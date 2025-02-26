package HistoryEndpoints

import (
	"fmt"
	"web_project/cookies"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func DeleteAll(ctx *fiber.Ctx) error {
	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))

		if cookie_user["id"] != "" {

			user_records := db.List("history", fiber.Map{"user_id": cookie_user["id"]}, []string{}, "", "id")

			var err error

			for _, record := range user_records {
				err = db.Delete("history", fiber.Map{"id": record["id"], "user_id": cookie_user["id"]})

				if err != nil {
					fmt.Println("[HistoryEndpoints.DeleteAll] :", err)

					return ctx.SendStatus(fiber.StatusBadRequest)
				}
			}
			return ctx.SendStatus(fiber.StatusOK)
		}
	}
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
