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

	var u fiber.Map

	json.Unmarshal(c.Body(), &u)

	fmt.Println("[ResetPassword] user : ", u)

	user, _ := db.SelectRow("users", fiber.Map{"email": u["email"]}, "id", "name")

	fmt.Println("[ResetPassword] user : ", user)

	if user != nil {
		vc := functions.Vc()

		db.Update(
			"users",

			fiber.Map{"verification_code": vc},

			fiber.Map{
				"id":    user["id"],
				"email": u["email"].(string),
			},
		)

		mailer.SendVc(vc, u["email"].(string), user["name"].(string))

		return c.SendStatus(fiber.StatusOK)
	}

	return c.SendStatus(fiber.StatusForbidden)
}
