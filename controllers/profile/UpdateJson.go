package ProfileEndpoints

import (
	"fmt"

	"web_project/cookies"
	"web_project/db"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
)

func UpdateJson(ctx *fiber.Ctx) error {

	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))

		_, err := db.SelectRow("users", fiber.Map{"email": cookie_user["email"], "id": cookie_user["id"]}, "name")

		if err != nil && err.Error() == "not found" {

			// user not exist
			return ctx.SendStatus(fiber.StatusNotFound)

		} else {

			var req_json fiber.Map

			json.Unmarshal(ctx.Body(), &req_json)

			fmt.Println("[ProfileEndpoints.UpdateJson] req_json : ", req_json)

			if err := db.Update(
				"users",
				req_json,
				fiber.Map{
					"id":    cookie_user["id"],
					"email": cookie_user["email"],
				},
			); err != nil {

				fmt.Println("[ProfileEndpoints.UpdateJson] update user err : ", err)
				return ctx.SendStatus(fiber.StatusForbidden)
			}

			return ctx.SendStatus(fiber.StatusAccepted)
		}

	}

	//cookies.ClearAuthCookies(ctx)
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
