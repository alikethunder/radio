package RadioEndpoints

import (
	//"bytes"

	"encoding/json"
	"fmt"

	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func UploadJsons(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	if admin {

		if form, err := ctx.MultipartForm(); err == nil {
			//data_files := form.File["json_data"]

			info_files := form.File["json_info"]

			for _, file := range info_files {
				var json_data []fiber.Map
				data := make([]byte, file.Size)

				file_data, _ := file.Open()

				file_data.Read(data)
				file_data.Close()
				json.Unmarshal(data, &json_data)
				fmt.Println("[UploadJsons] info file json : ", json_data)
				//todo: find station by name and update it
			}
			//todo: same for data_files
		}

		return ctx.SendStatus(fiber.StatusOK)
		/* if blob, err := ctx.FormFile(field); err == nil {

		bts := bytes.NewBuffer(nil)

		file_bts, err := blob.Open()

		if err != nil {
			fmt.Println("[FilesEndpoints.Upload] photo.Open error : ", err)
		}

		if _, err := io.Copy(bts, file_bts); err == nil {

			if err := db.Update(
				table,
				fiber.Map{
					field: bts.Bytes(),
				},
				fiber.Map{"id": row_id},
			); err == nil {
				return ctx.SendStatus(fiber.StatusOK)
			}

		} else {
			fmt.Println("[FilesEndpoints.Upload] io.Copy error : ", err)
		} */

	} else {
		//fmt.Println("[FilesEndpoints.Upload] FormFile error : ", err)
	}

	return ctx.SendStatus(fiber.StatusForbidden)

}
