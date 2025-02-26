package db

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func SelectRowWithOrder(table string, key_parameters fiber.Map, order string, select_parameters ...string) (fiber.Map, error) {

	if len(key_parameters) > 0 {
		result := make(fiber.Map)

		var selectString strings.Builder

		selectString.WriteString(`SELECT `)

		if len(select_parameters) > 0 {
			for i, k := range select_parameters {

				selectString.WriteString(k)

				if i != len(select_parameters)-1 {
					selectString.WriteString(`,`)
				}
			}
		} else {
			selectString.WriteString(`*`)
		}

		selectString.WriteString(` FROM `)
		selectString.WriteString(table)
		selectString.WriteString(` WHERE `)
		values := make([]interface{}, len(key_parameters))

		i := 0
		for key, val := range key_parameters {

			selectString.WriteString(key)
			selectString.WriteString(` = ?`)

			if i != len(key_parameters)-1 {
				selectString.WriteString(` AND `)
			}

			values[i] = val
			i++
		}
		selectString.WriteString(` ORDER BY `)

		selectString.WriteString(order)

		selectString.WriteString(` LIMIT 1 ALLOW FILTERING`)

		//fmt.Println("[SelectRow] selectString : ", selectString.String())
		//fmt.Println("[SelectRow] values : ", values)

		if err := Session.Query(selectString.String(), values...).MapScan(result); err != nil {

			fmt.Printf("[SelectRow] Error: table %s with key_parameters %s and select_parameters %s : %s\n", table, key_parameters, select_parameters, err)

			return nil, err
		}

		return result, nil
	}

	return nil, fmt.Errorf("[SelectRow] Error: Not enough key parameters; Parameters: table %s with key_parameters %s and select_parameters %s", table, key_parameters, select_parameters)
}
