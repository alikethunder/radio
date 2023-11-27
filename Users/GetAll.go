package Users

import "go_react_starter/db"
import "github.com/gocql/gocql"

var query = db.Session.Query("SELECT * FROM users")

func GetAll() []User {
	var userList []User
	m := map[string]interface{}{}
	iterable := query.Iter()

	for iterable.MapScan(m) {
		userList = append(userList, User{
			//Id:      m["id"].(gocql.UUID),
			Name:    m["name"].(string),
			Created: m["created"].(uint64),
			Updated: m["updated"].(uint64),
			Email:   m["email"].(string),
		})

		m = map[string]interface{}{}
	}
	return userList
}
