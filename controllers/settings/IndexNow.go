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

func IndexNow(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	if admin {

		stations := db.List("stations", fiber.Map{"broadcasting": true}, []string{}, "", "id")

		//fmt.Println("[IndexNow] stations : ", stations)

		total_urls := len(stations) * len(translations.Languages())
		//fmt.Println("[IndexNow] total_urls : ", total_urls)

		total_lists := int(math.Ceil(float64(total_urls) / urlListLength))
		//fmt.Println("[IndexNow] total_lists : ", total_lists)

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
			n++
			//send urlList to indexnow
		}

		//fmt.Println("[IndexNow] urlLists : ", urlLists)

		/* if err == nil {
			return ctx.SendStatus(fiber.StatusOK)
		} */
	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
