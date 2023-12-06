package Users

import (
	//"fmt"
	"strings"

	"go_react_starter/db"
)

func GetByParameters(user UserMap, keys ...string) (UserMap, error) {
	//fmt.Println("[GetByParameters] user : ", user)
	u := make(UserMap)

	//keys = what columns to select
	var querystring strings.Builder

	querystring.WriteString(`SELECT `)

	//select specified columns or all
	if len(keys) > 0 {
		for i, k := range keys {

			querystring.WriteString(k)

			if i != len(keys)-1 {
				querystring.WriteString(`, `)
			} else {
				querystring.WriteString(` `)
			}
		}
	} else {
		querystring.WriteString(`* `)
	}

	querystring.WriteString(`FROM users WHERE id = ? AND email = ? `)

	/*var values []interface{}

	 i := 0
	for k, v := range user {

		querystring.WriteString(k)
		querystring.WriteString(` = ?`)

		if i != len(user)-1 {
			querystring.WriteString(` AND `)
		}

		values = append(values, v)
		i++
	}
	*/

	//fmt.Println("[GetByParameters] querystring : ", querystring.String())

	//fmt.Println("[GetByParameters] values : ", values)

	if err := db.Session.Query(querystring.String(), user["id"], user["email"]).MapScan(u); err != nil {
		return nil, err
	}

	//fmt.Println(`[GetByParameters] user from db : `, u)
	return u, nil

}
