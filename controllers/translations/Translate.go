package TranslationEndpoints

import (
	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func Translate(c *fiber.Ctx) error {

	field := c.Params("field")

	language := c.Params("language")

	//fmt.Printf("[FilesEndpoints.GetFile] field %s \n", field)

	if field != "" && language != "" {

		var translation string

		translation, ok := translations.Dictionary[language][field]

		if !ok {
			translation = translations.Dictionary["en"][field]
		}

		//fmt.Printf("[TranslationEndpoints.Translate] field %s translation %s \n", field, translation)

		return c.Status(fiber.StatusOK).Send([]byte(translation))
	}

	return c.SendStatus(fiber.StatusBadRequest)

}
