package TranslationEndpoints

import (
	"fmt"

	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func Translate(c *fiber.Ctx) error {

	field := c.Params("field")
	fmt.Printf("[FilesEndpoints.GetFile] field %s \n", field)

	if field != "" {
		var translation string

		translation, ok := translations.Ru[field]

		if !ok {
			translation = translations.En[field]
		}

		fmt.Printf("[TranslationEndpoints.Translate] field %s translation %s \n", field, translation)

		return c.Status(fiber.StatusOK).Send([]byte(translation))
	}

	return c.SendStatus(fiber.StatusBadRequest)

}
