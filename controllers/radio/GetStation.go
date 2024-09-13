package RadioEndpoints

import (
	/* "encoding/json"

	"github.com/gocql/gocql" */
	//"fmt"
	"web_project/db"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
)

func GetStation(ctx *fiber.Ctx) error {

	id := ctx.Params("id")

	station, err := db.Select("stations", Types.Map{"id": id})

	if err == nil {
		return ctx.Status(fiber.StatusOK).JSON(station)
	}

	return ctx.SendStatus(fiber.StatusNotFound)
}
