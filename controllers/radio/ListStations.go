package RadioEndpoints

import (
	//"fmt"

	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func ListStations(ctx *fiber.Ctx) error {

	var stations []fiber.Map

	admin := db.CheckRootAdmin(ctx)

	if admin {
		stations = db.List("stations", fiber.Map{})
	} else {
		// get all broadcasting stations + stations where user is admin
		//!! todo: restrict station properties that usual users receive
		stations = db.List("stations", fiber.Map{})
	}

	return ctx.Status(fiber.StatusOK).JSON(stations)

}
