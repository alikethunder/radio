package Users

import (
	"errors"
	"fmt"
	"go_react_starter/db"
	"time"

	"github.com/gocql/gocql"
)

func Create(user UserMap) (UserMap, error) {

	fmt.Println("Create user : ", user)
	var existing_email string

	//add to query condition password not null
	db.Session.Query(`SELECT email FROM users WHERE email = ? AND WHERE password IS NOT NULL LIMIT 1 ALLOW FILTERING`, user["email"]).Scan(&existing_email)

	if existing_email != user["email"] {
		//new user

		tm := time.Now()

		if err := db.Session.Query(`INSERT INTO users (id, name, email, updated) VALUES (?, ?, ?, ?)`, gocql.TimeUUID(), user["name"], user["email"], tm).Exec(); err != nil {
			return nil, err
		}

		//update with verification code

		return GetByParameters(user, "id", "name", "email", "updated")

	} else {
		return nil, errors.New("email exists")
	}
}
