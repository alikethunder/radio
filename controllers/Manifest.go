package controllers

import (
	"encoding/json"
	"os"
	"slices"
	"web_project/constants"
	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func Manifest(ctx *fiber.Ctx) error {
	//Manifest is using language preferred by browser
	language := ctx.Query("language")
	//fmt.Println("Manifest Query Language : ", language)

	if language == "" {
		language = ctx.AcceptsLanguages(translations.Languages[:]...)
	}

	languages := translations.Languages

	if language == "" || !slices.Contains(languages, language) {
		language = "en"
	}

	var lang_tags fiber.Map

	lang_tags_json, _ := os.ReadFile(os.Getenv("TEMPL_PATH") + "/settings/languages_tags.json")

	json.Unmarshal(lang_tags_json, &lang_tags)

	//fmt.Println("Manifest Language : ", language)
	manifest := fiber.Map{
		"name":                        "Radio Best",
		"short_name":                  "Radio Best",
		"description":                 translations.Dictionary[language]["home_page_description"],
		"theme_color":                 "#00a1f7",
		"background_color":            "#fff",
		"orientation":                 "portrait",
		"categories":                  []string{"music", "entertainment", "lifestyle", "news"},
		"display":                     "standalone",
		"start_url":                   ctx.BaseURL(),
		"id":                          ctx.BaseURL(),
		"dir":                         "ltr",
		"lang":                        lang_tags[language],
		"prefer_related_applications": false,
		"related_applications": []fiber.Map{
			{
				"platform": "webapp",
				"url":      ctx.BaseURL(),
			},
		},
		"scope": ctx.BaseURL(),
		"scope_extensions": []fiber.Map{
			{
				"origin": "*." + constants.BaseURL,
			},
		},
		"handle_links":     "preferred",
		"manifest_version": 2,
		"version":          os.Getenv("VERSION"),
		"shortcuts": []fiber.Map{
			{
				"name":       translations.Dictionary[language]["my_stations"],
				"short_name": translations.Dictionary[language]["my_stations"],
				"url":        ctx.BaseURL() + "/my-stations",
				"icons": []fiber.Map{
					{
						"src":   ctx.BaseURL() + "/star.png",
						"sizes": "241x241",
					},
				},
			},
		},
		"url_handlers": []fiber.Map{
			{
				"origin": ctx.BaseURL(),
			},
			{
				"origin": "https://*." + constants.BaseURL,
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
			{
				"src":         ctx.BaseURL() + "/screenshot_wide.png",
				"sizes":       "3455x1794",
				"type":        "image/png",
				"form_factor": "wide",
				"label":       translations.Dictionary[language]["main_page"],
			},
			{
				"src":         ctx.BaseURL() + "/screenshot_wide_player.png",
				"sizes":       "3455x1794",
				"type":        "image/png",
				"form_factor": "wide",
				"label":       translations.Dictionary[language]["main_page_with_player"],
			},
			{
				"src":         ctx.BaseURL() + "/screenshot_narrow.png",
				"sizes":       "390x844",
				"type":        "image/png",
				"form_factor": "narrow",
				"label":       translations.Dictionary[language]["main_page"],
			},
			{
				"src":         ctx.BaseURL() + "/screenshot_narrow_player.png",
				"sizes":       "390x844",
				"type":        "image/png",
				"form_factor": "narrow",
				"label":       translations.Dictionary[language]["main_page_with_player"],
			},
		},
	}

	return ctx.Status(fiber.StatusOK).JSON(manifest)
}
