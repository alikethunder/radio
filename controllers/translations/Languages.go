package TranslationEndpoints

import (
	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func Languages(c *fiber.Ctx) error {

	return c.Status(fiber.StatusOK).JSON(translations.Languages())

}
