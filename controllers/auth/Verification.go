package AuthEndpoints

import (
	"encoding/json"
	"time"

	"web_project/cookies"
	"web_project/db"
	"web_project/functions"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Verification(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var user_json fiber.Map

	json.Unmarshal(c.Body(), &user_json)

	//fmt.Println("Signup user : ", u)

	user, _ := db.SelectRow("users", fiber.Map{"email": user_json["email"]}, "id", "verification_code", "name")

	if user != nil && user["verification_code"] == user_json["verification_code"] {

		p, _ := functions.HashPassword(user_json["password"].(string))

		tm := time.Now().UTC().String()

		db.Update(
			"users",

			fiber.Map{
				"password":          p,
				"verification_code": nil,
				"last_seen":         tm,
			},

			fiber.Map{
				"id":    user["id"],
				"email": user_json["email"],
			},
		)

		cookies.SetAuthCookie(fiber.Map{"email": user_json["email"], "rememberme": user_json["rememberme"], "id": user["id"]}, c)

		return c.Status(fiber.StatusOK).JSON(fiber.Map{"id": user["id"], "created": user["id"].(gocql.UUID).Time(), "name": user["name"]})

	}

	return c.SendStatus(fiber.StatusForbidden)
}
