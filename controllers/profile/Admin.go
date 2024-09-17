package ProfileEndpoints

import (
	"fmt"
	"slices"

	"web_project/cookies"
	"web_project/db"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Admin(ctx *fiber.Ctx) error {

	authCookie := ctx.Cookies(cookies.AuthCookieName)

	fmt.Println("[ProfileEndpoints.Admin]")

	if authCookie != "" {

		id := ctx.Params("id")

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))

		if id == "root" {
			//root admin

			db_user, err := db.SelectRow("users", fiber.Map{"id": cookie_user["id"]}, "admin")

			if err == nil && db_user["admin"].(bool) {
				return ctx.SendStatus(fiber.StatusOK)
			}
		} else {
			//station admin

			station, _ := db.SelectRow("stations", fiber.Map{"id": id}, "admins")

			uuid, _ := gocql.ParseUUID(cookie_user["id"].(string))

			if slices.Contains(station["admins"].([]gocql.UUID), uuid) {
				return ctx.SendStatus(fiber.StatusOK)
			}

		}
	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
