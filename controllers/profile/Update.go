package ProfileEndpoints

import (
	"bytes"
	"fmt"
	"io"

	"web_project/cookies"
	"web_project/db"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"
)

func Update(c *fiber.Ctx) error {

	authCookie := c.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		u := cookies.ParseCookie(c.Cookies(cookies.AuthCookieName))

		id := c.FormValue("id")

		if u["id"] == id {

			photo, err := c.FormFile("photo")

			if err != nil {
				fmt.Println("[ProfileEndpoints.Update] FormFile error : ", err)
			}

			name := c.FormValue(("name"))

			user, _ := db.Select("users", Types.Map{"id": id}, "email")

			updated_fields := Types.Map{"name": name}

			if photo != nil {
				b := bytes.NewBuffer(nil)

				photo_file, err := photo.Open()

				if err != nil {
					fmt.Println("[ProfileEndpoints.Update] photo.Open error : ", err)
				}

				if _, err := io.Copy(b, photo_file); err != nil {
					fmt.Println("[ProfileEndpoints.Update] io.Copy error : ", err)
				}

				updated_fields["photo"] = b.Bytes()
			}

			if err := db.Update(
				"users",
				updated_fields,
				Types.Map{
					"id":    id,
					"email": user["email"],
				},
			); err != nil {

				fmt.Println("[ProfileEndpoints.Update] update user err : ", err)
				return c.SendStatus(fiber.StatusForbidden)
			}

			return c.Status(fiber.StatusOK).JSON(Types.Map{"name": name})
		}

	}

	cookies.ClearAuthCookies(c)
	return c.SendStatus(fiber.StatusUnauthorized)
}
