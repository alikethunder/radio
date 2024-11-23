package RadioEndpoints

import (
	"github.com/goccy/go-json"

	"web_project/db"
	"web_project/db/Stations"

	"github.com/gofiber/fiber/v2"
)

func Update(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	id := ctx.Params("id")

	if !admin && id != "new" {
		admin = db.CheckPermission(ctx, "stations", id, "admins")
	}

	if admin {

		var updated_fields fiber.Map

		json.Unmarshal(ctx.Body(), &updated_fields)

		new_id := Stations.Update(id, updated_fields)

		if new_id != nil {
			return ctx.Status(fiber.StatusOK).Send([]byte(new_id.(string)))
		}
	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
