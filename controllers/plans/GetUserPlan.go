package PlansEndpoints

import (
	"fmt"

	"web_project/cookies"
	Users "web_project/db/Users"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
)

func GetUserPlan(c *fiber.Ctx) error {

	authCookie := c.Cookies("auth")
	//fmt.Println("[Index] auth cookie : ", authCookie, authCookie == "")

	if authCookie != "" {

		u := cookies.ParseAuthCookie(c.Cookies("auth"))

		user, err := Users.GetUserFields(Types.Map{"email": u["email"]}, "subscription_plan", "subscription_plan_ends")

		if err != nil {
			fmt.Println("[GetUserPlan] GetUserFields error : ", err)

		} else {
			return c.Status(fiber.StatusOK).JSON(Types.Map{"subscription_plan": Types.Map{"name": user["subscription_plan"], "ends": user["subscription_plan_ends"]}})
		}
	}

	return c.SendStatus(fiber.StatusForbidden)
}
