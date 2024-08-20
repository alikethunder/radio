package FilesEndpoints

import (
	//"bytes"
	"fmt"
	//"io"

	Users "web_project/db/Users"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"

	"github.com/gocql/gocql"
)

func GetPhoto(c *fiber.Ctx) error {

	id := c.Params("id")
	fmt.Println("[ProfileEndpoints.GetPhoto] id : ", id)

	if id != "" {
		uuid, err := gocql.ParseUUID(id)

		if err != nil {
			fmt.Println("[ProfileEndpoints.GetPhoto] ParseUUID error : ", err)
		}

		user, err := Users.GetUserFields(Types.Map{"id": uuid}, "photo")

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
