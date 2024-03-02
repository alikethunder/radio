package Users

import (
	"web_project/types"
)

// u {id, email}
func GetUserPlan(u Types.Map) (Types.Map, error) {

	user, err := GetUserFields(Types.Map{"email": u["email"]}, "id", "name", "email", "seller_plan")

	return user, err
}
