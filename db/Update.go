package db

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func Update(table string, orig_insert_parameters fiber.Map, key_parameters fiber.Map) error {

	insert_parameters := make(fiber.Map)

	//create insert map without key_parameters
	for k, v := range orig_insert_parameters {
		if _, ok := key_parameters[k]; !ok {
			insert_parameters[k] = v
		}
	}

	if len(insert_parameters) > 0 && len(key_parameters) > 0 {

		var insertString strings.Builder

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

			fmt.Printf("[Update] table %s with insert parameters %s and key parameters %s, error : %s\n", table, insert_parameters, key_parameters, err)

			return err
		}

		return nil
	}

	return fmt.Errorf("[Update] Error: table %s with insert parameters %s and key parameters %s", table, insert_parameters, key_parameters)
}
