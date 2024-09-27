package StationTagsEndpoints

import (
	"encoding/json"
	"fmt"

	"web_project/cookies"
	"web_project/db"
	"web_project/db/Playlists"
	"web_project/functions"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func SaveTags(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	id := ctx.Params("id")

	if !admin {
		admin = db.CheckPermission(ctx, "stations", id, "admins")
	}

	if admin {

		var tags fiber.Map

		json.Unmarshal(ctx.Body(), &tags)
		//!! finish ASAP
		fmt.Println("[RadioEndpoints.Update] updated_fields :", updated_fields)

		if err := db.Update(
			"stations",
			updated_fields,
			fiber.Map{
				"id": id,
			},
		); err == nil {

			return ctx.Status(fiber.StatusOK).Send([]byte(id))
		}
	}

	cookies.ClearAuthCookies(ctx)
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
