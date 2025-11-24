package FilesEndpoints

import (
	//"bytes"

	//"io"

	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func GetFile(ctx *fiber.Ctx) error {

	row_id := ctx.Params("row_id")
	table := ctx.Params("table")
	field := ctx.Params("field")

	//fmt.Printf("[FilesEndpoints.GetFile] row_id %s, table %s, field %s \n", row_id, table, field)

	/* if table == "stations" && field == "avatar" {
		return ctx.SendStatus(fiber.StatusNotFound)
	} */

	if row_id != "" && table != "" && field != "" {

		if result, _ := db.SelectRow(table, fiber.Map{"id": row_id}, field); result != nil {

			//fmt.Printf("[FilesEndpoints.GetFile] %s %d \n", field, len(result[field].([]byte)))

			if len(result[field].([]byte)) > 0 {
				if table == "stations" && field == "avatar" {
					ctx.Set("Cache-Control", "public, max-age=31536000")
				}
				return ctx.Status(fiber.StatusOK).Send(result[field].([]byte))
			}
		}
	}

	return ctx.SendStatus(fiber.StatusNotFound)

}
