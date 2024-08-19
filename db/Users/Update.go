package Users

import (
	"errors"
	"fmt"
	"strings"

	"web_project/db"
	Types "web_project/types"

	"github.com/gocql/gocql"
)

func Update(user Types.Map, id gocql.UUID, email string) error {
	fmt.Println("[Update users] incoming user update : ", user, id, email)
	if len(user) > 0 {

		var querystring strings.Builder

		querystring.WriteString(`UPDATE users SET `)

		var values []interface{}

		delete(user, "id")
		delete(user, "email")

		i := 0

		for k, v := range user {

			if k != "id" && k != "email" {
				querystring.WriteString(k)
				querystring.WriteString(` = ?`)

				if i != len(user)-1 {
					querystring.WriteString(`, `)
				}

				values = append(values, v)
			}
			i++
		}

		values = append(values, &id, &email)

		querystring.WriteString(` WHERE id = ? AND email = ?`)

		//fmt.Println("[Update user] querystring : ", querystring.String(), values)

		if err := db.Session.Query(querystring.String(), values...).Exec(); err != nil {
			fmt.Println("[Update user] error : ", err)
			return err
		}

		return nil
	}

	return errors.New("[Update user] empty incoming user")
}
