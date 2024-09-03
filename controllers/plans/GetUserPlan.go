package PlansEndpoints

import (
	"web_project/cookies"
	"web_project/db"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
)

func GetUserPlan(c *fiber.Ctx) error {

	authCookie := c.Cookies(cookies.AuthCookieName)
	//fmt.Println("[Index] auth cookie : ", authCookie, authCookie == "")

	if authCookie != "" {

		u := cookies.ParseCookie(c.Cookies(cookies.AuthCookieName))

		user, _ := db.Select("users", Types.Map{"email": u["email"]}, "subscription_plan", "subscription_plan_ends")

		if user != nil {
			return c.Status(fiber.StatusOK).JSON(Types.Map{"name": user["subscription_plan"], "ends": user["subscription_plan_ends"]})
		}
	}

	return c.SendStatus(fiber.StatusForbidden)
}
