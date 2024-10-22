package StationTags

import (
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func ListTags() (tags []fiber.Map) {

	iter := db.Session.Query(`SELECT * FROM station_tags`).Iter()

	for {
		tag := make(fiber.Map)
		if !iter.MapScan(tag) {
			break
		}
		tags = append(tags, tag)

	}

	return tags

}
