package db

import (
	"fmt"

	"slices"
	"web_project/cookies"

	"github.com/gofiber/fiber/v2"
)

//Checks if user id is in the set column specified as permission for given table and row_id

func CheckPermission(ctx *fiber.Ctx, table, row_id, permission string) bool {

	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))

		if table != "" && row_id != "" {

			row, _ := SelectRow(table, fiber.Map{"id": row_id}, permission)

			fmt.Println("[db.CheckPermission] row :", row)

			return row[permission] != nil && slices.Contains(row[permission].([]string), cookie_user["id"].(string))

		}

	}
	return false
}
