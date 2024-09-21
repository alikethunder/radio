package RadioEndpoints

import (
	"encoding/json"
	"fmt"

	"slices"
	"web_project/cookies"
	"web_project/db"
	"web_project/db/Playlists"
	"web_project/functions"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Update(ctx *fiber.Ctx) error {

	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))

		db_user, _ := db.SelectRow("users", fiber.Map{"id": cookie_user["id"]}, "admin")

		var updated_fields fiber.Map

		is_admin := db_user["admin"].(bool)

		json.Unmarshal(ctx.Body(), &updated_fields)

		fmt.Println("[RadioEndpoints.Update] updated_fields :", updated_fields)

		//fmt.Printf("[RadioEndpoints.Update] station_id =  %s \n", station_id)

		if !is_admin && updated_fields["id"] != nil {

			station, _ := db.SelectRow("stations", fiber.Map{"id": updated_fields["id"]}, "admins")

			fmt.Println("[RadioEndpoints.Update] station :", station)

			is_admin = station["admins"] != nil && slices.Contains(station["admins"].([]string), cookie_user["id"].(string))

		}

		if is_admin {

			if updated_fields["id"] == nil {
				//new station
				updated_fields["id"] = gocql.TimeUUID().String()

				playlist_id := functions.TableId("playlist", updated_fields["id"].(string))

				//chat_id := functions.TableId("chat", station_id)
				//Chats.Create(chat_id)

				//create playlist
				Playlists.Create(playlist_id)

				updated_fields["render_order"], _ = db.Count("stations", "*", fiber.Map{})

			}

			//fmt.Printf("[RadioEndpoints.Update] station_id =  %s \n", station_id)

			err := db.Update(
				"stations",
				updated_fields,
				fiber.Map{
					"id": updated_fields["id"],
				},
			)

			if err != nil {

				fmt.Println("[RadioEndpoints.Update] update user err : ", err)
				return ctx.SendStatus(fiber.StatusForbidden)
			}

			return ctx.Status(fiber.StatusOK).Send([]byte(updated_fields["id"].(string)))
		}

	}

	cookies.ClearAuthCookies(ctx)
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
