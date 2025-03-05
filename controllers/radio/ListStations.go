package RadioEndpoints

import (
	//"fmt"

	"encoding/json"
	"web_project/constants"
	"web_project/cookies"
	"web_project/db"
	"web_project/functions"

	"github.com/gofiber/fiber/v2"
)

func ListStations(ctx *fiber.Ctx) error {

	var stations []fiber.Map
	var additional_selectors []string

	admin := db.CheckRootAdmin(ctx)

	from := ctx.Query("from")
	limit := ctx.Query("limit")

	if from != "" {
		additional_selectors = append(additional_selectors,
			"token(id) > token("+from+")",
		)
	}

	props := constants.Public_Station_List_Props
	//props := constants.Public_Station_Props()

	if admin {
		stations = db.List("stations", fiber.Map{}, additional_selectors, limit, props[:]...)
	} else {
		// get all broadcasting stations + stations where user is admin
		stations = db.List("stations", fiber.Map{"broadcasting": true}, additional_selectors, limit, props[:]...)

		// get all non-broadcasting stations where user is admin
		current_user_id := cookies.CurrentUserId(ctx)

		if current_user_id != "" {

			additional_selectors = append(additional_selectors, "admins CONTAINS '"+current_user_id+"'")

			admin_stations := db.List("stations", fiber.Map{"broadcasting": false}, additional_selectors, limit, props[:]...)

			//fmt.Println("[RadioEndpoints.ListStations] admin_stations ", admin_stations)

			stations = append(stations, admin_stations...)
		}

	}

	marshalled, _ := json.Marshal(stations)

	enc := functions.Encrypt(string(marshalled))

	return ctx.Status(fiber.StatusOK).SendString(enc)

}
