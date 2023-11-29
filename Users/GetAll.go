package Users

import (
	"github.com/gocql/gocql"
	"go_react_starter/db"
	"time"
)

var query = db.Session.Query("SELECT * FROM users")

func GetAll() []User {
	var userList []User
	m := map[string]interface{}{}
	iterable := query.Iter()

	for iterable.MapScan(m) {
		userList = append(userList, User{
			Id:      m["id"].(gocql.UUID),
			Name:    m["name"].(string),
			Created: m["created"].(time.Time),
			Updated: m["updated"].(time.Time),
			Email:   m["email"].(string),
		})

		m = map[string]interface{}{}
	}
	return userList
}
