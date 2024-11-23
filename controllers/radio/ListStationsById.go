package RadioEndpoints

import (
	//"fmt"

	"fmt"
	"web_project/constants"
	"web_project/db"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
)

func ListStationsById(ctx *fiber.Ctx) error {

	var body fiber.Map

	json.Unmarshal(ctx.Body(), &body)

	fmt.Println("[ListStationsById] body : ", body["ids"])

	fmt.Printf("id IN (%s) \n", body["ids"].(string))

	// get all broadcasting stations
	stations := db.List("stations", fiber.Map{"broadcasting": true}, []string{fmt.Sprintf("id IN (%s)", body["ids"].(string))}, constants.Public_Station_List_Props[:]...)

	//fmt.Println("[RadioEndpoints.ListStations] stations ", stations)
	return ctx.Status(fiber.StatusOK).JSON(stations)

}
