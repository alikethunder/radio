package controllers

import (
	"fmt"
	"strings"
	"web_project/cookies"
	"web_project/db"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Index(ctx *fiber.Ctx) error {

	fmt.Printf("[Index] path %s \n", ctx.Path())

	/* if ctx.Path() == "/" {
		language := ctx.Query("language")

		if language == "" {
			language = "en"
		}

		fmt.Printf("[Index] language %s \n", language)

		tags_list := StationTags.ListTags()

		tags := make([]string, len(tags_list))

		for i, tag_map := range tags_list {
			tags[i] = tag_map["name"].(string)
		}

		languages := strings.ReplaceAll(strings.ReplaceAll(strings.Join(translations.Languages(), ","), language+",", ""), language, "")

		return ctx.Render("seo/home", fiber.Map{
			"Description": translations.Dictionary[language]["home_page_description"],
			"Tags":        translations.Dictionary[language]["tags"],
			"Tags_list":   strings.Join(tags, ","),
			"Language":    language,
			"Languages":   languages,
			"URL":         ctx.OriginalURL(),
			"Domain":      ctx.BaseURL(),
		})
	} */

	if strings.Contains(ctx.Path(), "/station/") {
		language := ctx.Query("language")

		if language == "" {
			language = "en"
		}

		fmt.Printf("[Index] language %s \n", language)

		station_id := strings.TrimPrefix(ctx.Path(), "/station/")

		fmt.Printf("[Index] station id %s \n", station_id)

		return ctx.Render("seo/station", fiber.Map{
			"Title": "station " + station_id,
		})
	}

	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie == "" {
		authCookie = ctx.Query("auth")
	}

	//fmt.Println("[controllers.Index] authCookie ", ctx.GetReqHeaders())

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(authCookie)

		if cookie_user["id"] != nil {

			user, err := db.SelectRow("users", fiber.Map{"email": cookie_user["email"]}, "id", "name", "email", "subscription_plan", "admin")

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

	return ctx.Render("public/index", fiber.Map{})
}
