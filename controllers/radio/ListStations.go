package RadioEndpoints

import (
	//"fmt"

	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func ListStations(ctx *fiber.Ctx) error {

	return ctx.Status(fiber.StatusOK).JSON(db.List("stations", fiber.Map{}))

}
