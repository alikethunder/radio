package Auth

import (
	"encoding/json"
	"fmt"

	"go_react_starter/Users"
	"go_react_starter/functions"
	"go_react_starter/mailer"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func ResetPassword(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var u Users.UserMap

	json.Unmarshal(c.Body(), &u)

	//fmt.Println("ResetPassword user : ", u)

	user, err := Users.GetUserFields(Users.UserMap{"email": u["email"]}, "id", "name")

	if err != nil {
		fmt.Println("[ResetPassword] GetUserFields error : ", err)
	}

	if user != nil {
		vc := functions.Vc()

		Users.Update(Users.UserMap{"verification_code": vc}, user["id"].(gocql.UUID), u["email"].(string))

		mailer.SendVc(vc, u["email"].(string), user["name"].(string))

		return c.SendStatus(fiber.StatusOK)
	}

	return c.SendStatus(fiber.StatusForbidden)
}
