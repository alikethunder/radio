package Users

import (
	"errors"
	"fmt"
	"go_react_starter/db"
	"time"

	"github.com/gocql/gocql"
)

func Create(user UserMap) (UserMap, error) {

	tm := time.Now()
	fmt.Println("Create user : ", user)
	var existing_email string

	db.Session.Query(`SELECT email FROM users WHERE email = ? LIMIT 1 ALLOW FILTERING`, user["email"]).Scan(&existing_email)

	if existing_email != user["email"] {
		//new user

		if err := db.Session.Query(`INSERT INTO users (id, name, email, updated) VALUES (?, ?, ?, ?)`, gocql.TimeUUID(), user["name"], user["email"], tm).Exec(); err != nil {
			return nil, err
		}

		return GetByParameters(user, "id", "name", "email", "updated")

	} else {
		return nil, errors.New("email exists")
	}
}
