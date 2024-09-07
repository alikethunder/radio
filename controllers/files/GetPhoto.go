package FilesEndpoints

import (
	//"bytes"
	"fmt"
	//"io"

	"web_project/db"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
)

func GetFile(c *fiber.Ctx) error {

	row_id := c.Params("row_id")
	table := c.Params("table")
	field := c.Params("field")
	fmt.Printf("[ProfileEndpoints.GetFile] row_id %s, table %s, field %s \n", row_id, table, field)

	if row_id != "" && table != "" && field != "" {

		if result, _ := db.Select(table, Types.Map{"id": row_id}, field); result != nil {

			fmt.Printf("[ProfileEndpoints.GetFile] %s %d \n", field, len(result[field].([]byte)))

			if len(result[field].([]byte)) > 0 {
				return c.Status(fiber.StatusOK).Send(result[field].([]byte))
			}
		}
	}

	return c.SendStatus(fiber.StatusBadRequest)

}
