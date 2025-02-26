package HistoryEndpoints

import (
	"fmt"
	"time"
	"web_project/cookies"
	"web_project/db"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

/*
success -> returns {
		id,
		date
	}
*/

func Add(ctx *fiber.Ctx) error {
	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))
		station_id := ctx.Params("station_id")

		fmt.Println("[HistoryEndpoints.Add] :", cookie_user["id"], station_id)

		if station_id != "" && cookie_user["id"] != "" {

			// check if last record is not the same station

			last_record, err := db.SelectRowWithOrder("history", fiber.Map{"user_id": cookie_user["id"]}, "id DESC", "station_id")

			if err == nil && ((last_record["station_id"] != station_id) || (last_record["station_id"] == nil)) {

				record := fiber.Map{
					"id":         gocql.TimeUUID(),
					"user_id":    cookie_user["id"],
					"station_id": station_id,
					"date":       time.Now().UTC().String(),
				}

				err := db.Insert("history", record)

				if err == nil {

					count, _ := db.Count("history", "user_id", fiber.Map{"user_id": cookie_user["id"]})

					fmt.Println("[HistoryEndpoints.Add] count:", count)

					if count > 100 {
						first_row, _ := db.SelectRow("history", fiber.Map{"user_id": cookie_user["id"]}, "id")

						db.Delete("history", fiber.Map{
							"id":      first_row["id"],
							"user_id": cookie_user["id"],
						})
					}

					delete(record, "user_id")
					delete(record, "station_id")
					return ctx.Status(fiber.StatusOK).JSON(record)
				}
			}
			return ctx.SendStatus(fiber.StatusAccepted)

		}

		return ctx.SendStatus(fiber.StatusBadRequest)

	}
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
