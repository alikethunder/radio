package AuthEndpoints

import (
	"time"

	"github.com/goccy/go-json"

	"web_project/cookies"
	"web_project/db"
	"web_project/functions"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Signin(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var req_json fiber.Map

	json.Unmarshal(c.Body(), &req_json)

	//fmt.Println("Signup user : ", u)

	user, _ := db.SelectRow("users", fiber.Map{"email": req_json["email"]}, "id", "password", "name")

	if user != nil {

		if user["password"] != "" && user["password"] != nil {

			correctPassword := functions.CheckPasswordHash(req_json["password"].(string), user["password"].(string))

			if correctPassword {

				cookies.SetAuthCookie(fiber.Map{"email": req_json["email"], "rememberme": req_json["rememberme"], "id": user["id"]}, c)

				tm := time.Now().UTC().Format(time.UnixDate)

				db.Update(
					"users",

					fiber.Map{"last_seen": tm},

					fiber.Map{
						"id":    user["id"],
						"email": req_json["email"],
					},
				)

				return c.Status(fiber.StatusOK).JSON(fiber.Map{"id": user["id"], "created": user["id"].(gocql.UUID).Time(), "name": user["name"]})

			}
		}
		//wrong password
		return c.SendStatus(fiber.StatusUnauthorized)

	}

	//user not exist
	return c.SendStatus(fiber.StatusForbidden)

}
