package PlansEndpoints

import (
	/* "encoding/json"

	"github.com/gocql/gocql" */
	//"fmt"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func GetPlans(c *fiber.Ctx) error {

	var plans []fiber.Map

	iterable := db.Session.Query("SELECT * FROM pricing_plans").Iter()

	for {
		plan := make(fiber.Map)
		if !iterable.MapScan(plan) {
			break
		}
		//fmt.Println("plan : ", plan)
		plans = append(plans, plan)

	}

	//fmt.Println("plans : ", plans)

	return c.Status(fiber.StatusOK).JSON(plans)

	//return c.SendStatus(fiber.StatusForbidden)
}
