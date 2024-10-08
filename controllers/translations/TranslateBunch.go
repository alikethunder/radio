package TranslationEndpoints

import (
	"strings"
	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func TranslateBunch(c *fiber.Ctx) error {

	//!!todo
	fields := c.Query("fields")

	language := c.Params("language")

	//fmt.Printf("[TranslationEndpoints.TranslateBunch] fields %s, language %s \n", fields, language)

	if fields != "" && language != "" {

		translations_obj := make(fiber.Map)

		fields_arr := strings.Split(fields, ",")

		for _, field := range fields_arr {
			translations_obj[field] = translations.Translate(field, language)
		}

		return c.Status(fiber.StatusOK).JSON(translations_obj)
	}

	return c.SendStatus(fiber.StatusBadRequest)

}
