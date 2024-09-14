package RadioEndpoints

import (
	//"fmt"

	"web_project/db"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
)

func ListStations(ctx *fiber.Ctx) error {

	var stations []Types.Map

	/* offset := 0

	if ctx.Query("offset") != "" {
		offset, _ = strconv.Atoi(ctx.Query("offset"))
	}

	limit := 0

	if ctx.Query("offset") != "" {
		limit, _ = strconv.Atoi(ctx.Query("offset"))
	} */

	iter := db.Session.Query(`SELECT * FROM stations`).Iter()

	for {
		station := make(Types.Map)
		if !iter.MapScan(station) {
			break
		}
		//fmt.Println("plan : ", plan)
		stations = append(stations, station)

	}

	return ctx.Status(fiber.StatusOK).JSON(stations)

}
