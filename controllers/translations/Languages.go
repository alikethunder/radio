package TranslationEndpoints

import (
	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func Languages(c *fiber.Ctx) error {

	languages := make([]string, len(translations.Dictionary))
	i := 0

	for language := range translations.Dictionary {
		languages[i] = language
		i++
	}

	return c.Status(fiber.StatusOK).JSON(languages)

}
