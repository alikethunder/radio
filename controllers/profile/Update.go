package ProfileEndpoints

import (
	"bytes"
	"fmt"
	"io"

	Users "web_project/db/Users"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"

	"github.com/gocql/gocql"
)

func Update(c *fiber.Ctx) error {

	photo, err := c.FormFile("photo")

	if err != nil {
		fmt.Println("[ProfileEndpoints.Update] FormFile error : ", err)
	}

	photo_file, err := photo.Open()

	if err != nil {
		fmt.Println("[ProfileEndpoints.Update] photo.Open error : ", err)
	}

	b := bytes.NewBuffer(nil)
	if _, err := io.Copy(b, photo_file); err != nil {
		fmt.Println("[ProfileEndpoints.Update] io.Copy error : ", err)
	}

	name := c.FormValue(("name"))

	id := c.FormValue("id")

	uuid, err := gocql.ParseUUID(id)

	if err != nil {
		fmt.Println("[ProfileEndpoints.Update] ParseUUID error : ", err)
	}

	user, err := Users.GetUserFields(Types.Map{"id": uuid}, "email")

	if err != nil {
		fmt.Println("[ProfileEndpoints.Update] GetUserFields error : ", err)
	}

	user["name"] = name

	if photo != nil {
		user["photo"] = photo
	}

	if err := Users.Update(Types.Map{"name": name, "photo": b.Bytes()}, uuid, user["email"].(string)); err != nil {

		fmt.Println("[ProfileEndpoints.Update] update user err : ", err)
		return c.SendStatus(fiber.StatusForbidden)
	}

	return c.Status(fiber.StatusOK).JSON(user)

}
