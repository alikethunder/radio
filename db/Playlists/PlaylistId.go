package Playlists

import (
	"web_project/functions"
)

func PlaylistId(station_id string) string {
	return "playlist_" + functions.UuidHyphensToUnderscores(station_id)

}
