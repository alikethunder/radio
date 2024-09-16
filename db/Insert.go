package db

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func Insert(table string, parameters fiber.Map) error {

	if len(parameters) > 0 {

		var querystring strings.Builder

		var questions strings.Builder

		values := make([]interface{}, len(parameters))

		i := 0

		for key, val := range parameters {

			querystring.WriteString(key)
			questions.WriteString("?")

			if i != len(parameters)-1 {
				querystring.WriteString(`, `)
				questions.WriteString(", ")
			}

			values[i] = val

			i++
		}

		if err := Session.Query("INSERT INTO "+table+" ("+querystring.String()+") VALUES ("+questions.String()+")", values...).Exec(); err != nil {

			fmt.Printf("[Insert] into table %s with parameters %s, error : %s\n", table, parameters, err)

			return err
		}

		return nil
	}

	return fmt.Errorf("[Insert] into table %s empty incoming parameters", table)
}
