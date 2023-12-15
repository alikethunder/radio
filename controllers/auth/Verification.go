package Auth

import (
	"encoding/json"
	"fmt"

	"go_react_starter/Users"
	"go_react_starter/cookies"
	"go_react_starter/functions"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Verification(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var u Users.UserMap

	json.Unmarshal(c.Body(), &u)

	//fmt.Println("Signup user : ", u)

	user, err := Users.GetUserFields(Users.UserMap{"email": u["email"]}, "id", "verification_code", "name")

	if err != nil {
		fmt.Println("[Verification] GetUserFields error : ", err)
	}

	if user != nil && user["verification_code"] == u["verification_code"] {

		p, _ := functions.HashPassword(u["password"].(string))

		Users.Update(Users.UserMap{"password": p, "verification_code": nil}, user["id"].(gocql.UUID), u["email"].(string))

		cookies.SetAuthCookie(Users.UserMap{"email": u["email"], "rememberme": u["rememberme"]}, c)

		created, _ := gocql.ParseUUID(user["id"].(string))

		return c.Status(fiber.StatusOK).JSON(Users.UserMap{"id": user["id"], "created": created.Time(), "name": user["name"]})

	}

	return c.SendStatus(fiber.StatusForbidden)
}
