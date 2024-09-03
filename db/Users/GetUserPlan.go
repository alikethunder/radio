package Users

import (
	"web_project/db"
	Types "web_project/types"
)

// u {id, email}
func GetUserPlan(u Types.Map) (Types.Map, error) {

	user, err := db.Select("users", Types.Map{"email": u["email"]}, "id", "name", "email", "subscription_plan", "subscription_plan_ends")

	return user, err
}
