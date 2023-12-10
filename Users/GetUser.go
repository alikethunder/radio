package Users

import (
	//"fmt"
	"strings"

	"go_react_starter/db"
)

func GetUser(user UserMap, keys ...string) (UserMap, error) {
	//fmt.Println("[GetUser] user : ", user)
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

	//querystring.WriteString(`FROM users WHERE id = ? AND email = ?`)
	querystring.WriteString(`FROM users WHERE `)
	var values []interface{}

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

	querystring.WriteString(` LIMIT 1 ALLOW FILTERING`)

	//fmt.Println("[GetUser] querystring : ", querystring.String())

	//fmt.Println("[GetUser] values : ", values)

	if err := db.Session.Query(querystring.String(), values...).MapScan(u); err != nil {
		return nil, err
	}

	//fmt.Println(`[GetUser] user from db : `, u)
	return u, nil

}
