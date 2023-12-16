package Users

import (
	"go_react_starter/db"
	"go_react_starter/functions"
	"go_react_starter/mailer"

	"errors"
	//"time"

	"fmt"

	"github.com/gocql/gocql"
)

func Create(user UserMap) (UserMap, error) {

	//fmt.Println("Create user : ", user)
	var u UserMap
	var err error

	if u, err = GetUserFields(UserMap{"email": user["email"]}, "id", "password", "name"); err != nil {
		//fmt.Println("[Create] GetUserFields error : ", err)
		u = make(UserMap)
	}

	if u["password"] == nil || u["password"] == "" || user["oauth"].(bool) {

		//tm := time.Now()

		vc := functions.Vc()

		if err != nil && err.Error() == "not found" {
			//create new user
			fmt.Println("[Create] create new user")

			u["id"] = gocql.TimeUUID()

			if err := db.Session.Query(`INSERT INTO users (id, name, email) VALUES (?, ?, ?)`, u["id"], user["name"], user["email"]).Exec(); err != nil {
				return nil, err
			}

			if !u["oauth"].(bool) {
				//update with verification code
				Update(UserMap{"verification_code": vc}, u["id"].(gocql.UUID), user["email"].(string))
			}
		} else {

			//update existing user without password
			fmt.Println("[Create] update existing user without password")

			if u["oauth"].(bool) {
				if u["name"] == "" {
					Update(UserMap{"name": user["name"]}, u["id"].(gocql.UUID), user["email"].(string))
				}
			} else {
				Update(UserMap{"verification_code": vc, "name": user["name"]}, u["id"].(gocql.UUID), user["email"].(string))
			}

		}

		if !u["oauth"].(bool) {
			mailer.SendVc(vc, user["email"].(string), user["name"].(string))
		}

		return GetUserFields(UserMap{"id": u["id"], "email": user["email"]}, "name", "email")

	}

	return nil, errors.New("email exists")
}
