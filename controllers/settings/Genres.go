package SettingsEndpoints

import (
	"encoding/json"
	"os"
	"web_project/db"

	"math/rand"

	"github.com/gofiber/fiber/v2"
)

func UploadGenres(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	var station_tag_colors []string

	station_tag_colors_content, _ := os.ReadFile(os.Getenv("TEMPL_PATH") + "/settings/station_tag_colors.json")

	json.Unmarshal(station_tag_colors_content, &station_tag_colors)

	if admin {
		if form, err := ctx.MultipartForm(); err == nil {
			genres_file := form.File["genres"]

			for _, file := range genres_file {
				var json_data []fiber.Map
				data := make([]byte, file.Size)

				file_data, _ := file.Open()

				file_data.Read(data)
				file_data.Close()

				json.Unmarshal(data, &json_data)

				for _, genre := range json_data {

					genre["color"] = station_tag_colors[rand.Intn(len(station_tag_colors))]

					db.Insert("genres", genre)

				}
			}
		}

		return ctx.SendStatus(fiber.StatusOK)
	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
