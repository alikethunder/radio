package controllers

import (
	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func Manifest(ctx *fiber.Ctx) error {

	language := ctx.AcceptsLanguages(translations.Languages()[:]...)
	//fmt.Println("[Manifest] langs : ", language)

	if language == "" {
		language = "en"
	}

	manifest := fiber.Map{
		"name":             "Radio Best",
		"short_name":       "Radio Best",
		"description":      translations.Dictionary[language]["home_page_description"],
		"theme_color":      "#00a1f7",
		"background_color": "transparent",
		"orientation":      "portrait",
		"categories":       []string{"music", "entertainment", "lifestyle", "news"},
		"display":          "standalone",
		"start_url":        ctx.BaseURL(),
		"manifest_version": 2,
		"version":          "1",
		"shortcuts": []fiber.Map{
			{
				"name":       translations.Dictionary[language]["my_stations"],
				"short_name": translations.Dictionary[language]["my_stations"],
				"url":        ctx.BaseURL() + "/my-stations",
				"icons": []fiber.Map{
					{
						"src":   ctx.BaseURL() + "/star.png",
						"sizes": "120x120",
					},
				},
			},
		},
		"launch_handler": fiber.Map{
			"client_mode": "navigate-existing",
		},
		"permissions": []string{
			"notifications",
		},
		"icons": []fiber.Map{
			{
				"src":   ctx.BaseURL() + "/android-chrome-192x192.png",
				"sizes": "192x192",
				"type":  "image/png",
			},
			{
				"src":   ctx.BaseURL() + "/android-chrome-512x512.png",
				"sizes": "512x512",
				"type":  "image/png",
			},
			{
				"src":   ctx.BaseURL() + "/apple-touch-icon-180x180.png",
				"sizes": "180x180",
				"type":  "image/png",
			},
			{
				"src":     ctx.BaseURL() + "/android-chrome-512x512.png",
				"sizes":   "512x512",
				"type":    "image/png",
				"purpose": "any",
			},
			{
				"src":     ctx.BaseURL() + "/android-chrome-512x512.png",
				"sizes":   "512x512",
				"type":    "image/png",
				"purpose": "maskable",
			},
			{
				"src":   ctx.BaseURL() + "/48x48.png",
				"sizes": "48x48",
				"type":  "image/png",
			},
		},
		"screenshots": []fiber.Map{
			{},
		},
	}

	return ctx.Status(fiber.StatusOK).JSON(manifest)
}
