package RadioEndpoints

import (
	//"bytes"

	"encoding/json"
	"fmt"
	"math/rand"
	"os"

	"web_project/db"
	"web_project/db/Stations"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func UpdateJson(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	if admin {

		if form, err := ctx.MultipartForm(); err == nil {
			info_files := form.File["json"]
			//fmt.Println("[UpdateJson] info_files : ", info_files)

			for _, file := range info_files {
				var json_data []fiber.Map
				//create bucket for file data
				data := make([]byte, file.Size)

				file_data, _ := file.Open()
				//store file data to bucket
				file_data.Read(data)
				file_data.Close()

				json.Unmarshal(data, &json_data)

				//fmt.Println("[UpdateJson] file json : ", json_data)

				for _, json_station := range json_data {

					existing_station, _ := db.SelectRow("stations", fiber.Map{"id": json_station["id"]}, "id")

					var id string
					if existing_station == nil {
						fmt.Println("[UpdateJson] non existing station: ", json_station)

						id = "new"
					} else {
						//fmt.Println("[UpdateJson] existing station: ", existing_station)
						id = existing_station["id"].(gocql.UUID).String()
					}

					//fmt.Println("[UpdateJson] id: ", id)
					json_station["external_enable"] = true
					json_station["broadcasting"] = true

					if json_station["tags"] != nil {

						var station_tag_colors []string

						station_tag_colors_content, _ := os.ReadFile(os.Getenv("TEMPL_PATH") + "/settings/station_tag_colors.json")

						json.Unmarshal(station_tag_colors_content, &station_tag_colors)
						for _, tag := range json_station["tags"].([]interface{}) {
							tag_exists, _ := db.SelectRow("station_tags", fiber.Map{"name": tag.(string)}, "name")

							if tag_exists == nil {
								db.Insert("station_tags", fiber.Map{
									"name":  tag.(string),
									"color": station_tag_colors[rand.Intn(len(station_tag_colors))],
								})
							}
						}
					}
					delete(json_station, "id")

					Stations.Update(id, json_station)
				}
			}

		}

		return ctx.SendStatus(fiber.StatusOK)

	}

	return ctx.SendStatus(fiber.StatusForbidden)

}
