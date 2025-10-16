package translations

import (
	"github.com/gofiber/fiber/v2"
)

func TranslateSlice(fields []string, language string) fiber.Map {

	translations := make(fiber.Map)
	for _, field := range fields {
		translations[field] = Translate(field, language)
	}
	return translations
}
