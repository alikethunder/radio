package ProfileEndpoints

import (
	"fmt"

	"web_project/cookies"

	"github.com/gofiber/fiber/v2"
)

func UpdateEmail(c *fiber.Ctx) error {

	hash := c.Params("hash")

	if hash != "" {

		data := cookies.ParseCookie(hash)

		if data["new_email"] != nil {
			fmt.Println("[UpdateEmail] update email : ", data)

		} else {

			fmt.Println("[UpdateEmail] deny update email : ", data)

		}

	}

	//return c.Status(fiber.StatusOK).JSON(user)

	return c.SendStatus(fiber.StatusForbidden)

}
