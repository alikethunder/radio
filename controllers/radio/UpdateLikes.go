package RadioEndpoints

import (
	"fmt"

	"github.com/goccy/go-json"

	"web_project/cookies"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func UpdateLikes(ctx *fiber.Ctx) error {

	id := ctx.Params("id")

	var updated_fields fiber.Map

	json.Unmarshal(ctx.Body(), &updated_fields)

	fmt.Println("[RadioEndpoints.Update] updated_fields :", updated_fields)

	if err := db.UpdateCounters(
		"station_counters",
		updated_fields,
		fiber.Map{
			"id": id,
		},
		true,
	); err == nil {
		return ctx.SendStatus(fiber.StatusOK)
	}

	cookies.ClearAuthCookies(ctx)
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
