package db

import (
	"fmt"
	"strings"
	Types "web_project/types"
)

func Count(table string, column string, where_parameters Types.Map) (int, error) {

	// column == "*" || column name

	var queryString strings.Builder

	queryString.WriteString(`SELECT COUNT (`)

	queryString.WriteString(column)

	queryString.WriteString(") FROM ")

	queryString.WriteString(table)

	var count int

	values := make([]interface{}, len(where_parameters))

	if len(where_parameters) > 0 {

		queryString.WriteString(` WHERE `)

		i := 0
		for key, val := range where_parameters {

			queryString.WriteString(key)
			queryString.WriteString(` = ?`)

			if i != len(where_parameters)-1 {
				queryString.WriteString(` AND `)
			}

			values[i] = val
			i++
		}

		queryString.WriteString(" ALLOW FILTERING")
	}

	fmt.Println("[Count] selectString : ", queryString.String())
	fmt.Println("[Count] values : ", values)

	if err := Session.Query(queryString.String(), values...).Iter().Scan(&count); !err {

		return 0, fmt.Errorf("[Count] Error: table %s with column %s and where_parameters %s", table, column, where_parameters)
	}

	return count, fmt.Errorf("[Count] Error: Not enough key parameters; Parameters: table %s with column %s and where_parameters %s", table, column, where_parameters)
}
