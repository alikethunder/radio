package PlansEndpoints

import (
	"github.com/goccy/go-json"

	"web_project/cookies"
	"web_project/db"
	"web_project/functions"
	"web_project/mailer"

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

		user, _ := db.SelectRow("users", fiber.Map{"email": u["email"]}, "id", "name", "email", "admin")

		user["created"] = user["id"].(gocql.UUID).Time()

		cookies.SetUserCookie(user, c)

		cookies.SetAuthCookie(u, c)

	}

	var user_json fiber.Map

	json.Unmarshal(c.Body(), &user_json)

	//fmt.Println("ResetPassword user : ", u)

	user, _ := db.SelectRow("users", fiber.Map{"email": user_json["email"]}, "id", "name")

	if user != nil {
		vc := functions.Vc()

		db.Update(
			"users",

			fiber.Map{"verification_code": vc},

			fiber.Map{
				"id":    user["id"],
				"email": user_json["email"],
			},
		)

		mailer.SendVc(vc, user_json["email"].(string), user["name"].(string))

		return c.SendStatus(fiber.StatusOK)
	}

	return c.SendStatus(fiber.StatusForbidden)
}
