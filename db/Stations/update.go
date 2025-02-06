package Stations

import (
	"web_project/db"

	"github.com/gocql/gocql"

	"github.com/gofiber/fiber/v2"
)

func Update(id string, updated_fields fiber.Map) interface{} {

	if id == "new" {
		//new station
		id = gocql.TimeUUID().String()

		//playlist_id := functions.TableId("playlist", id)

		//chat_id := functions.TableId("chat", station_id)
		//Chats.Create(chat_id)

		//create playlist
		//Playlists.Create(playlist_id)

		updated_fields["render_order"], _ = db.Count("stations", "*", fiber.Map{})

		db.UpdateCounters(
			"station_counters",
			fiber.Map{
				"likes":     "+ 0",
				"listeners": "+ 0",
			},
			fiber.Map{
				"id": id,
			},
			true,
		)

	}

	//fmt.Println("[Stations.Update] updated_fields :", updated_fields)

	if err := db.Update(
		"stations",
		updated_fields,
		fiber.Map{
			"id": id,
		},
	); err == nil {
		return id
	}
	return nil
}
