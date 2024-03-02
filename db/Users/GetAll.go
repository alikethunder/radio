package Users

import (
	"web_project/db"
	"web_project/types"
)

var getAll = db.Session.Query("SELECT * FROM users")

func GetAll() []Types.Map {
	var userList []Types.Map
	var user Types.Map
	iterable := getAll.Iter()

	for iterable.MapScan(user) {
		userList = append(userList, user)

	}
	return userList
}
