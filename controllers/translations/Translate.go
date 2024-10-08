package TranslationEndpoints

import (
	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func Translate(c *fiber.Ctx) error {

	field := c.Params("field")

	language := c.Params("language")

	if field != "" && language != "" {

		return c.Status(fiber.StatusOK).Send([]byte(translations.Translate(field, language)))
	}

	return c.SendStatus(fiber.StatusBadRequest)

}
