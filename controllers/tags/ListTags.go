package StationTagsEndpoints

import (
	//"fmt"

	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func ListTags(ctx *fiber.Ctx) error {

	var tags []fiber.Map

	iter := db.Session.Query(`SELECT * FROM station_tags`).Iter()

	for {
		tag := make(fiber.Map)
		if !iter.MapScan(tag) {
			break
		}
		//fmt.Println("plan : ", plan)
		tags = append(tags, tag)

	}

	return ctx.Status(fiber.StatusOK).JSON(tags)

}
