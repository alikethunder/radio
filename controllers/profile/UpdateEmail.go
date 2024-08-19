package ProfileEndpoints

import (
	"fmt"

	Users "web_project/db/Users"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"

	"github.com/gocql/gocql"
)

func UpdateEmail(c *fiber.Ctx) error {

	photo, err := c.FormFile("photo")

	if err != nil {
		fmt.Println("[ProfileEndpoints.Update] FormFile error : ", err)
	}

	name := c.FormValue(("name"))
	email := c.FormValue("email")
	id := c.FormValue("id")

	uuid, err := gocql.ParseUUID(id)

	if err != nil {
		fmt.Println("[ProfileEndpoints.Update] ParseUUID error : ", err)
	}

	user, err := Users.GetUserFields(Types.Map{"id": uuid})

	if err != nil {
		fmt.Println("[ProfileEndpoints.Update] GetUserFields error : ", err)
	}

	user["name"] = name

	if photo != nil {
		user["photo"] = photo
	}

	if err := Users.Update(user, uuid, user["email"].(string)); err != nil {

		fmt.Println("[ProfileEndpoints.Update] update user err : ", err)
		return c.SendStatus(fiber.StatusForbidden)
	}

	if user["email"] != email {
		//email was changed

		user["email"] = email

		if err := Users.Delete(user); err != nil {
			fmt.Println("[ProfileEndpoints.Update] delete user err : ", err)
		}

		/*
			todo:
				1. send vc
				2. send StatusAccepted to show popup for verification code
				3. create INSERT function for Users and use instead of Create
				2. create endpoint /api/v1/profile/request-update-email
		*/

		_, err := Users.Insert(user)

		if err != nil {
			fmt.Println("[ProfileEndpoints.Update] Insert user err : ", err)
			return c.SendStatus(fiber.StatusForbidden)
		}

	}

	return c.Status(fiber.StatusOK).JSON(user)

}
