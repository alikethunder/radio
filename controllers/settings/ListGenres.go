package SettingsEndpoints

import (
	"web_project/db/Genres"

	"github.com/gofiber/fiber/v2"
)

func ListGenres(ctx *fiber.Ctx) error {

	language := ctx.Params("language")

	if language == "" {
		language = "en"
	}

	genres := Genres.ListGenres(language)

	return ctx.Status(fiber.StatusOK).JSON(genres)

}
