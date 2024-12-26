package SettingsEndpoints

import (
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

		//fmt.Println("[IndexNow] stations : ", stations)

		total_urls := len(stations) * len(translations.Languages())
		//fmt.Println("[IndexNow] total_urls : ", total_urls)

		total_lists := int(math.Ceil(float64(total_urls) / urlListLength))
		//fmt.Println("[IndexNow] total_lists : ", total_lists)
		responses := make([]fiber.Map, total_lists)

		i := 0
		n := 0

		for n < total_lists {
			remaining := total_urls - n*urlListLength
			//fmt.Println("[IndexNow] remaining : ", remaining)
			var length int

			if remaining >= urlListLength {
				length = urlListLength
			} else {
				length = remaining
			}
			urlList := make([]string, length)

			for _, station := range stations {
				station_id := station["id"].(gocql.UUID).String()

				station_url := "https://" + constants.BaseURL + "/station/" + station_id

				for _, lang := range translations.Languages() {

					urlList[i] = station_url + "?language=" + lang
					//fmt.Println("[IndexNow] urlList[ ", i, "] : ", urlList[i])
					i++

					if n == total_lists-1 {

						if i == remaining {
							break
						}
					} else {
						if i == urlListLength {
							i = 0
						}
					}
				}
			}

			//fmt.Println("[IndexNow] urlList : ", urlList)
			//send urlList to indexnow

			agent := fiber.Post("https://api.indexnow.org/indexnow")

			agent.JSON(fiber.Map{
				"host":        constants.BaseURL,
				"key":         key,
				"keyLocation": "https://" + constants.BaseURL + "/" + key + ".txt",
				"urlList":     urlList,
			})

			status, response, errs := agent.Bytes()

			responses[n] = fiber.Map{
				"status":   status,
				"response": response,
				"errs":     errs,
			}
			n++

		}
		return ctx.Status(fiber.StatusOK).JSON(responses)

	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
