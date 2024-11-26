package controllers

import (
	"fmt"
	"html/template"
	"slices"
	"strings"
	"web_project/cookies"
	"web_project/db"
	"web_project/db/StationTags"
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

	languages := slices.DeleteFunc(translations.Languages(), func(e string) bool {
		return e == language
	})

	query_tags := ctx.Query("tags")

	var tags []string

	additional_selectors := []string{}

	if query_tags == "" {

		tags_list := StationTags.ListTags()

		tags = make([]string, len(tags_list))

		for i, tag_map := range tags_list {
			tags[i] = tag_map["name"].(string)
		}
	} else {
		tags = strings.Split(query_tags, ",")
		additional_selectors = append(additional_selectors, "tags CONTAINS '"+query_tags+"'")
	}

	stations_list := db.List("stations", fiber.Map{"broadcasting": true}, additional_selectors, "id", "name")

	if agents.IsCrawler(ctx.Get("User-Agent")) {

		if ctx.Path() == "/" {

			logo := template.JS(ctx.BaseURL() + "/android-chrome-192x192.png")

			return ctx.Render("seo/home", fiber.Map{
				"Description":                      translations.Dictionary[language]["home_page_description"],
				"content":                          template.HTML(translations.Dictionary[language]["home_page_content"]),
				"keywords":                         translations.Dictionary[language]["home_page_keywords"],
				"Tags":                             translations.Dictionary[language]["tags"],
				"Tags_list":                        tags,
				"Language":                         language,
				"Languages":                        languages,
				"URL":                              ctx.OriginalURL(),
				"Domain":                           ctx.BaseURL(),
				"Full_url":                         template.JS("\"" + fmt.Sprintf("%s%s", ctx.BaseURL(), ctx.OriginalURL()) + "\""),
				"Stations":                         translations.Dictionary[language]["radiostations"],
				"Stations_list":                    stations_list,
				"links_to_page_on_other_languages": translations.Dictionary[language]["links_to_page_on_other_languages"],
				"sitename":                         translations.Dictionary[language]["sitename"],
				"logo":                             logo,
				"quoted_logo":                      template.JS("\"" + logo + "\""),
			})
		}

		if strings.Contains(ctx.Path(), "/station/") {

			fmt.Printf("[Index] language %s \n", language)

			station_id := strings.TrimSuffix(strings.TrimPrefix(ctx.Path(), "/station/"), "/")

			fmt.Printf("[Index] station id %s \n", station_id)

			station, _ := db.SelectRow("stations", fiber.Map{"id": station_id}, "id", "name", "description_"+language, "tags", "avatar")

			logo := template.JS(ctx.BaseURL() + "/api/v1/files/stations/" + station_id + "/avatar")

			station_description := ""
			if station["description_"+language] != nil {
				station_description = station["description_"+language].(string)
			} else {
				station_description = ""
			}

			return ctx.Render("seo/station", fiber.Map{
				"station":                          station,
				"Language":                         language,
				"Languages":                        languages,
				"description":                      template.HTML(station_description),
				"Tags":                             translations.Dictionary[language]["tags"],
				"URL":                              ctx.OriginalURL(),
				"Domain":                           ctx.BaseURL(),
				"Full_url":                         template.JS("\"" + fmt.Sprintf("%s%s", ctx.BaseURL(), ctx.OriginalURL()) + "\""),
				"links_to_page_on_other_languages": translations.Dictionary[language]["links_to_page_on_other_languages"],
				"sitename":                         translations.Dictionary[language]["sitename"],
				"logo":                             logo,
				"quoted_logo":                      template.JS("\"" + logo + "\""),
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
		"Description":                      translations.Dictionary[language]["home_page_description"],
		"keywords":                         translations.Dictionary[language]["home_page_keywords"],
		"Tags":                             translations.Dictionary[language]["tags"],
		"Tags_list":                        tags,
		"Language":                         language,
		"Languages":                        languages,
		"URL":                              ctx.OriginalURL(),
		"Domain":                           ctx.BaseURL(),
		"Full_url":                         template.JS("\"" + fmt.Sprintf("%s%s", ctx.BaseURL(), ctx.OriginalURL()) + "\""),
		"Stations":                         translations.Dictionary[language]["radiostations"],
		"Stations_list":                    stations_list,
		"links_to_page_on_other_languages": translations.Dictionary[language]["links_to_page_on_other_languages"],
		"sitename":                         translations.Dictionary[language]["sitename"],
		"logo":                             logo,
		"quoted_logo":                      template.JS("\"" + logo + "\""),
	})
}
