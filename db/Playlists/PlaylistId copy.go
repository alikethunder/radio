package Playlists

import (
	"strings"
	"web_project/functions"
)

func StationId(playlist_id string) string {
	return functions.UuidUnderscoresToHyphens(strings.ReplaceAll(playlist_id, "playlist_", ""))
}
