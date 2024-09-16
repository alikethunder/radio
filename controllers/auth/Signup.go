package AuthEndpoints

import (
	"encoding/json"
	"fmt"

	Users "web_project/db/Users"

	"github.com/gofiber/fiber/v2"
)

func Signup(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var u fiber.Map

	json.Unmarshal(c.Body(), &u)

	//fmt.Println("Signup user : ", u)

	if user, err := Users.Create(u); err != nil {

		fmt.Println("[Signup] error : ", err)

		return c.SendStatus(fiber.StatusForbidden)

	} else {
		fmt.Println("user created : ", user)
		return c.Status(fiber.StatusOK).JSON(user)
	}
}
