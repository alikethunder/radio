package ProfileEndpoints

import (
	"fmt"
	"os"

	"github.com/goccy/go-json"

	"web_project/cookies"
	"web_project/db"
	"web_project/functions"
	"web_project/mailer"

	"github.com/gofiber/fiber/v2"
)

func RequestUpdateEmail(c *fiber.Ctx) error {

	authCookie := c.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		var req_json fiber.Map

		json.Unmarshal(c.Body(), &req_json)

		//get the auth cookie info
		cookie_user := cookies.ParseCookie(c.Cookies(cookies.AuthCookieName))

		stored_user, err := db.SelectRow("users", fiber.Map{"email": cookie_user["email"], "id": cookie_user["id"]}, "name")

		fmt.Println("[ProfileEndpoints.RequestUpdateEmail] stored_user : ", stored_user)

		if err != nil && err.Error() == "not found" {

			// user not exist
			return c.SendStatus(fiber.StatusNotFound)

		} else {

			//user exists
			//update vc - deny button will clear this and the email will not be updated if there is no vc
			vc := functions.Vc()

			if err := db.Update(
				"users",

				fiber.Map{"verification_code": vc},

				fiber.Map{
					"id":    cookie_user["id"],
					"email": cookie_user["email"],
				},
			); err != nil {

				fmt.Println("[ProfileEndpoints.RequestUpdateEmail] update user err : ", err)
				return c.SendStatus(fiber.StatusForbidden)
			}

			//create a change link as signed cookie
			update_email_hash := cookies.SignCookie(fiber.Map{
				"id":        cookie_user["id"],
				"old_email": cookie_user["email"],
				"vc":        vc,
				"new_email": req_json["new_email"],
			})

			//create deny link with old_email, id and vc
			deny_update_email_hash := cookies.SignCookie(fiber.Map{
				"id":        cookie_user["id"],
				"old_email": cookie_user["email"],
			})

			domain := "http://localhost:" + os.Getenv("PORT")

			if os.Getenv("ENV") == "prod" {
				domain = "https://radio.best"
			}

			mailer.SendRequestUpdateEmail(fiber.Map{
				"NewEmail":   req_json["new_email"],
				"UpdateHash": update_email_hash,
				"DenyHash":   deny_update_email_hash,
				"Name":       stored_user["name"],
				"OldEmal":    cookie_user["email"],
				"domain":     domain,
			})

			return c.SendStatus(fiber.StatusAccepted)

		}
	}

	cookies.ClearAuthCookies(c)
	return c.SendStatus(fiber.StatusUnauthorized)
}
