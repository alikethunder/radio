package db

import (
	"fmt"
	"strings"
	Types "web_project/types"
)

func Delete(table string, parameters Types.Map) error {

	if len(parameters) > 0 {

		var querystring strings.Builder

		values := make([]interface{}, len(parameters))

		i := 0

		for key, val := range parameters {

			querystring.WriteString(key)
			querystring.WriteString(`=?`)

			if i != len(parameters)-1 {
				querystring.WriteString(" AND ")
			}

			values[i] = val

			i++
		}

		query := "DELETE FROM " + table + " WHERE " + querystring.String()

		/* fmt.Println("[Delete] query : ", query)
		fmt.Println("[Delete] values : ", values) */

		if err := Session.Query(query, values...).Exec(); err != nil {

			fmt.Printf("[Delete] from table %s with parameters %s, error : %s\n", table, parameters, err)

			return err
		}

		return nil
	}

	return fmt.Errorf("[Delete] from table %s empty incoming parameters", table)
}
