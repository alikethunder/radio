package ProfileEndpoints

import (
	"fmt"

	"web_project/cookies"
	"web_project/db"
	"web_project/functions"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
)

func Update(ctx *fiber.Ctx) error {

	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		u := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))

		id := ctx.FormValue("id")

		if u["id"] == id {

			updated_fields := functions.ParseForm(ctx, []string{"name"}, []string{"photo"})

			user, _ := db.Select("users", Types.Map{"id": id}, "email")

			if err := db.Update(
				"users",
				updated_fields,
				Types.Map{
					"id":    id,
					"email": user["email"],
				},
			); err != nil {

				fmt.Println("[ProfileEndpoints.Update] update user err : ", err)
				return ctx.SendStatus(fiber.StatusForbidden)
			}

			return ctx.Status(fiber.StatusOK).JSON(Types.Map{"name": updated_fields["name"]})
		}

	}

	cookies.ClearAuthCookies(ctx)
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
