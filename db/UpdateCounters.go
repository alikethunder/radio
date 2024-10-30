package db

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func UpdateCounters(table string, update_parameters fiber.Map, key_parameters fiber.Map) error {

	if len(update_parameters) > 0 && len(key_parameters) > 0 {

		var insertString strings.Builder

		values := make([]interface{}, len(update_parameters)+len(key_parameters))

		i := 0

		for key, val := range update_parameters {

			insertString.WriteString(key)
			insertString.WriteString(` = `)
			insertString.WriteString(key)
			insertString.WriteString(`?`)

			if i != len(update_parameters)-1 {
				insertString.WriteString(", ")
			}

			values[i] = val

			i++
		}

		insertString.WriteString(" WHERE ")

		j := 0
		for key, val := range key_parameters {

			insertString.WriteString(key)
			insertString.WriteString(` = ?`)

			if j != len(key_parameters)-1 {
				insertString.WriteString(" AND ")
			}

			values[i] = val

			j++
			i++
		}

		query := "UPDATE " + table + " SET " + insertString.String()

		//fmt.Println("[Update] query : ", query)
		//fmt.Println("[Update] values : ", values)

		if err := Session.Query(query, values...).Exec(); err != nil {

			fmt.Printf("[Update] table %s with update_parameters %s and key parameters %s, error : %s\n", table, update_parameters, key_parameters, err)

			return err
		}

		return nil
	}

	return fmt.Errorf("[Update] Error: table %s with update_parameters %s and key parameters %s", table, update_parameters, key_parameters)
}
