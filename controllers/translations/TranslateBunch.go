package TranslationEndpoints

import (
	"strings"
	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func TranslateBunch(c *fiber.Ctx) error {

	fields := c.Query("fields")

	language := c.Params("language")

	//fmt.Printf("[TranslationEndpoints.TranslateBunch] fields %s, language %s \n", fields, language)

	if fields != "" && language != "" {

		translations_obj := translations.TranslateSlice(strings.Split(fields, ","), language)

		return c.Status(fiber.StatusOK).JSON(translations_obj)
	}

	return c.SendStatus(fiber.StatusBadRequest)

}
