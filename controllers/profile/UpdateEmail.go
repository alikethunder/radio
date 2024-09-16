package ProfileEndpoints

import (
	"fmt"

	"web_project/cookies"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func UpdateEmail(c *fiber.Ctx) error {

	hash := c.Params("hash")

	if hash != "" {

		data := cookies.ParseCookie(hash)

		if data["new_email"] != nil {
			fmt.Println("[UpdateEmail] update email : ", data)

			user, err := db.SelectRow("users", fiber.Map{"id": data["id"], "email": data["old_email"]})

			if err != nil {
				return c.SendStatus(fiber.StatusForbidden)
			}

			if user["verification_code"] == data["vc"] && user["email"] == data["old_email"] {
				//update email by deleting old and inserting new
				user["email"] = data["new_email"]
				user["verification_code"] = ""

				if err := db.Delete(
					"users",

					fiber.Map{
						"id":    user["id"],
						"email": data["old_email"],
					},
				); err != nil {
					fmt.Println("[UpdateEmail] delete error : ", err)
					return c.SendStatus(fiber.StatusForbidden)
				}

				if err := db.Insert("users", user); err != nil {
					fmt.Println("[UpdateEmail] insert error : ", err)
					return c.SendStatus(fiber.StatusForbidden)
				}

				//update auth cookie
				cookies.SetAuthCookie(
					fiber.Map{
						"id":         data["id"],
						"email":      data["new_email"],
						"rememberme": true,
					},

					c,
				)

				return c.Redirect("/user-profile/" + data["id"].(string))

			}

		} else {

			fmt.Println("[UpdateEmail] deny update email : ", data)

			db.Update(
				"users",

				fiber.Map{"verification_code": ""},

				fiber.Map{
					"id":    data["id"],
					"email": data["old_email"],
				},
			)

			return c.Redirect("/")
		}

	}

	//return c.Status(fiber.StatusOK).JSON(user)

	return c.SendStatus(fiber.StatusForbidden)

}
