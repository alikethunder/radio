package RadioEndpoints

import (
	"encoding/json"
	"fmt"

	"web_project/cookies"
	"web_project/db"
	"web_project/db/Playlists"
	"web_project/functions"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Update(ctx *fiber.Ctx) error {

	admin := db.CheckRootAdmin(ctx)

	id := ctx.Params("id")

	if !admin {
		admin = db.CheckPermission(ctx, "stations", id, "admins")
	}

	if admin {

		var updated_fields fiber.Map

		json.Unmarshal(ctx.Body(), &updated_fields)

		if id == "new" {
			//new station
			id = gocql.TimeUUID().String()

			playlist_id := functions.TableId("playlist", id)

			//chat_id := functions.TableId("chat", station_id)
			//Chats.Create(chat_id)

			//create playlist
			Playlists.Create(playlist_id)

			updated_fields["render_order"], _ = db.Count("stations", "*", fiber.Map{})

		}

		fmt.Println("[RadioEndpoints.Update] updated_fields :", updated_fields)

		if err := db.Update(
			"stations",
			updated_fields,
			fiber.Map{
				"id": id,
			},
		); err == nil {

			return ctx.Status(fiber.StatusOK).Send([]byte(id))
		}
	}

	cookies.ClearAuthCookies(ctx)
	return ctx.SendStatus(fiber.StatusUnauthorized)
}
