package RadioEndpoints

import (
	"fmt"

	"slices"
	"web_project/cookies"
	"web_project/db"
	"web_project/db/Playlists"
	"web_project/functions"
	Types "web_project/types"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Update(ctx *fiber.Ctx) error {

	authCookie := ctx.Cookies(cookies.AuthCookieName)

	if authCookie != "" {

		cookie_user := cookies.ParseCookie(ctx.Cookies(cookies.AuthCookieName))

		db_user, _ := db.SelectRow("users", Types.Map{"id": cookie_user["id"]}, "admin")

		station_id := ctx.FormValue("id")

		//fmt.Printf("[RadioEndpoints.Update] station_id =  %s \n", station_id)

		station, _ := db.SelectRow("stations", Types.Map{"id": station_id}, "admins")

		fmt.Println("[RadioEndpoints.Update] station :", station)

		if db_user["admin"] == true || (station["admins"] != nil && slices.Contains(station["admins"].([]string), cookie_user["id"].(string))) {

			updated_fields := functions.ParseForm(ctx, []string{"name"}, []string{"avatar"})

			//fmt.Println("[RadioEndpoints.Update] updated_fields :", updated_fields)

			if station_id == "" {
				//new station
				station_id = gocql.TimeUUID().String()

				//create playlist
				Playlists.Create(station_id)

				updated_fields["render_order"], _ = db.Count("stations", "*", Types.Map{})

			}

			//fmt.Printf("[RadioEndpoints.Update] station_id =  %s \n", station_id)

			err := db.Update(
				"stations",
				updated_fields,
				Types.Map{
					"id": station_id,
				},
			)

			if err != nil {

				fmt.Println("[RadioEndpoints.Update] update user err : ", err)
				return ctx.SendStatus(fiber.StatusForbidden)
			}

			return ctx.Status(fiber.StatusOK).Send([]byte(station_id))
		}

	}

	cookies.ClearAuthCookies(ctx)
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
