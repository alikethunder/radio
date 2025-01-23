package SettingsEndpoints

import (
	"encoding/json"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func UploadCountries(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	if admin {
		if form, err := ctx.MultipartForm(); err == nil {
			countries_file := form.File["countries"]

			for _, file := range countries_file {
				var json_data []fiber.Map
				data := make([]byte, file.Size)

				file_data, _ := file.Open()

				file_data.Read(data)
				file_data.Close()

				json.Unmarshal(data, &json_data)

				for _, country := range json_data {

					db.Insert("countries", country)

				}
			}
		}

		return ctx.SendStatus(fiber.StatusOK)
	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
