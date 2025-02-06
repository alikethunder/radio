package RadioEndpoints

import (
	"encoding/json"
	"fmt"

	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func RemoveJsons(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	if admin {

		if form, err := ctx.MultipartForm(); err == nil {
			files := form.File["json"]

			for _, file := range files {
				var json_data []string
				//create bucket for file data
				data := make([]byte, file.Size)

				file_data, _ := file.Open()
				//store file data to bucket
				file_data.Read(data)
				file_data.Close()

				json.Unmarshal(data, &json_data)

				fmt.Println("[RemoveJsons] file json : ", json_data)

				for _, json_station_id := range json_data {

					err := db.Delete("stations", fiber.Map{"id": json_station_id})

					if err != nil {
						fmt.Println("[RemoveJsons] error: ", err)
					}
				}
			}
		}

		return ctx.SendStatus(fiber.StatusOK)

	}

	return ctx.SendStatus(fiber.StatusForbidden)

}
