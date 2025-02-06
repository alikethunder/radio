package SettingsEndpoints

import (
	"strings"
	"web_project/db"
	"web_project/db/Stations"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func TrimStations(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	if admin {

		fields := []string{"genres", "tags", "languages"}

		for _, station := range db.List("stations", fiber.Map{"broadcasting": true}, []string{}, "", "id", "genres", "tags", "country", "languages") {

			id := station["id"].(gocql.UUID).String()

			station["country"] = strings.TrimSpace(station["country"].(string))

			for _, field := range fields {
				for i, value := range station[field].([]string) {
					station[field].([]string)[i] = strings.TrimSpace(value)
				}
			}

			delete(station, "id")

			Stations.Update(id, station)
		}

		return ctx.SendStatus(fiber.StatusOK)
	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
