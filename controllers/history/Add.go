package HistoryEndpoints

import (
	"time"
	"web_project/cookies"
	"web_project/db"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Add(ctx *fiber.Ctx) error {
	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))
		station_id := ctx.Params("id")

		if station_id != "" && cookie_user["id"] != "" {

			//todo: check if last record is not the same station
			record := fiber.Map{
				"id":         gocql.TimeUUID(),
				"user_id":    cookie_user["id"],
				"station_id": station_id,
				"date":       time.Now().UTC().String(),
			}

			err := db.Insert("history", record)

			if err != nil {
				delete(record, "user_id")
				return ctx.Status(fiber.StatusOK).JSON(record)
			}

		}

		return ctx.SendStatus(fiber.StatusBadRequest)

	}
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
