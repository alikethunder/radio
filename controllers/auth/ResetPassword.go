package AuthEndpoints

import (
	"fmt"

	"github.com/goccy/go-json"

	"web_project/db"
	"web_project/functions"
	"web_project/mailer"

	"github.com/gofiber/fiber/v2"
)

func ResetPassword(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var json_user fiber.Map

	json.Unmarshal(c.Body(), &json_user)

	fmt.Println("[ResetPassword] user : ", json_user)

	user, _ := db.SelectRow("users", fiber.Map{"email": json_user["email"]}, "id", "name")

	fmt.Println("[ResetPassword] user : ", user)

	if user != nil {
		vc := functions.Vc()

		db.Update(
			"users",

			fiber.Map{"verification_code": vc},

			fiber.Map{
				"id":    user["id"],
				"email": json_user["email"].(string),
			},
		)

		mailer.SendVc(vc, json_user["email"].(string), user["name"].(string), json_user["language"].(string))

		return c.SendStatus(fiber.StatusOK)
	}

	return c.SendStatus(fiber.StatusForbidden)
}
