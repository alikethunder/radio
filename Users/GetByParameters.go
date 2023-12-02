package Users

import (
	"fmt"
	"reflect"
	"strings"
)

func GetByParameters(user User, keys ...string) (User, error) {
	var u User

	//keys = what columns to select
	var querystring strings.Builder

	querystring.WriteString("SELECT ")

	//select specified columns or all
	if len(keys) > 0 {
		for i, k := range keys {

			querystring.WriteString(k)

			if i != len(keys)-1 {
				querystring.WriteString(", ")
			} else {
				querystring.WriteString(" ")
			}
		}
	} else {
		querystring.WriteString("* ")
	}

	querystring.WriteString("FROM users WHERE ")

	var values []interface{}
	var ks []string

	userVal := reflect.ValueOf(user)

	for i := 0; i < userVal.NumField(); i++ {

		f := userVal.Field(i)

		if f.Interface() != "" {

			ks = append(ks, userVal.Type().Field(i).Name)

			values = append(values, f)

		}
	}

	for i, v := range keys {
		querystring.WriteString(v)

		querystring.WriteString(" = ?")
		if i != len(ks)-1 {
			querystring.WriteString(" AND ")
		}
	}

	fmt.Println("[GetByParameters] querystring : ", querystring.String())

	return u, nil
}
