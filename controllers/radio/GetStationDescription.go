package RadioEndpoints

import (
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func GetStationDescription(ctx *fiber.Ctx) error {

	id := ctx.Params("id")
	language := ctx.Params("language")

	field := "description_" + language

	station, err := db.SelectRow("stations", fiber.Map{"id": id}, field)

	if err == nil {
		return ctx.Status(fiber.StatusOK).Send([]byte(station[field].(string)))
	}

	return ctx.SendStatus(fiber.StatusNotFound)
}
