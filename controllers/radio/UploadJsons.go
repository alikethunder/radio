package RadioEndpoints

import (
	//"bytes"

	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"strings"

	"web_project/db"
	"web_project/db/Stations"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func UploadJsons(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	if admin {

		if form, err := ctx.MultipartForm(); err == nil {
			data_files := form.File["json_data"]
			info_files := form.File["json_info"]

			var station_tag_colors []string

			station_tag_colors_content, _ := os.ReadFile(os.Getenv("TEMPL_PATH") + "/settings/station_tag_colors.json")

			json.Unmarshal(station_tag_colors_content, &station_tag_colors)
			//fmt.Println("[UploadJsons] info_files : ", info_files)

			for _, file := range info_files {
				var json_data []fiber.Map
				//create bucket for file data
				data := make([]byte, file.Size)

				file_data, _ := file.Open()
				//store file data to bucket
				file_data.Read(data)
				file_data.Close()

				json.Unmarshal(data, &json_data)

				//fmt.Println("[UploadJsons] file json : ", json_data)

				for _, json_station := range json_data {

					existing_station, _ := db.SelectRow("stations", fiber.Map{"name": json_station["name"]}, "id")

					var id string
					if existing_station == nil {
						id = "new"
					} else {
						fmt.Println("[UploadJsons] existing station: ", existing_station)
						id = existing_station["id"].(gocql.UUID).String()
					}

					fmt.Println("[UploadJsons] id: ", id)
					json_station["external_enable"] = true
					json_station["broadcasting"] = true
					json_station["languages"] = strings.Split(json_station["languages"].(string), ",")
					json_station["genres"] = strings.Split(json_station["genres"].(string), ",")

					for _, tag := range json_station["tags"].([]interface{}) {
						tag_exists, _ := db.SelectRow("station_tags", fiber.Map{"name": tag.(string)}, "name")

						if tag_exists == nil {
							db.Insert("station_tags", fiber.Map{"name": tag.(string), "color": station_tag_colors[rand.Intn(len(station_tag_colors))]})
						}
					}

					Stations.Update(id, json_station)
				}
			}

			for _, file := range data_files {
				var json_data []fiber.Map
				//create bucket for file data
				data := make([]byte, file.Size)

				file_data, _ := file.Open()
				//store file data to bucket
				file_data.Read(data)
				file_data.Close()

				json.Unmarshal(data, &json_data)

				//fmt.Println("[UploadJsons] file json : ", json_data)
				//todo: find station by name and update it

				for _, json_station := range json_data {

					existing_station, _ := db.SelectRow("stations", fiber.Map{"name": json_station["name"]}, "id")

					var id string
					if existing_station == nil {
						id = "new"
					} else {
						//fmt.Println("[UploadJsons] existing station: ", existing_station)
						id = existing_station["id"].(gocql.UUID).String()
					}

					fmt.Println("[UploadJsons] id: ", id)
					json_station["avatar"], _ = base64.StdEncoding.DecodeString(json_station["avatar"].(string))

					Stations.Update(id, json_station)
				}
			}
		}

		return ctx.SendStatus(fiber.StatusOK)

	}

	return ctx.SendStatus(fiber.StatusForbidden)

}
