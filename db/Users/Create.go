package Users

import (
	"web_project/db"
	"web_project/functions"
	"web_project/mailer"
	Types "web_project/types"

	"errors"
	//"time"

	"fmt"

	"github.com/gocql/gocql"
)

func Create(user Types.Map) (Types.Map, error) {

	//fmt.Println("Create user : ", user)
	var u Types.Map
	var err error

	_, oauth_flow := user["oauth"].(bool)

	if u, err = GetUserFields(Types.Map{"email": user["email"]}, "id", "password", "name"); err != nil {
		//fmt.Println("[Create] GetUserFields error : ", err)
		u = make(Types.Map)
	}

	if u["password"] == nil || u["password"] == "" || oauth_flow {

		//tm := time.Now()

		vc := functions.Vc()

		if err != nil && err.Error() == "not found" {
			//create new user
			fmt.Println("[Create] create new user")

			u["id"] = gocql.TimeUUID()

			if err := db.Session.Query(`INSERT INTO users (id, name, email) VALUES (?, ?, ?)`, u["id"], user["name"], user["email"]).Exec(); err != nil {
				return nil, err
			}

			if !oauth_flow {
				//update with verification code
				db.Update(
					"users",

					Types.Map{"verification_code": vc},

					Types.Map{
						"id":    u["id"],
						"email": user["email"],
					},
				)
			}
		} else {

			//update existing user without password
			fmt.Println("[Create] update existing user without password")

			if oauth_flow {
				if u["name"] == "" {
					db.Update(
						"users",

						Types.Map{
							"name": user["name"],
						},

						Types.Map{
							"id":    u["id"],
							"email": user["email"],
						},
					)
				}
			} else {
				db.Update(
					"users",

					Types.Map{
						"verification_code": vc,
						"name":              user["name"],
					},

					Types.Map{
						"id":    u["id"],
						"email": user["email"],
					},
				)
			}

		}

		if !oauth_flow {
			mailer.SendVc(vc, user["email"].(string), user["name"].(string))
		}

		return GetUserFields(Types.Map{"id": u["id"], "email": user["email"]}, "name", "email", "id")

	}

	return nil, errors.New("email exists")
}
