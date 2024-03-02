package Users

import (
	"web_project/db"
)

var getAll = db.Session.Query("SELECT * FROM users")

func GetAll() []UserMap {
	var userList []UserMap
	var user UserMap
	iterable := getAll.Iter()

	for iterable.MapScan(user) {
		userList = append(userList, user)

	}
	return userList
}
