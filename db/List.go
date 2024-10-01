package db

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

func List(table string, key_parameters fiber.Map, select_parameters ...string) (results []fiber.Map) {

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

	values := make([]interface{}, len(key_parameters))

	if len(key_parameters) > 0 {

		selectString.WriteString(` WHERE `)

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

	}

	selectString.WriteString(` ALLOW FILTERING`)

	//fmt.Println("[db.List] selectString : ", selectString.String())
	//fmt.Println("[db.List] values : ", values)

	iter := Session.Query(selectString.String(), values...).Iter()

	for {
		result := make(fiber.Map)
		if !iter.MapScan(result) {
			break
		}

		results = append(results, result)
	}

	return results
}
