package controllers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/url"
	"strings"
	"web_project/constants"
	"web_project/cookies"
	"web_project/db"
	"web_project/functions"
	"web_project/translations"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
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

	sitename := translations.Dictionary[language]["sitename"]

	var alternates []fiber.Map
	purl, err := url.Parse(ctx.OriginalURL())
	if err != nil {
		return err
	}

	q := purl.Query()

	for _, lang := range languages {
		code := constants.Language_codes[lang]

		if code == nil {
			code = lang
		}
		q.Set("language", lang)
		purl.RawQuery = q.Encode()
		newURL := purl.String()

		alternates = append(alternates, fiber.Map{
			"url":  ctx.BaseURL() + newURL,
			"code": code,
		})
	}

	head := ``

	injectables := fiber.Map{
		"head":        template.HTML(head),
		"HTML":        "",
		"Language":    language,
		"sitename":    sitename,
		"user_ip":     ctx.IP(),
		"ldjson":      template.JS(`"@type": "RadioBroadcastService", "name" : "` + sitename + `", `),
		"logo":        logo,
		"title":       sitename,
		"alternates":  alternates,
		"Description": translations.Dictionary[language]["home_page_description"],
		"subject":     translations.Dictionary[language]["home_page_description"],
		"Domain":      ctx.BaseURL(),
		"URL":         ctx.OriginalURL(),
		"keywords":    translations.Dictionary[language]["home_page_keywords"],
		"Full_url":    ctx.BaseURL() + ctx.OriginalURL(),
		"quoted_logo": template.JS("\"" + logo + "\""),
	}

	if ctx.Path() == "/" || strings.Contains(ctx.Path(), "/station/") {
		head := `<link rel="stylesheet" id="theme" crossorigin="" href="/assets/themes/soho_dark.css">`

		fmt.Println("Full url : ", ctx.BaseURL()+ctx.OriginalURL())

		/* fmt.Println("BaseURL : ", ctx.BaseURL())
		fmt.Println("OriginalURL : ", ctx.OriginalURL())
		fmt.Println("port : ", os.Getenv("PORT")) */
		ssr_url := "http://localhost:5454" + ctx.OriginalURL()
		/* fmt.Println("ssr_url : ", ssr_url) */
		agent := fiber.Get(ssr_url)
		code, body, errs := agent.String()

		if len(errs) > 0 {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"errs": errs,
			})
		}
		fmt.Println("code : ", code)
		//fmt.Println("body: ", body)

		if ctx.Path() == "/" {
			functions.UpdateMap(injectables, fiber.Map{
				"HTML": template.HTML(body),
				"head": template.HTML(head),

				"content": template.HTML(translations.Dictionary[language]["home_page_content"]),
			})
		}

		if strings.Contains(ctx.Path(), "/station/") {

			station_id := strings.TrimSuffix(strings.TrimPrefix(ctx.Path(), "/station/"), "/")

			fmt.Printf("[Index] station id %s \n", station_id)

			station, _ := db.SelectRow("stations", fiber.Map{"id": station_id}, "id", "name", "description_"+language, "tags", "avatar", "country", "genres")

			station_description := ""
			if station["description_"+language] != nil {
				station_description = station["description_"+language].(string)
			} else {
				station_description = ""
			}

			station_genres := ""
			if station["genres"] != nil {
				if len(station["genres"].([]string)) > 0 {
					for i, genre := range station["genres"].([]string) {
						if genre != "" {
							genre = strings.TrimSpace(genre)
							genre_row, _ := db.SelectRow("genres", fiber.Map{"en": genre}, language, "icon")

							icon := ""
							if genre_row["icon"] != nil {
								icon = genre_row["icon"].(string) + " "
							}

							tr := genre
							if genre_row[language] != nil && genre_row[language] != "" {
								tr = genre_row[language].(string)
							}

							station_genres += icon + tr
							if i < len(station["genres"].([]string))-1 {
								station_genres += ","
							}
						}
					}
				}
			}

			if station["country"] != nil && station["country"] != "" {
				country := strings.TrimSpace(station["country"].(string))
				country_row, _ := db.SelectRow("countries", fiber.Map{"en": country}, "flag", language)

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

			station_tags := strings.Join(station["tags"].([]string), ",")

			logo := template.JS(ctx.BaseURL() + "/api/v1/files/stations/" + fmt.Sprint(station["id"]) + "/avatar")

			translations_obj := translations.TranslateSlice([]string{"genre", "tags", "language"}, language)

			translations_string, _ := json.Marshal(translations_obj)

			head += fmt.Sprintf(`<meta property="og:image:width" content="128" />
        <meta property="og:image:height" content="128" />
				<script>
				globalThis.translations = %s;
				</script>
				`, string(translations_string))

			functions.UpdateMap(injectables, fiber.Map{

				"HTML": template.HTML(body),

				"station": station,

				"Description": template.HTML(station_description),

				"subject": template.HTML(station_description + " " + fmt.Sprint(station["country"]) + ". " + translations.Dictionary[language]["genre"] + ":" + station_genres + "." + translations.Dictionary[language]["tags"] + ":" + station_tags),

				"keywords": fmt.Sprint(station["name"]) + "," + station_genres + "," + station_tags,

				"title": fmt.Sprint(station["name"]) + " - Radio Best",

				"logo": logo,

				"quoted_logo": template.JS("\"" + logo + "\""),

				"head": template.HTML(head),

				"ldjson": template.JS(`"@type": "Radiostation", "name" : "` + fmt.Sprint(station["name"]) + `", `),
			})
		}
	}
	return ctx.Render("public/index", injectables)
}
