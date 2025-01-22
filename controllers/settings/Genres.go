package SettingsEndpoints

import (
	"encoding/json"
	"os"
	"strings"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func Genres(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	genres := fiber.Map{}

	var genres_array []fiber.Map

	var station_tag_colors []string

	station_tag_colors_content, _ := os.ReadFile(os.Getenv("TEMPL_PATH") + "/settings/station_tag_colors.json")

	json.Unmarshal(station_tag_colors_content, &station_tag_colors)

	if admin {
		stations := db.List("stations", fiber.Map{}, []string{}, "", "genres")

		for _, station := range stations {

			for _, genre := range station["genres"].([]string) {

				trimmed := strings.TrimSpace(genre)

				genres[trimmed] = fiber.Map{
					"en": trimmed,
				}
			}
		}

		/* for _, genre := range genres {
			genre.(fiber.Map)["color"] = station_tag_colors[rand.Intn(len(station_tag_colors))]
		} */

		for _, genre := range genres {
			genres_array = append(genres_array, genre.(fiber.Map))
		}

		return ctx.Status(fiber.StatusOK).JSON(genres_array)
	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
