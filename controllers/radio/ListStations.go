package RadioEndpoints

import (
	//"fmt"

	"fmt"
	"web_project/constants"
	"web_project/cookies"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func ListStations(ctx *fiber.Ctx) error {

	var stations []fiber.Map

	admin := db.CheckRootAdmin(ctx)

	if admin {
		stations = db.List("stations", fiber.Map{}, []string{})
	} else {
		// get all broadcasting stations + stations where user is admin
		//!! todo: restrict station properties that usual users receive
		stations = db.List("stations", fiber.Map{"broadcasting": true}, []string{}, constants.Public_Station_Props[:]...)

		// get all non-broadcasting stations where user is admin
		current_user_id := cookies.CurrentUserId(ctx)

		if current_user_id != "" {

			admin_stations := db.List("stations", fiber.Map{"broadcasting": false}, []string{"admins CONTAINS '" + current_user_id + "'"})

			fmt.Println("[RadioEndpoints.ListStations] admin_stations ", admin_stations)

			stations = append(stations, admin_stations...)
		}

	}

	return ctx.Status(fiber.StatusOK).JSON(stations)

}
