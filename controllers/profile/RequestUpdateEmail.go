package ProfileEndpoints

import (
	"encoding/json"
	"fmt"

	"web_project/cookies"
	Users "web_project/db/Users"
	"web_project/functions"
	Types "web_project/types"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func RequestUpdateEmail(c *fiber.Ctx) error {

	var req_json Types.Map

	json.Unmarshal(c.Body(), &req_json)

	//get the auth cookie info
	cookie_user := cookies.ParseAuthCookie(c.Cookies(cookies.AuthCookieName))

	_, err := Users.GetUserFields(Types.Map{"email": cookie_user["email"], "id": cookie_user["id"].(gocql.UUID)}, "email")

	if err != nil {
		fmt.Println("[ProfileEndpoints.RequestUpdateEmail] GetUserFields error : ", err)
	}

	if err != nil && err.Error() == "not found" {

		// user not exist
		return c.SendStatus(fiber.StatusNotFound)

	} else {

		//user exists
		//update vc - deny button will clear this and the email will not be updated if there is no vc
		vc := functions.Vc()

		if err := Users.Update(Types.Map{
			"verification_code": vc,
		},
			cookie_user["id"].(gocql.UUID),
			cookie_user["email"].(string)); err != nil {

			fmt.Println("[ProfileEndpoints.RequestUpdateEmail] update user err : ", err)
			return c.SendStatus(fiber.StatusForbidden)
		}

		//create a change link as signed cookie
		update_email_uuid := cookies.SignCookie(Types.Map{
			"id":        cookie_user["id"],
			"old_email": cookie_user["email"],
			"vc":        vc,
			"new_email": req_json["new_email"],
		})

		//create deny link with old_email, id and vc
		deny_update_email_uuid := cookies.SignCookie(Types.Map{
			"id":        cookie_user["id"],
			"old_email": cookie_user["email"],
			"vc":        vc,
			"new_email": req_json["new_email"],
		})

		/*


			4. send email
		*/

		return c.SendStatus(fiber.StatusAccepted)

	}
}
