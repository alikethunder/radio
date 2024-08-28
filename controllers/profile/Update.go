package ProfileEndpoints

import (
	"bytes"
	"fmt"
	"io"

	"web_project/cookies"
	Users "web_project/db/Users"
	Types "web_project/types"

	"github.com/gofiber/fiber/v2"

	"github.com/gocql/gocql"
)

func Update(c *fiber.Ctx) error {

	authCookie := c.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		u := cookies.ParseAuthCookie(c.Cookies(cookies.AuthCookieName))

		id := c.FormValue("id")

		if u["id"] == id {

			photo, err := c.FormFile("photo")

			if err != nil {
				fmt.Println("[ProfileEndpoints.Update] FormFile error : ", err)
			}

			name := c.FormValue(("name"))

			uuid, err := gocql.ParseUUID(id)

			if err != nil {
				fmt.Println("[ProfileEndpoints.Update] ParseUUID error : ", err)
			}

			user, err := Users.GetUserFields(Types.Map{"id": uuid}, "email")

			if err != nil {
				fmt.Println("[ProfileEndpoints.Update] GetUserFields error : ", err)
			}

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

			if err := Users.Update(updated_fields, uuid, user["email"].(string)); err != nil {

				fmt.Println("[ProfileEndpoints.Update] update user err : ", err)
				return c.SendStatus(fiber.StatusForbidden)
			}

			return c.Status(fiber.StatusOK).JSON(Types.Map{"name": name})
		}

	}
	return c.SendStatus(fiber.StatusUnauthorized)
}
