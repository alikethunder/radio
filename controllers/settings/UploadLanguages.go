package SettingsEndpoints

import (
	"encoding/json"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func UploadLanguages(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	if admin {
		if form, err := ctx.MultipartForm(); err == nil {
			genres_file := form.File["languages"]

			for _, file := range genres_file {
				var json_data []fiber.Map
				data := make([]byte, file.Size)

				file_data, _ := file.Open()

				file_data.Read(data)
				file_data.Close()

				json.Unmarshal(data, &json_data)

				for _, language := range json_data {

					db.Update("languages", language, fiber.Map{
						"en": language["en"],
					})

				}
			}
		}

		return ctx.SendStatus(fiber.StatusOK)
	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
