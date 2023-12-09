package Users

import (
	"go_react_starter/db"
	"go_react_starter/functions"
	"go_react_starter/mailer"

	"errors"
	"time"

	//"fmt"

	"github.com/gocql/gocql"
)

func Create(user UserMap) (UserMap, error) {

	//fmt.Println("Create user : ", user)
	var password string
	var id gocql.UUID

	//add to query condition password not null
	err := db.Session.Query(`SELECT id, password FROM users WHERE email = ? LIMIT 1 ALLOW FILTERING`, user["email"]).Scan(&id, &password)

	if password == "" {

		tm := time.Now()

		vc := functions.Vc()

		if err != nil && err.Error() == "not found" {
			//create new user
			id := gocql.TimeUUID()

			if err := db.Session.Query(`INSERT INTO users (id, name, email, updated) VALUES (?, ?, ?, ?)`, id, user["name"], user["email"], tm).Exec(); err != nil {
				return nil, err
			}

			//update with verification code
			Update(UserMap{"verification_code": vc}, id, user["email"].(string))

		} else {

			//update existing user without password
			Update(UserMap{"verification_code": vc, "updated": tm, "name": user["name"]}, id, user["email"].(string))
		}

		mailer.SendVc(vc, user["email"].(string), user["name"].(string))

		return GetByParameters(UserMap{"id": id, "email": user["email"]}, "id", "name", "email", "updated")

	}

	return nil, errors.New("email exists")
}
