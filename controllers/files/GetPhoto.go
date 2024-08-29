package FilesEndpoints

import (
	//"bytes"
	"fmt"
	//"io"

	Users "web_project/db/Users"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
)

func GetPhoto(c *fiber.Ctx) error {

	id := c.Params("id")
	fmt.Println("[ProfileEndpoints.GetPhoto] id : ", id)

	if id != "" {

		user, err := Users.GetUserFields(Types.Map{"id": id}, "photo")

		if err != nil {
			fmt.Println("[ProfileEndpoints.GetPhoto] GetUserFields error : ", err)
		}

		fmt.Println("[ProfileEndpoints.GetPhoto] photo : ", len(user["photo"].([]byte)))

		if len(user["photo"].([]byte)) > 0 {
			return c.Status(fiber.StatusOK).Send(user["photo"].([]byte))
		}
	}

	return c.SendStatus(fiber.StatusNotFound)

}
