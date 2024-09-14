package AuthEndpoints

import (
	"encoding/json"
	"time"

	"web_project/cookies"
	"web_project/db"
	"web_project/functions"
	Types "web_project/types"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Signin(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var req_json Types.Map

	json.Unmarshal(c.Body(), &req_json)

	//fmt.Println("Signup user : ", u)

	user, _ := db.SelectRow("users", Types.Map{"email": req_json["email"]}, "id", "password", "name")

	if user != nil && user["password"] != "" && user["password"] != nil {

		correctPassword := functions.CheckPasswordHash(req_json["password"].(string), user["password"].(string))

		if correctPassword {

			cookies.SetAuthCookie(Types.Map{"email": req_json["email"], "rememberme": req_json["rememberme"], "id": user["id"]}, c)

			tm := time.Now().UTC().String()

			db.Update(
				"users",

				Types.Map{"last_seen": tm},

				Types.Map{
					"id":    user["id"],
					"email": req_json["email"],
				},
			)

			return c.Status(fiber.StatusOK).JSON(Types.Map{"id": user["id"], "created": user["id"].(gocql.UUID).Time(), "name": user["name"]})

		} else {
			//wrong password
			return c.SendStatus(fiber.StatusUnauthorized)
		}

	}

	//user not exist
	return c.SendStatus(fiber.StatusForbidden)

}
