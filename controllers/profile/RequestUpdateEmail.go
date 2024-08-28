package ProfileEndpoints

import (
	"encoding/json"
	"fmt"

	Users "web_project/db/Users"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
	//"github.com/gocql/gocql"
)

func RequestUpdateEmail(c *fiber.Ctx) error {

	var req_json Types.Map

	json.Unmarshal(c.Body(), &req_json)

	user, err := Users.GetUserFields(Types.Map{"email": req_json["email"]}, "id", "password", "name")

	if err != nil {
		fmt.Println("[Signin] GetUserFields error : ", err)
	}

	if user != nil {
		//user exists
		/*
			1. update vc
			2. create a change link (query: uuid from {
			new_email,
			id,
			})
		*/
		return c.SendStatus(fiber.StatusAccepted)
	}

	// user not exist
	return c.SendStatus(fiber.StatusNotFound)
}
