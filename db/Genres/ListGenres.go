package Genres

import (
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func ListGenres(language string) (tags []fiber.Map) {

	lang := []string{"en", "color", "icon"}

	if language != "en" {
		lang = append(lang, language)
	}

	genres := db.List("genres", fiber.Map{}, []string{}, "", lang[:]...)

	return genres

}
