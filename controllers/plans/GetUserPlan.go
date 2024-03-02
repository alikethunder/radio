package PlansEndpoints

import (
	"fmt"

	"web_project/cookies"
	Users "web_project/db/Users"
	"web_project/types"

	"github.com/gofiber/fiber/v2"
)

func GetUserPlan(c *fiber.Ctx) error {

	authCookie := c.Cookies("auth")
	//fmt.Println("[Index] auth cookie : ", authCookie, authCookie == "")

	if authCookie != "" {

		u := cookies.ParseAuthCookie(c.Cookies("auth"))

		user, err := Users.GetUserFields(Types.Map{"email": u["email"]}, "seller_plan", "seller_plan_ends")

		if err != nil {
			fmt.Println("[GetUserPlan] GetUserFields error : ", err)

		} else {

			return c.Status(fiber.StatusOK).JSON(user)
		}

	}

	return c.SendStatus(fiber.StatusForbidden)
}
