package SettingsEndpoints

import (
	"web_project/db/Countries"

	"github.com/gofiber/fiber/v2"
)

func ListCountries(ctx *fiber.Ctx) error {

	language := ctx.Params("language")

	if language == "" {
		language = "en"
	}

	countries := Countries.List(language)

	return ctx.Status(fiber.StatusOK).JSON(countries)

}
