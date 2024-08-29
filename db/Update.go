package db

import (
	"fmt"
	"strings"
	Types "web_project/types"
)

func Update(table string, insert_parameters Types.Map, key_parameters Types.Map) error {

	for k := range key_parameters {
		delete(insert_parameters, k)
	}

	if len(insert_parameters) > 0 && len(key_parameters) > 0 {

		var insertString strings.Builder
		var keyString strings.Builder

		values := make([]interface{}, len(insert_parameters)+len(key_parameters))

		i := 0

		for key, val := range insert_parameters {

			insertString.WriteString(key)
			insertString.WriteString(` = ?`)

			if i != len(insert_parameters)-1 {
				insertString.WriteString(", ")
			}

			values[i] = val

			i++
		}

		j := 0
		for key, val := range key_parameters {

			keyString.WriteString(key)
			keyString.WriteString(` = ?`)

			if j != len(key_parameters)-1 {
				keyString.WriteString(" AND ")
			}

			values[i] = val

			j++
			i++
		}

		query := "UPDATE " + table + " SET " + insertString.String() + " WHERE " + keyString.String()

		//fmt.Println("[Update] query : ", query)
		//fmt.Println("[Update] values : ", values)

		if err := Session.Query(query, values...).Exec(); err != nil {

			fmt.Printf("[Update] table %s with insert parameters %s and key parameters %s, error : %s\n", table, insert_parameters, key_parameters, err)

			return err
		}

		return nil
	}

	return fmt.Errorf("[Update] Error: table %s with insert parameters %s and key parameters %s", table, insert_parameters, key_parameters)
}
