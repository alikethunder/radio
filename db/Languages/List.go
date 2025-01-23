package Languages

import (
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func List(language string) (tags []fiber.Map) {

	lang := []string{"en"}

	if language != "en" {
		lang = append(lang, language)
	}

	languages := db.List("languages", fiber.Map{}, []string{}, "", lang[:]...)

	return languages

}
