package Countries

import (
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func List(language string) (tags []fiber.Map) {

	lang := []string{"en", "flag"}

	if language != "en" {
		lang = append(lang, language)
	}

	countries := db.List("countries", fiber.Map{}, []string{}, "", lang[:]...)

	return countries

}
