package PlansEndpoints

import (
	/* "encoding/json"

	"github.com/gocql/gocql" */
	"fmt"
	"sale_platform/db"

	"github.com/gofiber/fiber/v2"
)

type PlanMap map[string]interface{}

func GetPlans(c *fiber.Ctx) error {

	var plans []PlanMap

	iterable := db.Session.Query("SELECT * FROM pricing_plans").Iter()

	for {
		plan := make(PlanMap)
		if !iterable.MapScan(plan) {
			break
		}
		//fmt.Println("plan : ", plan)
		plans = append(plans, plan)

	}

	fmt.Println("plans : ", plans)

	return c.Status(fiber.StatusOK).JSON(plans)

	//return c.SendStatus(fiber.StatusForbidden)
}
