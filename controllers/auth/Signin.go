package AuthEndpoints

import (
	"encoding/json"
	"fmt"
	"time"

	"web_project/cookies"
	Users "web_project/db/Users"
	"web_project/functions"
	"web_project/types"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Signin(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var req_json Types.Map

	json.Unmarshal(c.Body(), &req_json)

	//fmt.Println("Signup user : ", u)

	user, err := Users.GetUserFields(Types.Map{"email": req_json["email"]}, "id", "password", "name")

	if err != nil {
		fmt.Println("[Signin] GetUserFields error : ", err)
	}

	if user != nil && user["password"] != "" && user["password"] != nil {

		correctPassword := functions.CheckPasswordHash(req_json["password"].(string), user["password"].(string))

		if correctPassword {

			cookies.SetAuthCookie(Types.Map{"email": req_json["email"], "rememberme": req_json["rememberme"], "id": user["id"]}, c)

			//created, _ := gocql.ParseUUID(user["id"].(gocql.UUID))

			tm := time.Now().UTC().String()

			Users.Update(Types.Map{"last_seen": tm}, user["id"].(gocql.UUID), req_json["email"].(string))

			return c.Status(fiber.StatusOK).JSON(Types.Map{"id": user["id"], "created": user["id"].(gocql.UUID).Time(), "name": user["name"]})

		} else {
			//wrong password
			return c.SendStatus(fiber.StatusUnauthorized)
		}

	}

	//user not exist
	return c.SendStatus(fiber.StatusForbidden)

}
