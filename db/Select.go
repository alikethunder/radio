package db

import (
	"fmt"
	"strings"
	Types "web_project/types"
)

func Select(table string, key_parameters Types.Map, select_parameters ...string) (Types.Map, error) {

	if len(key_parameters) > 0 {
		result := make(Types.Map)

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

		selectString.WriteString(` FROM users WHERE `)
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

		selectString.WriteString(` LIMIT 1 ALLOW FILTERING`)

		//fmt.Println("[Update] selectString : ", selectString.String())
		//fmt.Println("[Update] values : ", values)

		if err := Session.Query(selectString.String(), values...).MapScan(result); err != nil {

			fmt.Printf("[Select] Error: table %s with key_parameters %s and select_parameters %s : %s\n", table, key_parameters, select_parameters, err)

			return nil, err
		}

		return result, nil
	}

	return nil, fmt.Errorf("[Select] Error: Not enough key parameters; Parameters: table %s with key_parameters %s and select_parameters %s", table, key_parameters, select_parameters)
}
