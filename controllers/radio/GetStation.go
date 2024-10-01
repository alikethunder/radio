package RadioEndpoints

import (
	/* "encoding/json"

	"github.com/gocql/gocql" */
	//"fmt"
	"web_project/constants"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func GetStation(ctx *fiber.Ctx) error {

	id := ctx.Params("id")

	station, err := db.SelectRow("stations", fiber.Map{"id": id}, constants.Public_Station_Props[:]...)

	if err == nil {
		return ctx.Status(fiber.StatusOK).JSON(station)
	}

	return ctx.SendStatus(fiber.StatusNotFound)
}
