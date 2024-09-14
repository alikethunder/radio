package AuthEndpoints

import (
	"encoding/json"

	"web_project/db"
	"web_project/functions"
	"web_project/mailer"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
)

func ResetPassword(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var u Types.Map

	json.Unmarshal(c.Body(), &u)

	//fmt.Println("ResetPassword user : ", u)

	user, _ := db.SelectRow("users", Types.Map{"email": u["email"]}, "id", "name")

	if user != nil {
		vc := functions.Vc()

		db.Update(
			"users",

			Types.Map{"verification_code": vc},

			Types.Map{
				"id":    user["id"],
				"email": u["email"].(string),
			},
		)

		mailer.SendVc(vc, u["email"].(string), user["name"].(string))

		return c.SendStatus(fiber.StatusOK)
	}

	return c.SendStatus(fiber.StatusForbidden)
}
