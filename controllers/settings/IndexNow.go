package SettingsEndpoints

import (
	"fmt"
	"math"
	"web_project/constants"
	"web_project/db"
	"web_project/translations"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

const urlListLength = 9500
const key = "7fbf9f93-4ae3-4375-acfd-a3b1e049d992"

func IndexNow(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	if admin {

		stations := db.List("stations", fiber.Map{"broadcasting": true}, []string{}, "", "id")

		total_urls := len(stations) * len(translations.Languages())
		//fmt.Println("[IndexNow] total_urls : ", total_urls)

		urlList := make([]string, total_urls)

		i := 0

		for _, station := range stations {
			station_id := station["id"].(gocql.UUID).String()

			station_url := "https://" + constants.BaseURL + "/station/" + station_id

			for _, lang := range translations.Languages() {

				urlList[i] = station_url + "?language=" + lang
				i++

			}
		}

		responses := []fiber.Map{}
		n := 0

		for n < total_urls {
			fin := math.Min(float64(n+urlListLength), float64(total_urls))

			//send urlList to indexnow

			agent := fiber.Post("https://api.indexnow.org/indexnow")

			fmt.Printf("[IndexNow] urlList[%d:%d] : %v\n", n, int(fin), urlList[n:int(fin)])

			agent.JSON(fiber.Map{
				"host":        constants.BaseURL,
				"key":         key,
				"keyLocation": "https://" + constants.BaseURL + "/" + key + ".txt",
				"urlList":     urlList[n:int(fin)],
			})

			status, response, errs := agent.Bytes()

			responses = append(responses, fiber.Map{
				"status":   status,
				"response": response,
				"errs":     errs,
			})

			n += urlListLength

		}
		return ctx.Status(fiber.StatusOK).JSON(responses)

	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
