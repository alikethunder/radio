package AuthEndpoints

import (
	"encoding/json"
	"fmt"
	"time"

	"web_project/cookies"
	"web_project/db"
	Users "web_project/db/Users"
	"web_project/functions"
	Types "web_project/types"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Verification(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var user_json Types.Map

	json.Unmarshal(c.Body(), &user_json)

	//fmt.Println("Signup user : ", u)

	user, err := Users.GetUserFields(Types.Map{"email": user_json["email"]}, "id", "verification_code", "name")

	if err != nil {
		fmt.Println("[Verification] GetUserFields error : ", err)
	}

	if user != nil && user["verification_code"] == user_json["verification_code"] {

		p, _ := functions.HashPassword(user_json["password"].(string))

		tm := time.Now().UTC().String()

		db.Update(
			"users",

			Types.Map{
				"password":          p,
				"verification_code": nil,
				"last_seen":         tm,
			},

			Types.Map{
				"id":    user["id"],
				"email": user_json["email"],
			},
		)

		cookies.SetAuthCookie(Types.Map{"email": user_json["email"], "rememberme": user_json["rememberme"], "id": user["id"]}, c)

		return c.Status(fiber.StatusOK).JSON(Types.Map{"id": user["id"], "created": user["id"].(gocql.UUID).Time(), "name": user["name"]})

	}

	return c.SendStatus(fiber.StatusForbidden)
}
