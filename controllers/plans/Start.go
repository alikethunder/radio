package PlansEndpoints

import (
	"encoding/json"
	"fmt"

	"web_project/cookies"
	"web_project/db"
	Users "web_project/db/Users"
	"web_project/functions"
	"web_project/mailer"
	Types "web_project/types"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

// contains unrelevanlt code
// to be developed
// purchase plan
func Start(c *fiber.Ctx) error {

	authCookie := c.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		u := cookies.ParseCookie(c.Cookies(cookies.AuthCookieName))

		user, err := Users.GetUserFields(Types.Map{"email": u["email"]}, "id", "name", "email")

		if err != nil {
			fmt.Println("[Index] GetUserFields error : ", err)
		}

		user["created"] = user["id"].(gocql.UUID).Time()

		cookies.SetUserCookie(user, c)

		cookies.SetAuthCookie(u, c)

	}

	var user_json Types.Map

	json.Unmarshal(c.Body(), &user_json)

	//fmt.Println("ResetPassword user : ", u)

	user, err := Users.GetUserFields(Types.Map{"email": user_json["email"]}, "id", "name")

	if err != nil {
		fmt.Println("[Start] GetUserFields error : ", err)
	}

	if user != nil {
		vc := functions.Vc()

		db.Update(
			"users",

			Types.Map{"verification_code": vc},

			Types.Map{
				"id":    user["id"],
				"email": user_json["email"],
			},
		)

		mailer.SendVc(vc, user_json["email"].(string), user["name"].(string))

		return c.SendStatus(fiber.StatusOK)
	}

	return c.SendStatus(fiber.StatusForbidden)
}
