package FilesEndpoints

import (
	//"bytes"
	"fmt"
	//"io"

	"web_project/db"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
)

func GetPhoto(c *fiber.Ctx) error {

	id := c.Params("id")
	fmt.Println("[ProfileEndpoints.GetPhoto] id : ", id)

	if id != "" {

		user, _ := db.Select("users", Types.Map{"id": id}, "photo")

		fmt.Println("[ProfileEndpoints.GetPhoto] photo : ", len(user["photo"].([]byte)))

		if len(user["photo"].([]byte)) > 0 {
			return c.Status(fiber.StatusOK).Send(user["photo"].([]byte))
		}
	}

	return c.SendStatus(fiber.StatusNotFound)

}
