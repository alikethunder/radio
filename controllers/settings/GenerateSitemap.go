package SettingsEndpoints

import (
	"fmt"
	"os"
	"time"
	"web_project/constants"
	"web_project/db"
	"web_project/translations"

	"github.com/alikethunder/sitemap-generator/smg"
	"github.com/getsentry/sentry-go"
	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func GenerateSitemap(ctx *fiber.Ctx) error {
	admin := db.CheckRootAdmin(ctx)

	if admin {
		// Start the sitemap generation in a goroutine to avoid blocking the HTTP request
		go func() {
			defer func() {
				if r := recover(); r != nil {
					sentry.CaptureMessage(fmt.Sprintf("Sitemap generation panic: %v", r))
				}
			}()

			now := time.Now().UTC()
			baseURL := "https://" + constants.BaseURL

			smi := smg.NewSitemapIndex(true)
			smi.SetCompress(false)
			smi.SetHostname(baseURL)
			smi.SetOutputPath("./served/static/sitemaps/")
			smi.SetServerURI("/sitemaps/")

			sm := smi.NewSitemap()
			sm.SetName("radiobest")
			sm.SetLastMod(&now)
			sm.SetMaxURLsCount(5000)

			languages := translations.Languages

			var main_alternates []*smg.SitemapAlternateLoc

			for _, lang := range languages {
				main_alternates = append(main_alternates, &smg.SitemapAlternateLoc{
					Hreflang: constants.Language_codes[lang].(string),
					Href:     baseURL + "?language=" + lang,
					Rel:      "alternate",
				})
			}

			for _, lang := range languages {
				sm.Add(&smg.SitemapLoc{
					Loc:        "?language=" + lang,
					LastMod:    &now,
					ChangeFreq: smg.Weekly,
					Priority:   1,
					Images:     []*smg.SitemapImage{{ImageLoc: "/android-chrome-192x192.png"}},
					Alternate:  main_alternates,
				})
			}

			for _, station := range db.List("stations", fiber.Map{"broadcasting": true}, []string{}, "", "id") {
				id := station["id"].(gocql.UUID).String()

				var station_alternates []*smg.SitemapAlternateLoc

				for _, lang := range languages {
					station_alternates = append(station_alternates, &smg.SitemapAlternateLoc{
						Hreflang: constants.Language_codes[lang].(string),
						Href:     baseURL + "/station/" + id + "?language=" + lang,
						Rel:      "alternate",
					})
				}

				for _, lang := range languages {
					sm.Add(&smg.SitemapLoc{
						Loc:        "/station/" + id + "?language=" + lang,
						LastMod:    &now,
						ChangeFreq: smg.Weekly,
						Priority:   1,
						Images:     []*smg.SitemapImage{{ImageLoc: "/api/v1/files/stations/" + id + "/avatar"}},
						Alternate:  station_alternates,
					})
				}
			}

			filename, err := smi.Save()
			if err != nil {
				sentry.CaptureMessage(fmt.Sprintf("Unable to Save Sitemap: %s", err))
			}

			if os.Getenv("ENV") == "prod" {
				smi.PingSearchEngines()
			}

			fmt.Println("sitemap_index file:", filename)
		}()

		// Return an immediate response to the client
		return ctx.SendStatus(fiber.StatusOK)
	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
