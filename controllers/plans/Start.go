package PlansEndpoints

import (
	"encoding/json"
	"fmt"

	"sale_platform/Users"
	"sale_platform/cookies"
	"sale_platform/functions"
	"sale_platform/mailer"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Start(c *fiber.Ctx) error {

	authCookie := c.Cookies("auth")

	if authCookie != "" {

		u := cookies.ParseAuthCookie(c.Cookies("auth"))

		user, err := Users.GetUserFields(Users.UserMap{"email": u["email"]}, "id", "name", "email")

		if err != nil {
			fmt.Println("[Index] GetUserFields error : ", err)
		}

		user["created"] = user["id"].(gocql.UUID).Time()

		cookies.SetUserCookie(user, c)

		cookies.SetAuthCookie(u, c)

	}

	var u Users.UserMap

	json.Unmarshal(c.Body(), &u)

	//fmt.Println("ResetPassword user : ", u)

	user, err := Users.GetUserFields(Users.UserMap{"email": u["email"]}, "id", "name")

	if err != nil {
		fmt.Println("[Start] GetUserFields error : ", err)
	}

	if user != nil {
		vc := functions.Vc()

		Users.Update(Users.UserMap{"verification_code": vc}, user["id"].(gocql.UUID), u["email"].(string))

		mailer.SendVc(vc, u["email"].(string), user["name"].(string))

		return c.SendStatus(fiber.StatusOK)
	}

	return c.SendStatus(fiber.StatusForbidden)
}
