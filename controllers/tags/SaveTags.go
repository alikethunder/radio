package StationTagsEndpoints

import (
	"encoding/json"
	"fmt"

	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func SaveTags(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	id := ctx.Params("id")

	if !admin {
		admin = db.CheckPermission(ctx, "stations", id, "admins")
	}

	if admin {

		var tags []fiber.Map
		var err error

		json.Unmarshal(ctx.Body(), &tags)

		fmt.Println("[StationTagsEndpoints.SaveTags] tags :", tags)

		for _, tag := range tags {
			if err = db.Update(
				"station_tags",
				tag,
				fiber.Map{
					"name": tag["name"],
				},
			); err != nil {
				fmt.Println("[StationTagsEndpoints.SaveTags] Error tag, err :", tag, err)
			}
		}

		if err != nil {
			return ctx.SendStatus(fiber.StatusUnauthorized)
		}

		return ctx.Status(fiber.StatusOK).JSON(tags)

	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
