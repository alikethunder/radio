package FilesEndpoints

import (
	//"bytes"
	"bytes"
	"fmt"
	"io"

	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func Upload(ctx *fiber.Ctx) error {

	row_id := ctx.Params("row_id")
	table := ctx.Params("table")
	field := ctx.Params("field")

	fmt.Printf("[FilesEndpoints.Upload] row_id %s, table %s, field %s \n", row_id, table, field)

	if row_id != "" && table != "" && field != "" {

		if result, _ := db.SelectRow(table, fiber.Map{"id": row_id}, "id"); result != nil {

			//!!!check if user admin first

			if blob, err := ctx.FormFile(field); err == nil {

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
				}

			} else {
				fmt.Println("[FilesEndpoints.Upload] FormFile error : ", err)
			}
		}
	}

	return ctx.SendStatus(fiber.StatusForbidden)

}
