package SettingsEndpoints

import (
	"fmt"
	"os"
	"time"
	"web_project/constants"
	"web_project/db"
	"web_project/db/StationTags"
	"web_project/translations"

	"github.com/getsentry/sentry-go"
	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
	"github.com/sabloger/sitemap-generator/smg"
)

func GenerateSitemap(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	if admin {
		now := time.Now().UTC()

		smi := smg.NewSitemapIndex(true)
		smi.SetCompress(false)
		smi.SetHostname("https://radio.best")
		smi.SetOutputPath("./served/static/sitemaps/")
		smi.SetServerURI("/sitemaps/")

		sm := smi.NewSitemap()
		sm.SetName("radiobest")
		sm.SetLastMod(&now)

		languages := translations.Languages()

		for _, l := range languages {
			sm.Add(&smg.SitemapLoc{
				Loc:        "?language=" + l,
				LastMod:    &now,
				ChangeFreq: smg.Weekly,
				Priority:   1,
				Images:     []*smg.SitemapImage{{"/android-chrome-192x192.png"}},
			})
		}

		for _, tag := range StationTags.ListTags() {
			for _, l := range languages {
				sm.Add(&smg.SitemapLoc{
					Loc:        "?language=" + l + "?tags=" + tag["name"].(string),
					LastMod:    &now,
					ChangeFreq: smg.Weekly,
					Priority:   1,
					Images:     []*smg.SitemapImage{{"/android-chrome-192x192.png"}},
				})
			}
		}

		for _, station := range db.List("stations", fiber.Map{"broadcasting": true}, []string{}, constants.Public_Station_Props()[:]...) {
			id := station["id"].(gocql.UUID).String()
			for _, l := range languages {
				sm.Add(&smg.SitemapLoc{
					Loc:        "/station/" + id + "?language=" + l,
					LastMod:    &now,
					ChangeFreq: smg.Weekly,
					Priority:   1,
					Images:     []*smg.SitemapImage{{"/api/v1/files/stations/" + id + "/avatar"}},
				})
			}
		}

		filename, err := smi.Save()
		if err != nil {
			sentry.CaptureMessage(fmt.Sprintf("Unable to Save Sitemap: %s", err))
		}

		// Pings the Search engines. default Google and Bing, But you can add any other ping URL's
		// in this format: http://www.google.com/webmasters/tools/ping?sitemap=%s

		if os.Getenv("ENV") == "prod" {
			smi.PingSearchEngines()
		}

		fmt.Println("sitemap_index file:", filename)

		if err == nil {
			return ctx.SendStatus(fiber.StatusOK)
		}
	}

	return ctx.SendStatus(fiber.StatusForbidden)
}
