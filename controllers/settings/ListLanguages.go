package SettingsEndpoints

import (
	"web_project/db/Languages"

	"github.com/gofiber/fiber/v2"
)

func ListLanguages(ctx *fiber.Ctx) error {

	language := ctx.Params("language")

	if language == "" {
		language = "en"
	}

	languages := Languages.List(language)

	return ctx.Status(fiber.StatusOK).JSON(languages)

}
