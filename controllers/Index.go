package controllers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"os"
	"strings"
	"web_project/constants"
	"web_project/cookies"
	"web_project/db"
	"web_project/translations"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
	agents "github.com/monperrus/crawler-user-agents"
)

func Index(ctx *fiber.Ctx) error {

	if strings.Contains(ctx.BaseURL(), "www.") {
		return ctx.Redirect(strings.Replace(ctx.BaseURL(), "www.", "", 1) + ctx.OriginalURL())
	}

	language := ctx.Query("language")

	if language == "" {
		language = "en"
	}

	languages := translations.Languages()

	var languages_maps []fiber.Map

	for _, lang := range languages {
		code := constants.Language_codes[lang]

		if code == nil {
			code = lang
		}

		languages_maps = append(languages_maps, fiber.Map{
			"name": lang,
			"code": code,
		})
	}

	if agents.IsCrawler(ctx.Get("User-Agent")) {

		var lang_translations fiber.Map

		lang_translations_json, _ := os.ReadFile(os.Getenv("TEMPL_PATH") + "/settings/languages_translations.json")

		json.Unmarshal(lang_translations_json, &lang_translations)

		for _, lang_map := range languages_maps {
			lang_map["translation"] = lang_translations[lang_map["name"].(string)]
		}

		if ctx.Path() == "/" {

			logo := template.JS(ctx.BaseURL() + "/android-chrome-192x192.png")

			return ctx.Render("seo/home", fiber.Map{
				"Language": language,

				"sitename": translations.Dictionary[language]["sitename"],

				"Languages": languages_maps,

				"Description": translations.Dictionary[language]["home_page_description"],

				"content": template.HTML(translations.Dictionary[language]["home_page_content"]),

				"keywords": translations.Dictionary[language]["home_page_keywords"],

				"URL": ctx.OriginalURL(),

				"Domain": ctx.BaseURL(),

				"Full_url": template.JS("\"" + fmt.Sprintf("%s%s", ctx.BaseURL(), ctx.OriginalURL()) + "\""),

				"links_to_page_on_other_languages": translations.Dictionary[language]["links_to_page_on_other_languages"],

				"logo": logo,

				"quoted_logo": template.JS("\"" + logo + "\""),
			})
		}

		if strings.Contains(ctx.Path(), "/station/") {

			fmt.Printf("[Index] language %s \n", language)

			station_id := strings.TrimSuffix(strings.TrimPrefix(ctx.Path(), "/station/"), "/")

			fmt.Printf("[Index] station id %s \n", station_id)

			station, _ := db.SelectRow("stations", fiber.Map{"id": station_id}, "id", "name", "description_"+language, "tags", "avatar", "country", "genres")

			logo := template.JS(ctx.BaseURL() + "/api/v1/files/stations/" + station_id + "/avatar")

			station_description := ""
			if station["description_"+language] != nil {
				station_description = station["description_"+language].(string)
			} else {
				station_description = ""
			}

			if station["genres"] != nil {
				if len(station["genres"].([]string)) > 0 {
					for i, genre := range station["genres"].([]string) {
						if genre != "" {
							genre_row, _ := db.SelectRow("genres", fiber.Map{"en": genre}, language, "icon")

							station["genres"].([]string)[i] = genre_row["icon"].(string) + " " + genre_row[language].(string)
						}
					}
				}
			}

			if station["country"] != nil && station["country"] != "" {
				country_row, _ := db.SelectRow("countries", fiber.Map{"en": station["country"]}, "flag", language)

				flag := ""
				lang := ""

				if country_row["flag"] != nil {
					flag = country_row["flag"].(string) + " "
				}

				if country_row[language] != nil {
					lang = country_row[language].(string)
				}

				station["country"] = flag + lang
			}

			return ctx.Render("seo/station", fiber.Map{
				"station": station,

				"Language": language,

				"Languages": languages_maps,

				"description": template.HTML(station_description),

				"Tags": translations.Dictionary[language]["tags"],

				"URL": ctx.OriginalURL(),

				"Domain": ctx.BaseURL(),

				"Full_url": template.JS("\"" + fmt.Sprintf("%s%s", ctx.BaseURL(), ctx.OriginalURL()) + "\""),

				"links_to_page_on_other_languages": translations.Dictionary[language]["links_to_page_on_other_languages"],

				"sitename": translations.Dictionary[language]["sitename"],

				"logo": logo,

				"quoted_logo": template.JS("\"" + logo + "\""),
			})
		}
	}

	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie == "" {
		authCookie = ctx.Query("auth")
	}

	fmt.Println("[controllers.Index] authCookie ", authCookie)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(authCookie)

		if cookie_user["id"] != nil {

			user, err := db.SelectRow("users", fiber.Map{"email": cookie_user["email"]}, "id", "name", "email", "subscription_plan", "admin", "favorite_stations")

			if err != nil {
				fmt.Printf("[controllers.Index] ClearAuthCookies 1 \n")

				cookies.ClearAuthCookies(ctx)

			} else {

				user["created"] = user["id"].(gocql.UUID).Time()

				cookies.SetUserCookie(user, ctx)

				cookies.SetAuthCookie(cookie_user, ctx)
			}

		} else {
			fmt.Printf("[controllers.Index] ClearAuthCookies 2 \n")
			cookies.ClearAuthCookies(ctx)
		}

	} else {
		fmt.Printf("[controllers.Index] ClearAuthCookies 3 \n")
		cookies.ClearAuthCookies(ctx)
	}

	logo := template.JS(ctx.BaseURL() + "/android-chrome-192x192.png")

	return ctx.Render("public/index", fiber.Map{
		"Language": language,

		"sitename": translations.Dictionary[language]["sitename"],

		"Description": translations.Dictionary[language]["home_page_description"],

		"Languages": languages_maps,

		"keywords": translations.Dictionary[language]["home_page_keywords"],

		"URL": ctx.OriginalURL(),

		"Domain": ctx.BaseURL(),

		"Full_url": template.JS("\"" + fmt.Sprintf("%s%s", ctx.BaseURL(), ctx.OriginalURL()) + "\""),

		"logo": logo,

		"quoted_logo": template.JS("\"" + logo + "\""),
	})
}
